import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const Flashcards = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [filter, setFilter] = useState('all'); // all, favorites

    const fetchFlashcards = async () => {
        try {
            const res = await api.get('/flashcards');
            setFlashcards(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
        }, 150);
    };

    const toggleFavorite = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await api.put(`/flashcards/${id}/favorite`);
            setFlashcards(cards => cards.map(c => c._id === id ? res.data.data : c));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await api.delete(`/flashcards/${id}`);
            setFlashcards(cards => cards.filter(c => c._id !== id));
            if (currentIndex >= filteredCards.length - 1) {
                setCurrentIndex(Math.max(0, filteredCards.length - 2));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCards = flashcards.filter(c => filter === 'all' || c.isFavorite);
    const currentCard = filteredCards[currentIndex];

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="text-slate-900 dark:text-white pb-10 flex flex-col h-full min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-sans tracking-tight">Flashcards</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review your AI-generated study cards.</p>
                </div>

                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                    <button
                        onClick={() => { setFilter('all'); setCurrentIndex(0); setIsFlipped(false); }}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        All Cards
                    </button>
                    <button
                        onClick={() => { setFilter('favorites'); setCurrentIndex(0); setIsFlipped(false); }}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'favorites' ? 'bg-white dark:bg-slate-700 shadow-sm text-pink-600 dark:text-pink-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Favorites Only
                    </button>
                </div>
            </div>

            {filteredCards.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No flashcards found</h3>
                    <p className="text-slate-500 max-w-sm">
                        {filter === 'favorites' ? "You haven't marked any flashcards as favorite yet." : "Open a document in the reader and click 'Generate Flashcards' to create some!"}
                    </p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
                    {/* Progress Indicator */}
                    <div className="w-full mb-8 flex justify-between items-center px-4">
                        <span className="font-medium text-slate-500 dark:text-slate-400">
                            Card {currentIndex + 1} of {filteredCards.length}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => toggleFavorite(currentCard._id, e)}
                                className={`p-2 rounded-xl transition-colors ${currentCard.isFavorite ? 'text-pink-500 bg-pink-50 dark:bg-pink-500/10 hover:bg-pink-100' : 'text-slate-400 hover:text-pink-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                title={currentCard.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart size={20} className={currentCard.isFavorite ? "fill-current" : ""} />
                            </button>
                            <button
                                onClick={(e) => handleDelete(currentCard._id, e)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                title="Delete card"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[400px] perspective-1000 mb-10">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={currentIndex + (isFlipped ? '-flipped' : '')}
                                initial={{ rotateX: isFlipped ? -90 : 90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                exit={{ rotateX: isFlipped ? 90 : -90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setIsFlipped(!isFlipped)}
                                className={`absolute inset-0 w-full h-full rounded-3xl cursor-pointer p-8 md:p-12 shadow-xl border 
                  flex items-center justify-center text-center 
                  ${isFlipped
                                        ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-700'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <div className="h-full w-full flex flex-col items-center justify-center overflow-auto custom-scrollbar">
                                    {!isFlipped ? (
                                        <>
                                            <span className="text-xs uppercase tracking-widest text-indigo-500 font-bold mb-4 block">Question</span>
                                            <h2 className="text-2xl md:text-3xl font-bold dark:text-white leading-tight">
                                                {currentCard.question}
                                            </h2>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-4 block">Answer</span>
                                            <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                                {currentCard.answer}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="absolute bottom-4 text-sm text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                                    Click to flip
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={handlePrev}
                            disabled={filteredCards.length <= 1}
                            className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm font-semibold text-slate-400">Use arrows to navigate</span>
                        <button
                            onClick={handleNext}
                            disabled={filteredCards.length <= 1}
                            className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Flashcards;
