import { useLocalSearchParams } from 'expo-router';
import { BookingTrackingScreen } from '@/features/bookings/screens/BookingTrackingScreen';

export default function TrackRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <BookingTrackingScreen id={id} />;
}