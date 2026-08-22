import { useLocalSearchParams } from 'expo-router';
import { BookingConfirmationScreen } from '@/features/bookings/screens/BookingConfirmationScreen';

export default function ConfirmationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <BookingConfirmationScreen id={id} />;
}