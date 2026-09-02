import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BookingStatus } from '../../common/enums/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  reference: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'uuid', nullable: true })
  addressId: string | null;

  @Column({ type: 'jsonb' })
  addressSnapshot: Record<string, unknown>;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  attachmentUrls: string[];

  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledFor: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Column({ type: 'boolean', default: false })
  noShowFlagged: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  noShowFlaggedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  acceptanceDeadline: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}