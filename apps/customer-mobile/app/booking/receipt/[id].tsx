import { useLocalSearchParams } from 'expo-router';
import { ReceiptScreen } from '@/features/payments/screens/ReceiptScreen';

export default function ReceiptRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <ReceiptScreen paymentId={id} />;
}