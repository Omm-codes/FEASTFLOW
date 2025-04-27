/**
 * Admin authentication middleware
 * Checks if the authenticated user has admin role
 */

export const adminAuth = (req, res, next) => {
  try {
    // req.user should be set by the authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      console.log('Admin access denied. User role:', req.user.role);
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    // User is authenticated and has admin role
    console.log(`Admin access granted to user ${req.user.userId}`);
    next();
  } catch (error) {
    console.error('Error in admin authentication:', error);
    res.status(500).json({ error: 'Server error during admin authentication' });
  }
};