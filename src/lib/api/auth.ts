import apolloClient from '@/lib/graphql/client';
import {
  SIGNUP_MUTATION,
  LOGIN_MUTATION,
  ENABLE_2FA_MUTATION,
  VERIFY_2FA_MUTATION,
  DISABLE_2FA_MUTATION,
} from '@/lib/graphql/mutations';
import apiClient from './client';
import {
  SignupRequest,
  LoginRequest,
  Enable2FAResponse,
  Verify2FARequest,
  MessageResponse,
} from '@/types';
import { TOKEN_KEY } from '@/config/constants';

const ensureGraphQLPayload = (operation: string, payload: any) => {
  if (!payload) {
    throw new Error(
      `La operaci��n ${operation} no recibi�� respuesta del backend. Verifica que el servicio GraphQL est�� disponible.`
    );
  }
  return payload;
};

export const signup = async (data: SignupRequest): Promise<any> => {
  const { data: result } = await apolloClient.mutate({
    mutation: SIGNUP_MUTATION,
    variables: { input: data },
  });

  return ensureGraphQLPayload('signup', (result as any)?.signup);
};

export const getProfile = async (): Promise<{ user: any }> => {
  const response = await apiClient.get('/auth/profile');
  return { user: response.data };
};

export const login = async (data: LoginRequest): Promise<any> => {
  const { data: result } = await apolloClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: {
      input: {
        email: data.email,
        password: data.password,
        token: data.twoFactorCode,
      },
    },
  });

  return ensureGraphQLPayload('login', (result as any)?.login);
};

export const logout = async (): Promise<MessageResponse> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    // ignore
  }
  return { message: 'Logout successful' };
};

export const enable2FA = async (): Promise<Enable2FAResponse> => {
  const { data } = await apolloClient.mutate({
    mutation: ENABLE_2FA_MUTATION,
  });

  return ensureGraphQLPayload('enable2FA', (data as any)?.enable2FA);
};

export const verify2FA = async (data: Verify2FARequest): Promise<MessageResponse> => {
  const { data: result } = await apolloClient.mutate({
    mutation: VERIFY_2FA_MUTATION,
    variables: { input: data },
  });

  return ensureGraphQLPayload('verify2FA', (result as any)?.verify2FA);
};

export const disable2FA = async (data: Verify2FARequest): Promise<MessageResponse> => {
  const { data: result } = await apolloClient.mutate({
    mutation: DISABLE_2FA_MUTATION,
    variables: { input: data },
  });

  return ensureGraphQLPayload('disable2FA', (result as any)?.disable2FA);
};
