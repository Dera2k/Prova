import { useLocalSearchParams } from 'expo-router';
import { ProfessionalProfileScreen } from '@/features/professionals/screens/ProfessionalProfileScreen';

export default function ProScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <ProfessionalProfileScreen id={id} />;
}