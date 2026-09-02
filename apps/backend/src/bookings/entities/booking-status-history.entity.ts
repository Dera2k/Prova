import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { BookingStatus } from '../../common/enums/booking-status.enum';

@Entity('booking_status_history')
export class BookingStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'enum', enum: BookingStatus })
  status: BookingStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'varchar', nullable: true })
  note: string | null;
}