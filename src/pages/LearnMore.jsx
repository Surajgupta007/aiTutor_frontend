import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Zap, BrainCircuit, UploadCloud, BookOpen, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const LearnMore = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-indigo-500/30">
            {/* Header */}
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

                    {/* Middle Links reflecting the mockup's center nav */}
                    <div className="hidden md:flex space-x-8 font-medium text-sm text-slate-300">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                        <Link to="/learn-more" className="text-white font-bold transition-colors">About Us</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Log In</Link>
                        <Link to="/signup" className="hidden md:inline-block px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-sm transition-all shadow-md">Sign Up</Link>
                    </div>
                </nav>
            </div>

            <main>
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply blur-3xl"></div>
                        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full font-medium text-sm mb-6">
                            <SparklesIcon />
                            <span>Powered by Google Gemini AI</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            The intelligent way to <br className="hidden md:block" /> master any subject.
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            StudySmart transforms your static PDFs, lecture slides, and notes into interactive, AI-driven learning experiences. Save hours of reading and boost your retention.
                        </motion.p>
                    </div>
                </section>

                {/* How it Works / Core Features */}
                <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-bold mb-4 tracking-tight">How StudySmart Works</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400">Four simple steps to revolutionize your study habits.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureStep
                                number="01"
                                icon={<UploadCloud size={28} className="text-indigo-600 dark:text-indigo-400" />}
                                title="Upload Documents"
                                description="Securely upload your PDFs, textbooks, or lecture slides to your personal library."
                            />
                            <FeatureStep
                                number="02"
                                icon={<BrainCircuit size={28} className="text-emerald-600 dark:text-emerald-400" />}
                                title="Instant Summaries"
                                description="Let our AI read the entire document and pull out the most important concepts instantly."
                            />
                            <FeatureStep
                                number="03"
                                icon={<BookOpen size={28} className="text-purple-600 dark:text-purple-400" />}
                                title="Generate Flashcards"
                                description="Automatically create active-recall flashcards from the text to memorize key definitions."
                            />
                            <FeatureStep
                                number="04"
                                icon={<Map size={28} className="text-pink-600 dark:text-pink-400" />}
                                title="Take AI Quizzes"
                                description="Test your knowledge with dynamic multiple-choice quizzes that explain the correct answers."
                            />
                        </div>
                    </div>
                </section>

                {/* Deep Dive Feature: AI Chat */}
                <section className="py-24">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-slate-200 dark:bg-slate-800 rounded-3xl p-8 aspect-square flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-2xl relative overflow-hidden">
                                {/* Abstract representation of a chat UI */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 z-0"></div>
                                <div className="w-full max-w-sm space-y-4 relative z-10">
                                    <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm ml-auto w-3/4 shadow-md">
                                        Can you explain the difference between Mitosis and Meiosis based on page 4?
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm w-[90%] shadow-md">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Zap size={16} className="text-indigo-500" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">StudySmart AI</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                            According to the document, **Mitosis** results in two identical diploid cells used for growth, while **Meiosis** produces four unique haploid cells used for reproduction...
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <h2 className="text-4xl font-bold mb-6 tracking-tight">Chat natively with your documents.</h2>
                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Don't understand a specific paragraph? Just ask. Our AI reading assistant acts like a personal tutor that has memorized every word of your textbook.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <ListItem text="Get plain-english explanations of complex topics." />
                                <ListItem text="Ask for examples not provided in the text." />
                                <ListItem text="Find exact page references for concepts." />
                            </ul>
                            <Link to="/signup" className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">
                                <span>Try it for free</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Security and Tech */}
                <section className="py-24 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <ShieldCheck size={48} className="mx-auto text-indigo-400 mb-6" />
                        <h2 className="text-3xl font-bold mb-6">Private & Secure</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                            Your documents are stored securely using modern encryption. We use JWT-based authentication to ensure your library, flashcards, and quizzes are entirely private to your account.
                        </p>
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
                        <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                        <Link to="/learn-more" className="text-white font-bold transition-colors">About Us</Link>
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

// Helper Components
const FeatureStep = ({ number, icon, title, description }) => (
    <div className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 transition-colors group">
        <div className="text-4xl font-black text-slate-200 dark:text-slate-800 absolute top-4 right-6 group-hover:text-indigo-100 dark:group-hover:text-indigo-900/40 transition-colors">
            {number}
        </div>
        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-800 relative z-10">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 relative z-10 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm relative z-10">
            {description}
        </p>
    </div>
);

const ListItem = ({ text }) => (
    <li className="flex items-start space-x-3">
        <div className="mt-1 w-5 h-5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span className="text-lg text-slate-700 dark:text-slate-300">{text}</span>
    </li>
);

const SparklesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
        <path d="M12 3v18m9-9H3m15-6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5M6 6l3.5 3.5"></path>
    </svg>
);

export default LearnMore;
