import React, { useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Database, Map } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { signup, user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-950 transition-colors">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-12 xl:p-16 justify-between">
                <div>
                    <Link to="/" className="flex items-center space-x-3 w-max">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">StudySmart</span>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto my-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Create an account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Join StudySmart and start learning smarter today.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-500/20 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:text-white transition-all font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:text-white transition-all font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    minLength={6}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:text-white transition-all font-medium tracking-widest"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.98]"
                            >
                                Register Now
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-bold">Log In.</Link>
                        </div>
                    </motion.div>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-500 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                    <div>Copyright © 2026 StudySmart Enterprises LTD.</div>
                </div>
            </div>

            {/* Right Side: Graphic/Text */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-center p-16 xl:p-24 text-white">
                <div className="absolute inset-0 bg-blue-700">
                    {/* Abstract background blobs */}
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

                    {/* Geometric border patterns matching the image slightly */}
                    <div className="absolute right-0 top-0 bottom-0 w-[40%] border-l-2 border-white/5 border-dashed"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[20%] border-t-2 border-white/5 border-dashed"></div>
                </div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative z-10 max-w-lg mb-12">
                    <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
                        Unlock powerful study tools powered by AI.
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Create your account in seconds and start generating summaries, interactive flashcards, and quizzes from your own documents.
                    </p>
                </motion.div>

                {/* Dashboard Mockup Element */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10 w-full mt-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                        <div className="grid gap-4 mb-6">
                            <div className="bg-white/10 rounded-2xl p-5 border border-white/5 flex items-center space-x-5">
                                <Database className="text-blue-200" size={28} />
                                <div>
                                    <div className="text-white font-bold text-lg mb-1">Instant Summaries</div>
                                    <div className="text-blue-100/70 text-sm">Upload PDFs and get the key points in seconds.</div>
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-5 border border-white/5 flex items-center space-x-5">
                                <BookOpen className="text-purple-200" size={28} />
                                <div>
                                    <div className="text-white font-bold text-lg mb-1">Magic Flashcards</div>
                                    <div className="text-purple-100/70 text-sm">Auto-generate active recall decks effortlessly.</div>
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-5 border border-white/5 flex items-center space-x-5">
                                <Map className="text-emerald-200" size={28} />
                                <div>
                                    <div className="text-white font-bold text-lg mb-1">Knowledge Tests</div>
                                    <div className="text-emerald-100/70 text-sm">Challenge yourself with dynamic assessments.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
