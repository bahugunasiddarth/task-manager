import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh';

export const register = async (req: any, res: any) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({ 
      data: { email, password: hashedPassword } 
    });
    
    res.status(201).json({ message: "User created" });
  } catch (e: any) {
    console.error("🚨 REAL DB ERROR:", e);

    if (e.code === 'P2002') {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Database error. Check the backend terminal for details." });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });
    res.json({ accessToken, refreshToken });
  } catch (e) {
    console.error("🚨 LOGIN ERROR:", e);
    res.status(500).json({ error: "Server error during login." });
  }
};