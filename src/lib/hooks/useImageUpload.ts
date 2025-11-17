import { useState } from 'react';
import apolloClient from '@/lib/graphql/client';
import { CREATE_UPLOAD_URL_MUTATION } from '@/lib/graphql/mutations';
import { supabase } from '@/lib/supabase';

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

    try {
      // PASO 1: Obtener URL firmada del backend
      const { data } = await apolloClient.mutate({
        mutation: CREATE_UPLOAD_URL_MUTATION,
        variables: {
          input: { fileName: file.name }
        }
      });

      const { token, path, publicUrl } = (data as any).createUploadUrl;
      setProgress(30);

      // PASO 2: Subir imagen a Supabase usando SDK
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setProgress(100);

      return { publicUrl };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al subir imagen';
      setError(message);
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error, progress };
};
