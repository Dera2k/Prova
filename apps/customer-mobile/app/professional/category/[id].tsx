import { useLocalSearchParams } from 'expo-router';
import { ProfessionalListScreen } from '@/features/professionals/screens/ProfessionalListScreen';

export default function CategoryProScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <ProfessionalListScreen categoryId={id} />;
}