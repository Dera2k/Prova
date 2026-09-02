import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { QuotationStatus } from '../../common/enums/quotation-status.enum';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  bookingId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  labourCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  materialsCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  inspectionFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.PENDING })
  status: QuotationStatus;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}