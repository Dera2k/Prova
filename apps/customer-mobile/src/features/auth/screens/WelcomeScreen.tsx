import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Button, AppIcon } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';

const BENEFITS = [
  { icon: 'shield-checkmark-outline' as const, title: 'Verified professionals', body: 'ID, skill and address checked before they can accept a job.' },
  { icon: 'location-outline' as const, title: 'Closest first', body: 'We rank by distance from you, so help arrives fast.' },
  { icon: 'time-outline' as const, title: 'Quote before work', body: 'See labour, materials and fees before you approve anything.' },
];

export function WelcomeScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.brand}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>P</Text>
          </View>
          <Text style={styles.brandName}>Prova</Text>
        </View>

        <Text style={styles.heading}>
          Urgent repair?{'\n'}
          <Text style={styles.headingAccent}>Get a verified pro</Text>{'\n'}
          nearby.
        </Text>
        <Text style={styles.subheading}>
          Burst pipe, dead generator, car that won't start — Prova matches you with the closest checked professional in Lagos.
        </Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefitCard}>
              <AppIcon name={b.icon} color={colors.primary} size={20} />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitBody}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button onPress={() => router.push('/auth/phone-sign-in')}>Get started →</Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  badge: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { ...typography.label, color: colors.background },
  brandName: { ...typography.h3, color: colors.text },
  heading: { ...typography.display, color: colors.text },
  headingAccent: { color: colors.primary },
  subheading: { ...typography.body, color: colors.textMuted },
  benefits: { gap: spacing.sm, marginTop: spacing.md },
  benefitCard: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  benefitText: { flex: 1, gap: spacing.xxs },
  benefitTitle: { ...typography.label, color: colors.text },
  benefitBody: { ...typography.caption, color: colors.textMuted },
  actions: { paddingBottom: spacing.lg },
});