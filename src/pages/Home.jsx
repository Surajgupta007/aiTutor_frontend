import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, BookOpen, BrainCircuit, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <div className="pt-6 px-6 relative z-50">
                <nav className="max-w-6xl mx-auto bg-slate-950 dark:bg-black text-white px-8 py-4 rounded-full flex justify-between items-center shadow-2xl border border-white/10 mt-4">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-indigo-600 group-hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-colors">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-wide">
                            StudySmart
                        </span>
                    </Link>

                    {/* Middle Links reflecting the mockup's center nav */}
                    <div className="hidden md:flex space-x-8 font-medium text-sm text-slate-300">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                        <Link to="/learn-more" className="hover:text-white transition-colors">About Us</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                const isDark = document.documentElement.classList.toggle('dark');
                                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                            }}
                            className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <span className="hidden dark:block"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></span>
                            <span className="block dark:hidden"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></span>
                        </button>
                        <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Log In</Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-sm transition-all shadow-md">Sign Up</Link>
                    </div>
                </nav>
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
                    >
                        Study Smarter, Not Harder with AI.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 dark:text-slate-400 mb-10"
                    >
                        Upload your documents, and let StudySmart generate summaries, flashcards, quizzes, and answer your questions instantly.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-4"
                    >
                        <Link to="/signup" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg shadow-xl shadow-indigo-600/30 transition-all w-full sm:w-auto">
                            Get Started for Free
                        </Link>
                        <Link to="/learn-more" className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto text-center">
                            Learn More
                        </Link>
                    </motion.div>
                </div>

                <div id="features" className="grid md:grid-cols-3 gap-8 mt-32">
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                            <Bot size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Chat with Documents</h3>
                        <p className="text-slate-600 dark:text-slate-400">Ask questions about your PDFs and get instant, context-aware answers powered by Gemini.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Smart Summaries</h3>
                        <p className="text-slate-600 dark:text-slate-400">Instantly compress long chapters into bite-sized, digestible bullet points.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Instant Quizzes</h3>
                        <p className="text-slate-600 dark:text-slate-400">Test your knowledge with auto-generated MCQ quizzes tailored to your reading material.</p>
                    </div>
                </div>
            </main>

            {/* Footer added to match mockup */}
            <footer className="bg-slate-950 dark:bg-black text-white py-16 mt-10 rounded-[2.5rem] border border-white/10 mx-4 md:mx-8 mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20">
                            <GraduationCap className="text-white" size={28} />
                        </div>
                        <span className="text-3xl font-bold tracking-wide">StudySmart</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-sm font-medium text-slate-400">
                        <Link to="/" className="hover:text-white transition-colors">Homepage</Link>
                        <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                        <Link to="/learn-more" className="hover:text-white transition-colors">About Us</Link>
                    </div>

                    <div className="flex space-x-6 mb-12">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 border border-white/5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 border border-white/5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 border border-white/5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/10 border border-white/5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                    </div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
                        <div className="flex items-center space-x-2">
                            <GraduationCap size={16} className="text-indigo-500" />
                            <span className="font-semibold text-slate-300">StudySmart</span>
                        </div>
                        <div className="text-slate-500">Copyright 2026© StudySmart AI</div>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-slate-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                            <a href="#" className="hover:text-slate-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg></a>
                            <a href="#" className="hover:text-slate-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
