import { Request } from 'express';
export type UserRole = 'client' | 'cleaner' | 'admin';
export type AdminRole = 'Super' | 'Support' | 'Verification' | 'Payment';
export type PaymentMethod = 'Direct' | 'Escrow';
export type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending Payment' | 'Pending Admin Confirmation' | 'Confirmed' | 'Pending Payout' | 'Paid' | 'Not Applicable';
export type SubscriptionTier = 'Free' | 'Standard' | 'Pro' | 'Premium';
export interface JwtPayload {
    id: string;
    role: string;
    isAdmin: boolean;
    adminRole?: string;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export interface ReceiptData {
    name: string;
    dataUrl: string;
}
export interface ContactFormInput {
    topic: string;
    name: string;
    email: string;
    phone: string;
    message: string;
}
export interface AiSearchInput {
    query: string;
}
//# sourceMappingURL=types.d.ts.map