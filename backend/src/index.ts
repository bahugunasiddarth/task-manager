import express from "express";
import cors from "cors";
import { register, login } from "./controllers/auth.controller.js";
import { getTasks, createTask, toggleTask, deleteTask } from "./controllers/task.controller.js";
import { authenticateToken } from "./middleware/auth.middleware.js";

const app = express();
const PORT = 5000; 

app.use(cors()); 
app.use(express.json()); 

// Public Routes
app.post("/auth/register", register);
app.post("/auth/login", login);

// Protected Routes (Notice authenticateToken is passed in the middle!)
app.get("/tasks", authenticateToken, getTasks);
app.post("/tasks", authenticateToken, createTask);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/tasks", authenticateToken, getTasks);
app.post("/tasks", authenticateToken, createTask);

// ADD THESE TWO LINES
app.patch("/tasks/:id/toggle", authenticateToken, toggleTask);
app.delete("/tasks/:id", authenticateToken, deleteTask);

app.use(cors({
  origin: "https://task-manager-backend-eight-rose.vercel.app", 
  credentials: true
}));