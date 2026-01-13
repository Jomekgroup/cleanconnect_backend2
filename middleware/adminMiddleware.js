"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportAdmin = exports.verificationAdmin = exports.paymentAdmin = exports.superAdmin = exports.admin = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("./authMiddleware");
// 1. General Admin Check (Any Admin)
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};
exports.admin = admin;
// 2. Super Admin Check (Only 'Super')
const superAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin && req.user.adminRole === 'Super') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
    }
};
exports.superAdmin = superAdmin;
// 3. Payment Admin Check ('Payment' or 'Super')
// Used for confirming escrow payments and marking jobs as paid
const paymentAdmin = (req, res, next) => {
    if (req.user &&
        req.user.isAdmin &&
        (req.user.adminRole === 'Payment' || req.user.adminRole === 'Super')) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Payment Admin privileges required.' });
    }
};
exports.paymentAdmin = paymentAdmin;
// 4. Verification Admin Check ('Verification' or 'Super')
// Used for approving subscription upgrades and verifying documents
const verificationAdmin = (req, res, next) => {
    if (req.user &&
        req.user.isAdmin &&
        (req.user.adminRole === 'Verification' || req.user.adminRole === 'Super')) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Verification Admin privileges required.' });
    }
};
exports.verificationAdmin = verificationAdmin;
// 5. Support Admin Check ('Support' or 'Super')
// Used for general user management (viewing users, resolving disputes)
const supportAdmin = (req, res, next) => {
    if (req.user &&
        req.user.isAdmin &&
        (req.user.adminRole === 'Support' || req.user.adminRole === 'Super')) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Support Admin privileges required.' });
    }
};
exports.supportAdmin = supportAdmin;
//# sourceMappingURL=adminMiddleware.js.map