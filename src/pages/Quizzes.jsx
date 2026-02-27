import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Map, CheckCircle2, XCircle, ChevronRight, Trophy, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeQuiz, setActiveQuiz] = useState(null);

    // Player state
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get('/quizzes');
            setQuizzes(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setCurrentIdx(0);
        setSelectedOptions({});
        setSubmitted(false);
    };

    const handleSelectOption = (questionId, option) => {
        if (submitted) return;
        setSelectedOptions(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmitQuiz = async () => {
        if (Object.keys(selectedOptions).length < activeQuiz.questions.length) {
            setWarning("Please answer all questions before submitting.");
            setTimeout(() => setWarning(''), 3000);
            return;
        }
        setWarning('');

        setSubmitted(true);
        let calculatedScore = 0;

        activeQuiz.questions.forEach((q) => {
            if (selectedOptions[q._id] === q.correctAnswer) {
                calculatedScore += 1;
            }
        });

        try {
            await api.put(`/quizzes/${activeQuiz._id}/score`, { score: calculatedScore });
            fetchQuizzes(); // Refresh scores quietly
        } catch (err) {
            console.error("Error saving score", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Quiz Player View
    if (activeQuiz) {
        const q = activeQuiz.questions[currentIdx];
        const isAnswered = !!selectedOptions[q._id];

        // Calculate final score purely for display if submitted
        const finalScore = activeQuiz.questions.reduce((acc, current) => {
            return acc + (selectedOptions[current._id] === current.correctAnswer ? 1 : 0);
        }, 0);

        return (
            <div className="text-slate-900 dark:text-white pb-10 max-w-3xl mx-auto flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setActiveQuiz(null)}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center space-x-1"
                    >
                        <ChevronRight className="rotate-180" size={16} /> <span>Back to Quizzes</span>
                    </button>
                    <div className="text-sm font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full">
                        Question {currentIdx + 1} of {activeQuiz.questions.length}
                    </div>
                </div>

                {submitted && currentIdx === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white text-center shadow-xl shadow-indigo-500/20"
                    >
                        <div className="inline-flex w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4">
                            <Trophy size={32} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                        <p className="text-indigo-100 text-lg">You scored {finalScore} out of {activeQuiz.totalQuestions}</p>
                    </motion.div>
                )}

                {warning && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm font-medium text-center"
                    >
                        {warning}
                    </motion.div>
                )}

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm flex-1 flex flex-col relative overflow-hidden">
                    <h3 className="text-2xl font-bold mb-8 leading-relaxed">{q.questionText}</h3>

                    <div className="space-y-4 mb-10 relative z-10">
                        {q.options.map((opt, i) => {
                            const isSelected = selectedOptions[q._id] === opt;
                            const isCorrect = opt === q.correctAnswer;

                            let optionClass = "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50";
                            let Icon = null;

                            if (submitted) {
                                if (isCorrect) {
                                    optionClass = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-medium";
                                    Icon = <CheckCircle2 size={20} className="text-emerald-500" />;
                                } else if (isSelected && !isCorrect) {
                                    optionClass = "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
                                    Icon = <XCircle size={20} className="text-red-500" />;
                                } else {
                                    optionClass = "border-slate-200 dark:border-slate-800 opacity-50";
                                }
                            } else if (isSelected) {
                                optionClass = "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400 font-medium";
                            }

                            return (
                                <button
                                    key={i}
                                    disabled={submitted}
                                    onClick={() => handleSelectOption(q._id, opt)}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${optionClass}`}
                                >
                                    <span className="text-lg">{opt}</span>
                                    {Icon}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                            disabled={currentIdx === 0}
                            className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                        >
                            Previous
                        </button>

                        {!submitted && currentIdx === activeQuiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={!isAnswered}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentIdx(prev => Math.min(activeQuiz.questions.length - 1, prev + 1))}
                                disabled={currentIdx === activeQuiz.questions.length - 1}
                                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium disabled:opacity-30 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <ChevronRight size={18} />
                            </button>
                        )}
                    </div>


                </div>
            </div>
        );
    }

    // Quiz List View
    return (
        <div className="text-slate-900 dark:text-white pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-sans tracking-tight">Quizzes</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Test your knowledge with AI-generated quizzes.</p>
                </div>
            </div>

            {quizzes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <Map size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No quizzes available</h3>
                    <p className="text-slate-500 max-w-sm">
                        Open a document in the reader and click 'Quizzes' then generate a new quiz to start testing yourself!
                    </p>
                    <Link to="/documents" className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition-all">
                        Go to Documents
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map(quiz => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={quiz._id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all group relative flex flex-col"
                        >
                            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center shadow-sm border border-pink-100 dark:border-pink-500/20">
                                        <Map size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Score</span>
                                        <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                            {quiz.score}/{quiz.totalQuestions}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-1 truncate" title={`Quiz on Document`}>Quiz • {quiz.totalQuestions} Questions</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Created {new Date(quiz.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 flex justify-end">
                                <button
                                    onClick={() => startQuiz(quiz)}
                                    className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm transition-colors w-full justify-center"
                                >
                                    <Play size={16} fill="currentColor" />
                                    <span>{quiz.score > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
