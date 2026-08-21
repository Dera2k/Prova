import type { PickedMedia, UploadedMedia } from './types';
import { getAccessToken } from '@/features/auth/tokenStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function uploadMedia(media: PickedMedia): Promise<UploadedMedia> {
  const token = await getAccessToken();
  const formData = new FormData();
  formData.append('file', {
    uri: media.uri,
    name: media.fileName,
    type: media.mimeType,
  } as any);

  const response = await fetch(`${BASE_URL}/uploads`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload media');
  }

  const result = await response.json();
  return { url: result.url, type: media.type };
}