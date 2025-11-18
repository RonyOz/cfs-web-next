/**
 * Validation Utilities
 * Zod schemas for form validation
 * 
 * TODO: Implement all validation schemas
 * TODO: Add custom error messages in Spanish
 */

import { z } from 'zod';

// Auth Validation Schemas

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  twoFactorCode: z.string().optional(),
});

export const twoFactorVerifySchema = z.object({
  token: z.string().length(6, 'El código debe tener 6 dígitos'),
});

// Product Validation Schemas

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
});

// Order Validation Schemas

export const createOrderItemSchema = z.object({
  productId: z.string().uuid('ID de producto inválido'),
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, 'Debes agregar al menos un producto'),
  meetingPlace: z.string().min(1, 'El lugar de encuentro es obligatorio').max(255, 'El lugar de encuentro no puede exceder 255 caracteres'),
  paymentMethod: z.string().min(1, 'El método de pago es obligatorio').max(100, 'El método de pago no puede exceder 100 caracteres'),
});

// Type inference from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type TwoFactorVerifyFormData = z.infer<typeof twoFactorVerifySchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
