'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      router.push('/dashboard');
    } else {
      const errData = await res.json();
      setError(errData.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans">
      
      {/* Left Side - The Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">TaskFlow</span>
          </div>

          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            Welcome back
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">
            Please enter your details to sign in.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full py-4 mt-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-zinc-200 dark:shadow-none"
            >
              Sign In
            </button>
          </form>
          
          <p className="mt-10 text-center text-zinc-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/30 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/30 blur-3xl"></div>
        
        {/* Floating Abstract UI */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="w-1/3 h-3 bg-white/30 rounded-full"></div>
              <div className="w-10 h-10 rounded-full bg-indigo-400/50 flex items-center justify-center border border-white/20">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center px-6 gap-4">
                 <div className="w-5 h-5 rounded-full border-2 border-white/40"></div>
                 <div className="w-1/2 h-2.5 bg-white/40 rounded-full"></div>
              </div>
              <div className="w-full h-16 bg-white/20 rounded-2xl border border-white/30 flex items-center px-6 gap-4 transform translate-x-4 shadow-lg">
                 <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                 </div>
                 <div className="w-2/3 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="w-full h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center px-6 gap-4">
                 <div className="w-5 h-5 rounded-full border-2 border-white/40"></div>
                 <div className="w-1/3 h-2.5 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Manage your work.<br/>Reclaim your time.</h2>
            <p className="text-indigo-100 text-lg">The world's most elegant task management system, designed for focus.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}