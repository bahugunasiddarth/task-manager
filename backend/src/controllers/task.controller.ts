import { PrismaClient } from '@prisma/client';

// THIS WAS MISSING!
const prisma = new PrismaClient();

export const getTasks = async (req: any, res: any) => {
  try {
    const { status, search, page = 1 } = req.query;
    const skip = (Number(page) - 1) * 10;

    // 1. Start with the required user filter
    const whereClause: any = {
      userId: req.user.userId,
    };

    // 2. Only add the properties if they actually exist
    if (status) {
      whereClause.status = String(status);
    }
    if (search) {
      whereClause.title = { contains: String(search), mode: 'insensitive' };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause, // Pass the dynamically built object
      take: 10,
      skip: skip,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(tasks);
  } catch (error) {
    console.error("🚨 GET TASKS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: any, res: any) => {
  try {
    const { title } = req.body;
    
    const task = await prisma.task.create({
      data: { title, userId: req.user.userId }
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error("🚨 CREATE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// NEW: Allows you to check/uncheck tasks
export const toggleTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = await prisma.task.update({
      where: { id: id, userId: req.user.userId }, // Ensure users only edit their own tasks
      data: { status }
    });
    
    res.json(task);
  } catch (error) {
    console.error("🚨 TOGGLE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// NEW: Allows you to delete tasks
export const deleteTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    await prisma.task.delete({
      where: { id: id, userId: req.user.userId }
    });
    
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("🚨 DELETE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};