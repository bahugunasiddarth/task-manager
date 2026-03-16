import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access';

export const authenticateToken = (req: any, res: any, next: any) => {
  // 1. Get the token from the Authorization header ("Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // 2. If there is no token, reject the request
  if (!token) return res.status(401).json({ error: "Access denied" });

  // 3. Verify the token is real and hasn't expired
  jwt.verify(token, ACCESS_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    
    // 4. Attach the decoded user data (which contains userId) to the request
    req.user = user;
    next(); // Move on to the actual route controller
  });
};