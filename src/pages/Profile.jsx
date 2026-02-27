import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, Camera, Edit3, Save, X, Trophy, Target, BarChart3, Award, Clock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3500);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/auth/me/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await api.put('/auth/me', { name, email });
            setUser(res.data.data);
            setEditing(false);
        } catch (err) {
            showToast('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        setUploading(true);
        try {
            const res = await api.put('/auth/me/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data.data);
        } catch (err) {
            showToast('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // profilePicture is now a full Cloudinary URL — use it directly
    const profilePicUrl = user?.profilePicture || null;

    const statCards = stats ? [
        { label: 'Quizzes Taken', value: stats.totalQuizzes, icon: Target, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
        { label: 'Average Score', value: `${stats.averageScore}%`, icon: BarChart3, color: 'purple', bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
        { label: 'Best Score', value: `${stats.bestScore}%`, icon: Trophy, color: 'amber', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
        { label: 'Questions Answered', value: stats.totalQuestions, icon: Award, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' }
    ] : [];

    return (
        <div className="text-slate-900 dark:text-white pb-10 max-w-5xl mx-auto relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border backdrop-blur-sm bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30 max-w-sm"
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your account and track your progress.</p>
            </header>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8"
            >
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBvcGFjaXR5PSIuMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L2c+PC9zdmc+')] opacity-40" />
                </div>

                <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="-mt-16 mb-6 flex items-end justify-between">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                {profilePicUrl ? (
                                    <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-3xl font-bold">{getInitials(user?.name)}</span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                                {uploading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Camera className="text-white" size={24} />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                        </div>

                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                            >
                                <Edit3 size={15} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditing(false); setName(user?.name || ''); setEmail(user?.email || ''); }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                >
                                    <X size={15} /> Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-bold disabled:opacity-50"
                                >
                                    <Save size={15} /> {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    {editing ? (
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5"><Mail size={15} /> {user?.email}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={15} /> Joined {formatDate(user?.createdAt)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Quiz & Test Performance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                        >
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{card.label}</p>
                                <h3 className="text-2xl font-bold">{card.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.text} flex items-center justify-center`}>
                                <card.icon size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Quiz History */}
            {stats?.recentQuizzes?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
                >
                    <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock size={20} className="text-indigo-500" /> Recent Quiz History
                    </h2>
                    <div className="space-y-3">
                        {stats.recentQuizzes.map((quiz, i) => (
                            <div
                                key={quiz.id}
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${quiz.percentage >= 70
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : quiz.percentage >= 40
                                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                        }`}>
                                        {quiz.percentage >= 70 ? <CheckCircle2 size={20} /> : <Target size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">Quiz #{stats.recentQuizzes.length - i}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(quiz.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-slate-900 dark:text-white">{quiz.percentage}%</p>
                                    <p className="text-xs text-slate-500">{quiz.score}/{quiz.totalQuestions} correct</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Empty state for stats */}
            {stats && stats.totalQuizzes === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                        <Target size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No quizzes yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Take your first quiz to see your performance stats here.</p>
                </motion.div>
            )}
        </div>
    );
};

export default Profile;
