import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { KycDocumentType, KycDocumentStatus } from '../../common/enums/kyc-status.enum';

@Entity('kyc_documents')
export class KycDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column({ type: 'enum', enum: KycDocumentType })
  type: KycDocumentType;

  @Column({ type: 'varchar' })
  fileUrl: string;

  @Column({ type: 'enum', enum: KycDocumentStatus, default: KycDocumentStatus.UPLOADED })
  status: KycDocumentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}