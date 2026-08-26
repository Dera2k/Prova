// app/booking/dispute/create.tsx
import { useLocalSearchParams } from 'expo-router';
import { SubmitDisputeScreen } from '@/features/disputes/screens/SubmitDisputeScreen';

export default function CreateDisputeRoute() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  if (!bookingId) return null;
  return <SubmitDisputeScreen bookingId={bookingId} />;
}