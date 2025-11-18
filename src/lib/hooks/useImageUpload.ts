import { useState } from 'react';
import apolloClient from '@/lib/graphql/client';
import { CREATE_UPLOAD_URL_MUTATION } from '@/lib/graphql/mutations';

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

      const { uploadUrl, publicUrl } = (data as any).createUploadUrl;
      console.log('📝 [ImageUpload] Datos de subida:', {
        uploadUrl,
        publicUrl
      });

      setProgress(30);

      // PASO 2: Subir imagen directamente usando fetch con la URL firmada
      console.log('☁️ [ImageUpload] PASO 2: Subiendo imagen usando fetch...');
      console.log('☁️ [ImageUpload] Upload URL:', uploadUrl);
      console.log('☁️ [ImageUpload] File type:', file.type);
      console.log('☁️ [ImageUpload] File size:', `${(file.size / 1024).toFixed(2)} KB`);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
      });

      console.log('📊 [ImageUpload] Respuesta de subida:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        ok: uploadResponse.ok
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'No se pudo leer el error');
        console.error('❌ [ImageUpload] Error en la subida:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          body: errorText
        });
        throw new Error(`Error al subir imagen: ${uploadResponse.status} ${uploadResponse.statusText}`);
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
