'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/auth';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const router = useRouter();

  const loadTasks = async () => {
    try {
      let query = `?search=${search}`;
      if (statusFilter) query += `&status=${statusFilter}`;
      
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tasks${query}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => { loadTasks(); }, [search, statusFilter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title: newTaskTitle })
    });

    if (res.ok) {
      setNewTaskTitle('');
      loadTasks();
    }
  };

  const handleToggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) loadTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        
        {/* Stats Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Your Overview</h2>
            <p className="text-slate-500 mt-1">Keep it up! You've completed {completedTasks} out of {totalTasks} tasks.</p>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Controls: Create & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleCreateTask} className="flex-grow flex gap-2">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              className="flex-grow px-5 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl shadow-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
              Add
            </button>
          </form>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-48 px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="w-36 px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800 bg-white cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-400 font-medium text-lg">No tasks found. Time to relax or create a new one!</p>
            </div>
          ) : (
            tasks.map((task: any) => (
              <div 
                key={task.id} 
                className={`group p-4 border rounded-xl flex items-center justify-between transition-all duration-200 hover:shadow-md ${task.status === 'completed' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${task.status === 'completed' ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent border-slate-300 hover:border-indigo-400'}`}
                  >
                    {task.status === 'completed' && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-lg transition-all duration-200 ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                    {task.title}
                  </span>
                </div>
                
                {/* Delete button*/}
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="Delete Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}