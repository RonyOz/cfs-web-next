/**
 * User API Functions
 * All user-related API calls
 * 
 * TODO: Implement all function bodies
 * TODO: Add proper error handling
 * TODO: Add admin-only validation
 */

import apiClient from './client';
import { User, MessageResponse } from '@/types';

/**
 * Get all users
 * GET /users
 * 
 * Note: Admin only
 */
export const getAllUsers = async (): Promise<User[]> => {
  // TODO: Implement get all users logic
  // Check if user is admin before calling
  // const response = await apiClient.get('/users');
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Get authenticated user profile
 * GET /users/me
 */
export const getCurrentUser = async (): Promise<User> => {
  // TODO: Implement get current user logic
  // const response = await apiClient.get('/users/me');
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Get user by ID
 * GET /users/:id
 */
export const getUserById = async (id: string): Promise<User> => {
  // TODO: Implement get user by ID logic
  // const response = await apiClient.get(`/users/${id}`);
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Run database seed
 * POST /seed/run
 * 
 * Note: Admin only
 * Creates sample users, products, and orders for testing
 */
export const runSeed = async (): Promise<MessageResponse> => {
  // TODO: Implement seed logic
  // Check if user is admin before calling
  // const response = await apiClient.post('/seed/run');
  // return response.data;
  throw new Error('Not implemented');
};
