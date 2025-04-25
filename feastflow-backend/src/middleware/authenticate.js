export const authenticate = (req, res, next) => {
  // Dummy authentication for development
  // Replace with your real JWT or session logic
  if (req.headers.authorization) {
    // Example: decode JWT and attach user to req
    // req.user = decodedUser;
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};