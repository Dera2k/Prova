import { useLocalSearchParams } from 'expo-router';
import { SubmitReviewScreen } from '@/features/reviews/screens/SubmitReviewScreen';

export default function ReviewRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <SubmitReviewScreen bookingId={id} />;
}