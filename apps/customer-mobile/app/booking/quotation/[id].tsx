import { useLocalSearchParams } from 'expo-router';
import { QuotationScreen } from '@/features/quotations/screens/QuotationScreen';

export default function QuotationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <QuotationScreen bookingId={id} />;
}