import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, AlertTriangle, Zap, CheckCircle2, XCircle, Brain, RefreshCw, Layers } from 'lucide-react';
import api from '../services/api';

const Revision = () => {
    const [documents, setDocuments] = useState([]);
    const [revisions, setRevisions] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState('');
    const [duration, setDuration] = useState(30);
    const [loading, setLoading] = useState(false);
    const [activeRevision, setActiveRevision] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
    };

    // Rapid Fire State
    const [rapidFireActive, setRapidFireActive] = useState(false);
    const [rfIndex, setRfIndex] = useState(0);
    const [rfScore, setRfScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const docRes = await api.get('/documents');
            setDocuments(docRes.data.data);

            const revRes = await api.get('/revision');
            setRevisions(revRes.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const generatePlan = async () => {
        if (!selectedDocument) {
            showToast("Please select a document", 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/revision/generate', {
                documentId: selectedDocument,
                duration
            });
            setActiveRevision(res.data.data);
            fetchData();
        } catch (error) {
            console.error(error);
            showToast("Failed to generate plan", 'error');
        } finally {
            setLoading(false);
        }
    };

    const startRapidFire = () => {
        setRapidFireActive(true);
        setRfIndex(0);
        setRfScore(0);
        setTimeLeft(10);
        setFlipped(false);
    };

    // Timer logic for Rapid Fire
    useEffect(() => {
        let timer;
        if (rapidFireActive && timeLeft > 0 && !flipped) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (rapidFireActive && timeLeft === 0 && !flipped) {
            setFlipped(true);
        }
        return () => clearTimeout(timer);
    }, [timeLeft, rapidFireActive, flipped]);

    const handleAnswer = async (knewIt) => {
        const newScore = knewIt ? rfScore + 1 : rfScore;
        setRfScore(newScore);

        const flashcards = activeRevision.plan.flashcards || [];
        if (rfIndex < flashcards.length - 1) {
            setRfIndex(prev => prev + 1);
            setFlipped(false);
            setTimeLeft(10);
        } else {
            setRapidFireActive(false);
            try {
                await api.put(`/revision/${activeRevision._id}/score`, {
                    score: newScore,
                    total: flashcards.length
                });
                showToast(`Rapid Fire Complete! You scored ${newScore}/${flashcards.length}`, 'success');

                setActiveRevision(prev => ({
                    ...prev,
                    rapidFireScore: newScore,
                    rapidFireTotal: flashcards.length
                }));
            } catch (err) {
                console.error("Failed to save score");
            }
        }
    };

    // Render Rapid Fire Mode
    if (rapidFireActive && activeRevision?.plan?.flashcards?.length > 0) {
        const card = activeRevision.plan.flashcards[rfIndex];
        const totalCards = activeRevision.plan.flashcards.length;

        return (
            <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-white backdrop-blur-sm">
                <div className="absolute top-8 left-8 flex items-center space-x-2 text-indigo-400">
                    <Zap size={24} />
                    <span className="text-xl font-bold tracking-wider uppercase">Rapid Fire</span>
                </div>

                <div className="absolute top-8 right-8 text-xl font-medium text-slate-400">
                    {rfIndex + 1} / {totalCards}
                </div>

                <div className="w-full max-w-2xl">
                    {/* Timer Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
                        <motion.div
                            className={`h-full ${timeLeft <= 3 ? 'bg-red-500' : 'bg-indigo-500'}`}
                            initial={{ width: '100%' }}
                            animate={{ width: `${(timeLeft / 10) * 100}%` }}
                            transition={{ ease: "linear", duration: 1 }}
                        />
                    </div>

                    {/* Card container with perspective */}
                    <div className="relative w-full h-96 [perspective:1000px] mb-8 cursor-pointer group" onClick={() => setFlipped(true)}>
                        <motion.div
                            className="w-full h-full relative [transform-style:preserve-3d] transition-all duration-500"
                            animate={{ rotateX: flipped ? 180 : 0 }}
                        >
                            {/* Front (Question) */}
                            <div className="absolute inset-0 backface-hidden [backface-visibility:hidden] bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl transition-colors">
                                <span className="text-indigo-400 font-medium mb-4 uppercase tracking-wider text-sm flex items-center"><Target size={16} className="mr-2" /> Question</span>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight">{card.question}</h2>
                                {!flipped && <p className="absolute bottom-8 animate-pulse text-slate-500 text-sm">Click card to flip or wait {timeLeft}s</p>}
                            </div>

                            {/* Back (Answer) */}
                            <div className="absolute inset-0 backface-hidden [backface-visibility:hidden] [transform:rotateX(180deg)] bg-indigo-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-indigo-600/20">
                                <span className="text-indigo-200 font-medium mb-4 uppercase tracking-wider text-sm flex items-center"><Layers size={16} className="mr-2" /> Answer</span>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">{card.answer}</h2>
                            </div>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <AnimatePresence>
                        {flipped && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center gap-6"
                            >
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="flex items-center space-x-2 px-8 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-bold text-lg transition-all"
                                >
                                    <XCircle size={24} />
                                    <span>Didn't Know It</span>
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="flex items-center space-x-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
                                >
                                    <CheckCircle2 size={24} />
                                    <span>I Knew It!</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="text-slate-900 dark:text-white pb-16 space-y-8 relative">
            {/* Toast Notification */}
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border backdrop-blur-sm max-w-sm ${toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' :
                            toast.type === 'error' ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30' :
                                'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                        }`}
                >
                    {toast.message}
                </motion.div>
            )}

            {/* ── Page Header ── */}
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3 mb-2">
                    <span className="text-indigo-500 dark:text-indigo-400"><Target size={38} /></span>
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Smart Revision Mode</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-medium">AI-powered optimized crash courses based on your analytics.</p>
            </div>

            {/* ── Generator Card ── */}
            <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                {/* Subtle glow */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-stretch sm:items-end gap-5">
                    {/* Select Document */}
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Layers size={13} /> Select Document
                        </label>
                        <select
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument(e.target.value)}
                            className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 appearance-none outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-slate-600"
                        >
                            <option value="">Choose a document to revise…</option>
                            {documents.map(doc => (
                                <option key={doc._id} value={doc._id}>{doc.fileName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Duration */}
                    <div className="w-full sm:w-44 flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Clock size={13} /> Duration
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 appearance-none outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-slate-600"
                        >
                            <option value={15}>15 Minutes</option>
                            <option value={30}>30 Minutes</option>
                            <option value={60}>60 Minutes</option>
                        </select>
                    </div>

                    {/* Generate Button */}
                    <div className="w-full sm:w-auto">
                        <button
                            onClick={generatePlan}
                            disabled={loading}
                            className="w-full h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={18} />
                                    <span>Generating…</span>
                                </>
                            ) : (
                                <>
                                    <Brain size={18} />
                                    <span>Generate Plan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Loading Bar ── */}
            {loading && (
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 1.4 }}
                    />
                </div>
            )}

            {/* ── Results ── */}
            {activeRevision?.plan && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6"
                >
                    {/* Row 1: Concepts + Timeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* High-Yield Concepts */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 hover:border-indigo-500/30 transition-colors group">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                                <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-600/30 transition-colors">
                                    <Target size={18} />
                                </span>
                                High-Yield Concepts
                            </h3>
                            <div className="space-y-3">
                                {(activeRevision.plan.topConcepts || []).map((concept, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all cursor-default group/item">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-snug">{concept}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attack Plan */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 hover:border-purple-500/30 transition-colors group">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                                <span className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-600/20 border border-purple-100 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-600/30 transition-colors">
                                    <Clock size={18} />
                                </span>
                                {duration}-Min Attack Plan
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(activeRevision.plan.timeline || []).map((step, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden hover:border-purple-500/30 hover:-translate-y-0.5 transition-all group/step flex flex-col gap-2">
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-30 group-hover/step:opacity-100 transition-opacity" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 flex items-center gap-1">
                                            <Zap size={10} />{step.time}
                                        </span>
                                        <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug">{step.action}</p>
                                        <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500">
                                            <span className="flex items-center gap-1.5"><Brain size={11} /> {step.method}</span>
                                            <span className="flex items-center gap-1.5 text-purple-500 dark:text-purple-400 font-medium"><Target size={11} /> {step.focus} Focus</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Mistakes + (Rapid Fire + Tips) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Common Mistakes */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 hover:border-rose-500/30 transition-colors group">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                                <span className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-600/20 border border-rose-100 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-600/30 transition-colors">
                                    <AlertTriangle size={18} />
                                </span>
                                Exam Traps & Fixes
                            </h3>
                            <div className="space-y-3">
                                {(activeRevision.plan.commonMistakes || []).map((mistake, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3 hover:border-rose-500/30 transition-all hover:-translate-y-0.5">
                                        <p className="text-slate-900 dark:text-white text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">{mistake.mistake}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/20 rounded-lg p-3 space-y-1">
                                                <p className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1"><XCircle size={11} />Trap</p>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{mistake.why}</p>
                                            </div>
                                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-3 space-y-1">
                                                <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={11} />Fix</p>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{mistake.tip}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right sub-column: Rapid Fire + Tips */}
                        <div className="flex flex-col gap-6">

                            {/* Rapid Fire */}
                            <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#1a1040] dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20 rounded-3xl p-6 md:p-8 overflow-hidden shadow-sm group hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="relative z-10 flex items-center gap-5">
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10 group-hover:scale-105 transition-transform">
                                        <Zap size={30} className="text-white fill-current" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Rapid Fire</h3>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">10s / card</span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-relaxed">10 high-yield flashcards. Beat the clock — ultimate exam readiness check.</p>
                                        <button
                                            onClick={startRapidFire}
                                            className="w-full py-2.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                        >
                                            Start Protocol <Zap size={15} />
                                        </button>
                                    </div>
                                </div>

                                {activeRevision.rapidFireScore !== undefined && activeRevision.rapidFireTotal && (
                                    <div className="relative z-10 mt-5 flex items-center justify-between bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3.5">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Best Score</span>
                                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-300">{activeRevision.rapidFireScore}<span className="text-slate-400 dark:text-slate-500 text-sm font-bold"> / {activeRevision.rapidFireTotal}</span></span>
                                    </div>
                                )}
                            </div>

                            {/* Last Minute Tips */}
                            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm hover:border-amber-500/30 transition-colors group space-y-5">
                                <h3 className="text-lg font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                                    <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-600/20 border border-amber-100 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-600/30 transition-colors">
                                        <Brain size={18} />
                                    </span>
                                    Last Minute Tips
                                </h3>
                                <ul className="space-y-3">
                                    {(activeRevision.plan.tips || []).map((tip, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border-l-4 border-amber-400 dark:border-amber-500/60 rounded-r-xl p-4 leading-relaxed hover:border-amber-500 dark:hover:border-amber-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                            <span className="flex-1">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default Revision;
