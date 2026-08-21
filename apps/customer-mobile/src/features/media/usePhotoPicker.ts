import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import type { PickedMedia } from './types';

export function usePhotoPicker() {
  const pickFromLibrary = useCallback(async (allowVideo: boolean = true): Promise<PickedMedia | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: allowVideo ? ['images', 'videos'] : ['images'],
      quality: 0.7,
      videoMaxDuration: 30,
    });

    if (result.canceled || !result.assets[0]) return null;
    const asset = result.assets[0];

    return {
      uri: asset.uri,
      type: asset.type === 'video' ? 'video' : 'image',
      fileName: asset.fileName || `media-${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
      mimeType: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
    };
  }, []);

  const takePhoto = useCallback(async (): Promise<PickedMedia | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return null;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      mediaTypes: ['images'],
    });

    if (result.canceled || !result.assets[0]) return null;
    const asset = result.assets[0];

    return {
      uri: asset.uri,
      type: 'image',
      fileName: asset.fileName || `photo-${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
    };
  }, []);

  return { pickFromLibrary, takePhoto };
}