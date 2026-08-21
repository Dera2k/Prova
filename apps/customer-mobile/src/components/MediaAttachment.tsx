import { View, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { AppIcon } from './AppIcon';
import { colors, spacing, radius } from '@/theme';

interface MediaAttachmentProps {
  uri: string;
  type: 'image' | 'video';
  uploading?: boolean;
  onRemove: () => void;
}

export function MediaAttachment({ uri, type, uploading, onRemove }: MediaAttachmentProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.thumbnail} />
      {type === 'video' && (
        <View style={styles.videoBadge}>
          <AppIcon name="videocam" size={14} color={colors.text} />
        </View>
      )}
      {uploading ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <Pressable style={styles.removeButton} onPress={onRemove}>
          <AppIcon name="close" size={14} color={colors.text} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 72, height: 72, borderRadius: radius.md, overflow: 'hidden', position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  videoBadge: { position: 'absolute', bottom: spacing.xxs, left: spacing.xxs, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radius.sm, padding: 2 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  removeButton: { position: 'absolute', top: spacing.xxs, right: spacing.xxs, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: radius.pill, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
});