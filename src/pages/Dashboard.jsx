import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Map, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ documents: 0, flashcards: 0, quizzes: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [docRes, flashRes, quizRes] = await Promise.all([
                    api.get('/documents'),
                    api.get('/flashcards'),
                    api.get('/quizzes')
                ]);
                setStats({
                    documents: docRes.data.count || 0,
                    flashcards: flashRes.data.count || 0,
                    quizzes: quizRes.data.count || 0
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const profilePicUrl = user?.profilePicture ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5001'}${user.profilePicture}` : null;

    return (
        <div className="text-slate-900 dark:text-white pb-10">
            <header className="mb-10 flex items-center gap-5">
                <Link to="/profile" className="shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border-2 border-white dark:border-slate-800 hover:scale-105 transition-transform cursor-pointer">
                        {profilePicUrl ? (
                            <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-xl font-bold">{getInitials(user?.name)}</span>
                        )}
                    </div>
                </Link>
                <div>
                    <h1 className="text-4xl font-bold font-sans tracking-tight">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Here's what your learning progress looks like today.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Stat Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Documents</p>
                        <h3 className="text-3xl font-bold">{stats.documents}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Database size={28} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Flashcards Created</p>
                        <h3 className="text-3xl font-bold">{stats.flashcards}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <BookOpen size={28} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Quizzes Taken</p>
                        <h3 className="text-3xl font-bold">{stats.quizzes}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                        <Map size={28} />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link to="/documents" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group bg-slate-50 dark:bg-slate-950">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Upload a Document</h4>
                                    <p className="text-sm text-slate-500">Add a new PDF to study</p>
                                </div>
                            </div>
                            <ArrowRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
                        </Link>

                        <Link to="/flashcards" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors group bg-slate-50 dark:bg-slate-950">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">Review Flashcards</h4>
                                    <p className="text-sm text-slate-500">Practice your active recall</p>
                                </div>
                            </div>
                            <ArrowRight className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={20} />
                        </Link>
                    </div>
                </div>

                {/* Getting Started Tip */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-3">Maximize your learning!</h2>
                        <p className="text-indigo-100 mb-6 leading-relaxed">
                            Upload your lecture slides or reading materials as PDFs to get started.
                            StudySmart will instantly generate summaries, let you ask questions, and build flashcards dynamically.
                        </p>
                    </div>
                    <Link to="/documents" className="relative z-10 mt-auto px-6 py-3 bg-white text-indigo-600 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all rounded-xl font-semibold w-max shadow-md">
                        Go to Documents
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
