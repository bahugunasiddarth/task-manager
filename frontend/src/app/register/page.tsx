'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      alert('Registration successful! Please login.');
      router.push('/');
    } else {
      const errData = await res.json();
      setError(errData.error || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans">
      
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-teal-600 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-400 via-teal-600 to-emerald-800"></div>
        <div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-300/30 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/30 blur-3xl"></div>
        
        {/* Floating Abstract Elements */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl transform translate-y-8 hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 rounded-2xl bg-teal-400/30 mb-6 flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="w-2/3 h-2.5 bg-white rounded-full mb-3"></div>
              <div className="w-1/2 h-2.5 bg-white/50 rounded-full"></div>
            </div>
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl transform -translate-y-4 hover:-translate-y-10 transition-transform duration-500">
              <div className="w-12 h-12 rounded-2xl bg-teal-400/30 mb-6 flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div className="w-3/4 h-2.5 bg-white rounded-full mb-3"></div>
              <div className="w-2/5 h-2.5 bg-white/50 rounded-full"></div>
            </div>
          </div>
          
          <div className="mt-16 text-left">
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">Start organizing<br/>your life today.</h2>
            <p className="text-teal-50 text-lg opacity-90">Join thousands of users who have revolutionized their productivity workflow.</p>
          </div>
        </div>
      </div>

      {/* Right Side - The Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">TaskFlow</span>
          </div>

          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            Create an account
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">
            Let's get you set up with your new workspace.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  placeholder="Minimum 8 characters" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full py-4 mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-teal-600/20"
            >
              Get Started Free
            </button>
          </form>
          
          <p className="mt-10 text-center text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link href="/" className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
}