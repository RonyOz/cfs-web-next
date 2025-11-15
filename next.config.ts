import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Output standalone para Docker
  output: 'standalone',
  
  // Configuración de imágenes
  images: {
    domains: ['cfs-api.onrender.com', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // Para Render free tier
  },
  
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },
  
  // Optimizaciones de producción
  compress: true,
  poweredByHeader: false,
  
  // Configuración de webpack (opcional)
  webpack: (config, { isServer }) => {
    // Optimizaciones adicionales si es necesario
    return config;
  },
};

export default nextConfig;
