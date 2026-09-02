import { BookingStatus } from '../common/enums/booking-status.enum';

export type BookingActor = 'CUSTOMER' | 'PROFESSIONAL';

interface TransitionRule {
  to: BookingStatus;
  allowedActors: BookingActor[];
}

const VALID_TRANSITIONS: Record<BookingStatus, TransitionRule[]> = {
  [BookingStatus.PENDING]: [
    { to: BookingStatus.ACCEPTED, allowedActors: ['PROFESSIONAL', 'CUSTOMER'] },
    { to: BookingStatus.CANCELLED, allowedActors: ['CUSTOMER', 'PROFESSIONAL'] },
  ],
  [BookingStatus.ACCEPTED]: [
    { to: BookingStatus.ON_THE_WAY, allowedActors: ['PROFESSIONAL'] },
    { to: BookingStatus.CANCELLED, allowedActors: ['CUSTOMER', 'PROFESSIONAL'] },
  ],
  [BookingStatus.ON_THE_WAY]: [
    { to: BookingStatus.ARRIVED, allowedActors: ['PROFESSIONAL'] },
    { to: BookingStatus.CANCELLED, allowedActors: ['CUSTOMER', 'PROFESSIONAL'] },
  ],
  [BookingStatus.ARRIVED]: [
    { to: BookingStatus.IN_PROGRESS, allowedActors: ['PROFESSIONAL'] },
    { to: BookingStatus.CANCELLED, allowedActors: ['CUSTOMER', 'PROFESSIONAL'] },
  ],
  [BookingStatus.IN_PROGRESS]: [
    { to: BookingStatus.COMPLETED, allowedActors: ['PROFESSIONAL'] },
    { to: BookingStatus.DISPUTED, allowedActors: ['CUSTOMER', 'PROFESSIONAL'] },
  ],
  [BookingStatus.COMPLETED]: [
    { to: BookingStatus.DISPUTED, allowedActors: ['CUSTOMER', 'PROFESSIONAL'] },
  ],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.DISPUTED]: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return VALID_TRANSITIONS[from]?.some((rule) => rule.to === to) ?? false;
}

export function assertValidTransition(from: BookingStatus, to: BookingStatus, actor: BookingActor): void {
  const rule = VALID_TRANSITIONS[from]?.find((r) => r.to === to);

  if (!rule) {
    throw new Error(`Invalid booking transition: ${from} -> ${to}`);
  }

  if (!rule.allowedActors.includes(actor)) {
    throw new Error(`${actor} is not permitted to transition ${from} -> ${to}`);
  }
}
