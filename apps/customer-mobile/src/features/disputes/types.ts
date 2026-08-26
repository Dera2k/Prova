export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'ESCALATED';

export interface Dispute {
    id: string;
    bookingId: string;
    reason: string;
    description: string;
    attachmentUrls: string[];
    status: DisputeStatus;
    resolution?: string;
    createdAt: string;
}

export interface SubmitDisputePayload {
    reason: string;
    description: string;
    attachmentUrls: string[];
}

export const DISPUTE_REASONS = [
    'Professional did not show up',
    'Work nnot comppleted properly',
    'Overcharged',
    'Damaged property',
    'Other', ] as const;