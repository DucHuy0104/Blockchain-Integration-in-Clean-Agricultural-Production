const admin = require('../config/firebase');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        let decodedToken;

        // Check if Firebase is initialized
        if (admin) {
            // BYPASS for Local Testing with scripts
            if (token === 'VALID_MOCK_TOKEN') {
                console.log('⚠️  Using Mock Token for Testing');
                decodedToken = {
                    uid: 'MOCK_FIREBASE_UID_123',
                    email: 'mockuser@example.com',
                    name: 'Mock User',
                    picture: 'https://via.placeholder.com/150'
                };
            } else {
                // Real verification
                try {
                    decodedToken = await admin.auth().verifyIdToken(token);
                } catch (error) {
                    throw error;
                }
            }
        } else {
            // Should not happen if config returns null but safeguards
            return res.status(500).json({ message: 'Firebase Admin not configured' });
        }

        req.userFirebase = decodedToken;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({
            message: 'Unauthorized',
            error: error.message,
            code: error.code
        });
    }
};

// Middleware to check role based on SQL Database (after verification)
const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            const { uid, email } = req.userFirebase;

            // Find user in SQL DB
            const user = await User.findOne({
                where: { firebaseUid: uid }
            });

            if (!user) {
                // Fallback: Try finding by email (for first login/sync scenarios where partial record might exist)
                // Or simply return 401 if user MUST be synced first
                return res.status(401).json({ message: 'User not found in database. Please login first to sync.' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            // Attach full SQL User object to request
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Server error checking roles', error: error.message });
        }
    };
};

module.exports = { verifyToken, requireRole };
