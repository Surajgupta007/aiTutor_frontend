import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Zap, Target, BookOpen, Clock, BrainCircuit, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-indigo-500/30">
            {/* Header / Navbar */}
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

                    {/* Middle Links */}
                    <div className="hidden md:flex space-x-8 font-medium text-sm text-slate-300">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/services" className="text-white font-bold transition-colors">Services</Link>
                        <Link to="/learn-more" className="hover:text-white transition-colors">About Us</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Log In</Link>
                        <Link to="/signup" className="hidden md:inline-block px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-sm transition-all shadow-md">Sign Up</Link>
                    </div>
                </nav>
            </div>

            <main className="pb-24">
                {/* Hero section */}
                <section className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full font-bold text-sm mb-6">
                        OUR OFFERINGS
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Supercharge Your Studies
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Explore the powerful AI-driven services that StudySmart provides to help you learn faster and retain more information.
                    </motion.p>
                </section>

                {/* Services Grid */}
                <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Service 1 */}
                    <ServiceCard
                        icon={<BookOpen size={32} className="text-indigo-600 dark:text-indigo-400" />}
                        title="Document Summarization"
                        description="Upload textbooks, research papers, or lecture slides. Our AI instantly reads and extracts the most crucial information into highly digestible, bulleted summaries."
                    />

                    {/* Service 2 */}
                    <ServiceCard
                        icon={<Zap size={32} className="text-pink-600 dark:text-pink-400" />}
                        title="Interactive Q&A"
                        description="Stuck on a specific concept? Chat directly with your documents. Ask questions and get profound, plain-English explanations referenced directly from your uploaded materials."
                    />

                    {/* Service 3 */}
                    <ServiceCard
                        icon={<BrainCircuit size={32} className="text-emerald-600 dark:text-emerald-400" />}
                        title="Automated Flashcards"
                        description="Stop wasting time writing study cards. StudySmart automatically parses your documents and generates interactive flashcards based on active-recall principles."
                    />

                    {/* Service 4 */}
                    <ServiceCard
                        icon={<Target size={32} className="text-purple-600 dark:text-purple-400" />}
                        title="Adaptive Quizzes"
                        description="Test your readiness with multiple-choice quizzes that adapt to the material you provided. It automatically scores you and explains the correct answers to fill knowledge gaps."
                    />

                    {/* Service 5 */}
                    <ServiceCard
                        icon={<Clock size={32} className="text-orange-600 dark:text-orange-400" />}
                        title="Time Optimization"
                        description="By cutting out the passive reading phase, our platform condenses hours of studying into focused, active learning sessions that dramatically increase retention velocity."
                    />

                    {/* Service 6 */}
                    <ServiceCard
                        icon={<Users size={32} className="text-cyan-600 dark:text-cyan-400" />}
                        title="Cloud Synchronization"
                        description="Your personal PDF library, generated notes, and test scores are securely backed up and synchronized across all your devices for studying on the go."
                    />
                </section>

                {/* CTA */}
                <section className="mt-32 max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-screen -mr-20 -mt-20"></div>
                        <h2 className="text-4xl font-bold mb-6 relative z-10">Stop Reading. Start Learning.</h2>
                        <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto relative z-10">Join thousands of students who are radically transforming their grades with AI-assisted learning.</p>
                        <Link to="/signup" className="inline-block px-8 py-4 bg-white text-indigo-600 hover:bg-slate-100 rounded-full font-bold text-lg transition-all shadow-lg relative z-10">
                            Create Your Free Account
                        </Link>
                    </div>
                </section>
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
                        <Link to="/services" className="text-white font-bold transition-colors">Services</Link>
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

// Helper Component
const ServiceCard = ({ icon, title, description }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:shadow-xl hover:border-indigo-500/30 transition-all group">
        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </motion.div>
);

export default Services;
