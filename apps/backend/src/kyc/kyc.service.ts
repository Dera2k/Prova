import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycDocument } from './entities/kyc-document.entity';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { Professional } from '../professionals/entities/professional.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(KycDocument) private documents: Repository<KycDocument>,
    @InjectRepository(Professional) private professionals: Repository<Professional>,
  ) {}

  async submit(userId: string, dto: SubmitKycDto): Promise<KycDocument> {
    const professional = await this.professionals.findOne({ where: { userId } });
    if (!professional) {
      throw new NotFoundException('Professional profile not found');
    }

    const document = this.documents.create({ professionalId: professional.id, type: dto.type, fileUrl: dto.fileUrl });
    return this.documents.save(document);
  }

  async findMine(userId: string): Promise<KycDocument[]> {
    const professional = await this.professionals.findOne({ where: { userId } });
    if (!professional) {
      throw new NotFoundException('Professional profile not found');
    }
    return this.documents.find({ where: { professionalId: professional.id } });
  }

  async review(documentId: string, reviewerId: string, dto: ReviewKycDto): Promise<KycDocument> {
    const document = await this.documents.findOne({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.reviewedAt = new Date();
    document.reviewedBy = reviewerId;
    document.rejectionReason = dto.rejectionReason ?? null;
    await this.documents.save(document);

    // approving/rejecting a document updates the professional's overall verification status
    await this.professionals.update({ id: document.professionalId }, { verificationStatus: dto.status });

    return document;
  }
}