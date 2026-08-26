export interface Review {
  id: string;
  bookingId: string;
  professionalId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

export interface SubmitReviewPayload {
  rating: number;
  comment: string;
}