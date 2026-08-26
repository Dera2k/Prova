// app/booking/dispute/[bookingId].tsx
import { useLocalSearchParams } from 'expo-router';
import { DisputeStatusScreen } from '@/features/disputes/screens/DisputeStatusScreen';

export default function DisputeStatusRoute() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  if (!bookingId) return null;
  return <DisputeStatusScreen bookingId={bookingId} />;
}