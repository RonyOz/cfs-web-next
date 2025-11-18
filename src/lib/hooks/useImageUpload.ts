import { useState } from 'react';
import apolloClient from '@/lib/graphql/client';
import { CREATE_UPLOAD_URL_MUTATION } from '@/lib/graphql/mutations';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

interface UploadResult {
  publicUrl: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    console.log('🖼️ [ImageUpload] Iniciando subida de imagen...');
    console.log('📁 [ImageUpload] Archivo:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type
    });

    try {
      // Verificar configuración de Supabase
      console.log('🔧 [ImageUpload] Verificando configuración de Supabase...');
      console.log('🔧 [ImageUpload] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ NO configurado');
      console.log('🔧 [ImageUpload] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ NO configurado');

      if (!isSupabaseConfigured()) {
        const errorMsg = 'Supabase no esta configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar las cargas de imagenes.';
        console.error('❌ [ImageUpload] Error de configuración:', errorMsg);
        throw new Error(errorMsg);
      }

      const supabase = getSupabaseClient();
      console.log('✅ [ImageUpload] Cliente de Supabase creado');

      // PASO 1: Obtener URL firmada del backend
      console.log('📡 [ImageUpload] PASO 1: Solicitando URL firmada al backend...');
      console.log('📡 [ImageUpload] Mutation:', 'CREATE_UPLOAD_URL_MUTATION');
      console.log('📡 [ImageUpload] Variables:', { fileName: file.name });

      const { data } = await apolloClient.mutate({
        mutation: CREATE_UPLOAD_URL_MUTATION,
        variables: {
          input: { fileName: file.name }
        }
      });

      console.log('✅ [ImageUpload] Respuesta del backend recibida:', data);

      const { token, path, publicUrl } = (data as any).createUploadUrl;
      console.log('📝 [ImageUpload] Datos de subida:', {
        path,
        publicUrl,
        tokenLength: token?.length || 0
      });

      setProgress(30);

      // PASO 2: Subir imagen a Supabase usando SDK
      console.log('☁️ [ImageUpload] PASO 2: Subiendo imagen a Supabase...');
      console.log('☁️ [ImageUpload] Bucket:', 'product-images');
      console.log('☁️ [ImageUpload] Path:', path);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        console.error('❌ [ImageUpload] Error de Supabase:', uploadError);
        throw new Error(uploadError.message);
      }

      setProgress(100);
      console.log('🎉 [ImageUpload] ¡Imagen subida exitosamente!');
      console.log('🔗 [ImageUpload] URL pública:', publicUrl);

      return { publicUrl };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al subir imagen';
      setError(message);
      
      console.error('❌ [ImageUpload] Error general:', err);
      console.error('❌ [ImageUpload] Tipo de error:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('❌ [ImageUpload] Mensaje:', message);
      
      if (err instanceof Error) {
        console.error('❌ [ImageUpload] Stack trace:', err.stack);
      }
      
      throw err;
    } finally {
      setUploading(false);
      console.log('🏁 [ImageUpload] Proceso finalizado');
    }
  };

  return { uploadImage, uploading, error, progress };
};
