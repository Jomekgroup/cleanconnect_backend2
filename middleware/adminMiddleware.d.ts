import { NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
export declare const admin: (req: AuthRequest, res: any, next: NextFunction) => void;
export declare const superAdmin: (req: AuthRequest, res: any, next: NextFunction) => void;
export declare const paymentAdmin: (req: AuthRequest, res: any, next: NextFunction) => void;
export declare const verificationAdmin: (req: AuthRequest, res: any, next: NextFunction) => void;
export declare const supportAdmin: (req: AuthRequest, res: any, next: NextFunction) => void;
//# sourceMappingURL=adminMiddleware.d.ts.map