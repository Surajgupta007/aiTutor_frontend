import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, BookOpen, Map, ChevronLeft, ChevronRight, Minimize, Maximize } from 'lucide-react';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Reader = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);

    // PDF state
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    // Chat state
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I am your AI study assistant. Ask me anything about this document, or use the tools above to generate summaries and flashcards.' }
    ]);
    const [inputText, setInputText] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    // Active Tab
    const [activeTab, setActiveTab] = useState('chat'); // chat, summary
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);

    const generateLoading = useRef(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
    };

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const res = await api.get(`/documents/${id}`);
                setDocument(res.data.data);
                if (res.data.data.summary) {
                    setSummary(res.data.data.summary);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoc();
    }, [id]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || chatLoading) return;

        const userMsg = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setChatLoading(true);

        try {
            const history = messages.slice(1).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const res = await api.post('/ai/chat', {
                documentId: id,
                question: userMsg.text,
                history
            });

            setMessages(prev => [...prev, { role: 'model', text: res.data.data }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error answering your question.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (generateLoading.current) return;
        generateLoading.current = true;
        setSummaryLoading(true);
        setActiveTab('summary');

        try {
            const res = await api.post('/ai/summary', { documentId: id });
            setSummary(res.data.data.summary);
        } catch (err) {
            console.error("Error generating summary", err);
        } finally {
            setSummaryLoading(false);
            generateLoading.current = false;
        }
    };

    const handleGenerateFlashcards = async () => {
        if (generateLoading.current) return;
        generateLoading.current = true;
        showToast("Generating flashcards... They will appear in your Flashcards tab soon.", 'info');
        try {
            await api.post('/ai/flashcards', { documentId: id, numCards: 10 });
            showToast("Flashcards generated successfully! Check your Flashcards tab.", 'success');
        } catch (err) {
            showToast("Error generating flashcards", 'error');
        } finally {
            generateLoading.current = false;
        }
    };

    const handleGenerateQuiz = async () => {
        if (generateLoading.current) return;
        generateLoading.current = true;
        showToast("Generating a new 5-question quiz... It will appear in your Quizzes tab shortly.", 'info');
        try {
            await api.post('/ai/quiz', { documentId: id, numQuestions: 5, difficulty: 'medium' });
            showToast("Quiz generated successfully! Click the Quizzes button to play it.", 'success');
        } catch (err) {
            showToast("Error generating quiz", 'error');
            console.error(err);
        } finally {
            generateLoading.current = false;
        }
    };

    const fileUrl = document
        ? (document.filePath?.startsWith('http')
            ? document.filePath
            : `${import.meta.env.VITE_API_BASE || 'http://localhost:5001'}/${document.filePath}`)
        : null;

    return (
        <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] w-full flex flex-col pt-2 text-slate-900 dark:text-white relative">
            {/* Toast Notification */}
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border backdrop-blur-sm max-w-sm ${toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' :
                        toast.type === 'error' ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30' :
                            'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                        }`}
                >
                    {toast.message}
                </motion.div>
            )}
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center space-x-4">
                    <Link to="/documents" className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="text-xl font-bold truncate max-w-xs md:max-w-md" title={document?.fileName}>
                        {document ? document.fileName : 'Loading Document...'}
                    </h2>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleGenerateFlashcards}
                        className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors font-medium text-sm"
                    >
                        <BookOpen size={16} />
                        <span>Generate Flashcards</span>
                    </button>
                    <button
                        onClick={handleGenerateQuiz}
                        className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors font-medium text-sm"
                    >
                        <Sparkles size={16} />
                        <span>Generate Quiz</span>
                    </button>
                    <Link
                        to="/quizzes"
                        className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-500/30 transition-colors font-medium text-sm"
                    >
                        <Map size={16} />
                        <span>Quizzes</span>
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
                {/* Left: PDF Viewer */}
                <div className="flex-1 bg-slate-200 dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col relative shadow-inner">
                    <div className="bg-slate-100 dark:bg-slate-950 p-2 flex justify-between items-center border-b border-slate-300 dark:border-slate-800 shrink-0 z-10">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                            <button
                                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                disabled={pageNumber <= 1}
                                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span>Page {pageNumber} of {numPages || '?'}</span>
                            <button
                                onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}
                                disabled={pageNumber >= numPages}
                                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
                                <Minimize size={18} />
                            </button>
                            <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
                                <Maximize size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 flex justify-center custom-scrollbar bg-slate-200/50 dark:bg-slate-900">
                        {fileUrl && (
                            <Document
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="flex justify-center mt-20">
                                        <div className="animate-pulse flex flex-col items-center">
                                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                            <p className="mt-4 font-medium text-slate-500">Loading document...</p>
                                        </div>
                                    </div>
                                }
                                error={
                                    <div className="flex justify-center mt-20 text-red-500 font-medium">
                                        Failed to load PDF. Please make sure the server is running.
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    className="shadow-xl"
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        )}
                    </div>
                </div>

                {/* Right: AI Tools Pane */}
                <div className="w-full lg:w-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col shadow-sm flex-shrink-0 lg:h-full lg:max-h-full">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 space-x-2 shrink-0">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'chat' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            AI Assistant
                        </button>
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'summary' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            Summary
                        </button>
                    </div>

                    {/* Chat Pane */}
                    {activeTab === 'chat' && (
                        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950/50 rounded-b-3xl">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                                            }`}>
                                            {msg.role === 'model' && (
                                                <div className="flex items-center space-x-2 mb-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                                                    <Sparkles size={12} />
                                                    <span>Gemini</span>
                                                </div>
                                            )}

                                            {/* Simple formatting for model response (handling basic markdown implicitly via white-space) */}
                                            <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                                        </div>
                                    </motion.div>
                                ))}

                                {chatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-3xl shrink-0">
                                <form onSubmit={handleSendMessage} className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Ask a question about the document..."
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition-all text-sm"
                                        disabled={chatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim() || chatLoading}
                                        className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Summary Pane */}
                    {activeTab === 'summary' && (
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/50 rounded-b-3xl custom-scrollbar relative">
                            {!summary && !summaryLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                        <Sparkles size={28} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Generate a Summary</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-[250px]">
                                        Let Gemini read the entire document and extract the most important bullet points for you.
                                    </p>
                                    <button
                                        onClick={handleGenerateSummary}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition-all flex items-center space-x-2"
                                    >
                                        <Sparkles size={18} />
                                        <span>Generate Now</span>
                                    </button>
                                </div>
                            ) : summaryLoading ? (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                    <p className="font-medium text-slate-500 animate-pulse">Analyzing document...</p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose dark:prose-invert prose-indigo prose-sm sm:prose-base max-w-none"
                                >
                                    <div className="flex justify-between items-center mb-6 not-prose">
                                        <h3 className="text-xl font-bold flex items-center space-x-2">
                                            <Sparkles className="text-indigo-500" size={20} />
                                            <span>Document Summary</span>
                                        </h3>
                                        <button
                                            onClick={handleGenerateSummary}
                                            className="text-xs font-semibold px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-4">
                                        {summary}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reader;
