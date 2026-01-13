import { Request, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        isAdmin: boolean;
        adminRole?: string;
    };
}
export declare const protect: (req: AuthRequest, res: any, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authMiddleware.d.ts.map