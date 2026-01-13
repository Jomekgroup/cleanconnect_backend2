"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
// Route Imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const db_2 = __importDefault(require("./config/db"));
const aiSearch_1 = require("./utils/aiSearch");
const authMiddleware_1 = require("./middleware/authMiddleware");
const adminController = __importStar(require("./controllers/adminController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cors_1.default)());
// Domain Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default); // Deprecated in favor of admin/bookings but kept for backward compatibility if needed
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
app.use('/api/support', supportRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
// Shared/Global Endpoints
app.post('/api/subscriptions/request', authMiddleware_1.protect, adminController.requestSubscription);
app.post('/api/subscriptions/receipt', authMiddleware_1.protect, async (req, res) => {
    const { dataUrl } = req.body;
    try {
        await db_2.default.query("UPDATE users SET subscription_receipt = $1 WHERE id = $2", [dataUrl, req.user.id]);
        res.json({ message: "Subscription receipt uploaded." });
    }
    catch (e) {
        res.status(500).json({ message: "Upload failed" });
    }
});
app.get('/api/cleaners', async (req, res) => {
    try {
        const result = await db_2.default.query(`
      SELECT * FROM users 
      WHERE role = 'cleaner' AND is_suspended = false 
      ORDER BY subscription_tier = 'Premium' DESC, subscription_tier = 'Pro' DESC, rating DESC
    `);
        res.json(result.rows.map(c => ({
            id: c.id.toString(),
            name: c.full_name,
            photoUrl: c.profile_photo || 'https://via.placeholder.com/400x300?text=Profile',
            rating: parseFloat(c.rating) || 5.0,
            reviews: parseInt(c.reviews) || 0,
            serviceTypes: c.services ? JSON.parse(c.services) : [],
            state: c.state,
            city: c.city,
            bio: c.bio,
            chargeHourly: c.charge_hourly,
            subscriptionTier: c.subscription_tier,
            isVerified: c.is_verified
        })));
    }
    catch (error) {
        res.status(500).json({ message: "Failed to load cleaners" });
    }
});
app.post('/api/ai/search', async (req, res) => {
    const { query } = req.body;
    const matchingIds = await (0, aiSearch_1.aiSearchCleaners)(query);
    res.json({ matchingIds });
});
// Final Error Handlers
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Start Server
const startServer = async () => {
    try {
        await (0, db_1.initDB)();
        app.listen(PORT, () => console.log(`🚀 CleanConnect Server 100% Operational on port ${PORT}`));
    }
    catch (error) {
        console.error("Critical server failure:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map