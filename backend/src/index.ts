import express from "express";
import cors from "cors";
import { register, login } from "./controllers/auth.controller.js";
import { getTasks, createTask, toggleTask, deleteTask } from "./controllers/task.controller.js";
import { authenticateToken } from "./middleware/auth.middleware.js";

const app = express();
const PORT = 5000; 

// 1. MIDDLEWARE MUST BE AT THE TOP
// This allows requests from your Vercel frontend, while also letting you test locally
app.use(cors({
  origin: [
    "https://task-manager-backend-eight-rose.vercel.app",
    "https://task-manager-kappa-kohl.vercel.app", 
    "http://localhost:3000", 
    "http://localhost:3001"
  ], 
  credentials: true
}));
app.use(express.json()); 

// 2. PUBLIC ROUTES
app.post("/auth/register", register);
app.post("/auth/login", login);

// 3. PROTECTED ROUTES
app.get("/tasks", authenticateToken, getTasks);
app.post("/tasks", authenticateToken, createTask);
app.patch("/tasks/:id/toggle", authenticateToken, toggleTask);
app.delete("/tasks/:id", authenticateToken, deleteTask);

// 4. HEALTH CHECK ROUTE
app.get("/", (req, res) => {
  res.send("Task API is running perfectly!");
});

// 5. VERCEL SERVERLESS EXPORT (CRITICAL)
// This tells Express to listen on a port locally, but lets Vercel handle it in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// THIS LINE IS REQUIRED FOR VERCEL TO WORK
export default app;