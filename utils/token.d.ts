interface TokenPayload {
    id: string;
    role: string;
    isAdmin: boolean;
    adminRole?: string;
}
/**
 * Generates a JSON Web Token for authenticated users.
 * @param id - User ID
 * @param role - User Role (client/cleaner)
 * @param isAdmin - Boolean flag for admin status
 * @param adminRole - Specific admin role (Super, Support, etc.)
 * @returns Signed JWT string
 */
export declare const generateToken: (id: string, role: string, isAdmin: boolean, adminRole?: string) => string;
/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT string to verify
 * @returns Decoded payload or null if invalid
 */
export declare const verifyToken: (token: string) => TokenPayload | null;
export {};
//# sourceMappingURL=token.d.ts.map