import apiClient from '@/lib/api/client';
import apolloClient from '@/lib/graphql/client';
import {
  GET_ALL_USERS,
  GET_USER,
  GET_SELLER_PROFILE,
} from '@/lib/graphql/queries';
import { 
  CREATE_USER_MUTATION, 
  UPDATE_USER_MUTATION, 
  DELETE_USER_MUTATION 
} from '@/lib/graphql/mutations';
import { User, CreateUserInput, UpdateUserInput } from '@/types';

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (pagination?: { limit?: number; offset?: number }): Promise<User[]> => {
  const { data } = await apolloClient.query({
    query: GET_ALL_USERS,
    variables: {
      pagination: pagination || { limit: 100, offset: 0 }
    },
    fetchPolicy: 'network-only'
  }) as { data: { users: User[] } };

  return data.users;
};

/**
 * Get user by ID or username
 */
export const getUserById = async (term: string): Promise<User> => {
  const { data } = await apolloClient.query({
    query: GET_USER,
    variables: { term },
    fetchPolicy: 'network-only'
  }) as { data: { user: User } };

  return data.user;
};

/**
 * Create new user (admin only)
 */
export const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data } = await apolloClient.mutate({
    mutation: CREATE_USER_MUTATION,
    variables: { input }
  }) as { data: { createUser: User } };

  return data.createUser;
};

/**
 * Update user (admin only)
 */
export const updateUser = async (id: string, input: UpdateUserInput): Promise<User> => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[api/updateUser] sending payload', { id, input });
    }

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: { id, input }
    }) as { data: { updateUser: User } };

    if (!data || !data.updateUser) {
      throw new Error('No se pudo actualizar el usuario');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.info('[api/updateUser] response', data.updateUser);
    }

    return data.updateUser;
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[api/updateUser] error', error);
    }
    throw new Error(error?.graphQLErrors?.[0]?.message || error?.message || 'Error al actualizar usuario');
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  const { data } = await apolloClient.mutate({
    mutation: DELETE_USER_MUTATION,
    variables: { id }
  }) as { data: { removeUser: boolean } };

  return data.removeUser;
};

/**
 * Get seller profile with products count (public)
 */
export const getSellerProfile = async (id: string): Promise<User> => {
  const { data } = await apolloClient.query({
    query: GET_SELLER_PROFILE,
    variables: { id },
    fetchPolicy: 'network-only'
  }) as { data: { sellerProfile: User } };

  return data.sellerProfile;
};

/**
 * Update own profile via REST (auth users)
 */
export const updateMyProfile = async (id: string, input: UpdateUserInput): Promise<User> => {
  try {
    const { data } = await apiClient.put<User>(`/users/${id}`, input);
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Error al actualizar tu perfil';
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
};

