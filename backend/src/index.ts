import express from "express";
import cors from "cors";
import { register, login } from "./controllers/auth.controller.js";
import { getTasks, createTask, toggleTask, deleteTask } from "./controllers/task.controller.js";
import { authenticateToken } from "./middleware/auth.middleware.js";

const app = express();
const PORT = 5000; 

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

app.post("/auth/register", register);
app.post("/auth/login", login);

app.get("/tasks", authenticateToken, getTasks);
app.post("/tasks", authenticateToken, createTask);
app.patch("/tasks/:id/toggle", authenticateToken, toggleTask);
app.delete("/tasks/:id", authenticateToken, deleteTask);

app.get("/", (req, res) => {
  res.send("Task API is running perfectly!");
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app;