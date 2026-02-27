import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, X, AlertCircle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadModal, setUploadModal] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type !== "application/pdf") {
            setError("Please select a valid PDF file.");
            setFile(null);
            return;
        }
        setError('');
        setFile(selected);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadModal(false);
            setFile(null);
            fetchDocuments();
        } catch (err) {
            setError(err.response?.data?.error || "Error uploading file");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(docs => docs.filter(doc => doc._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="text-slate-900 dark:text-white pb-10 h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-sans tracking-tight">Document Library</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your uploaded PDFs and start learning.</p>
                </div>
                <button
                    onClick={() => setUploadModal(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 transition-all"
                >
                    <Upload size={18} />
                    <span>Upload PDF</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20 flex-1">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : documents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="inline-flex w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4 text-slate-400">
                        <Database size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No documents found</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">Upload your first PDF to start generating summaries, flashcards, and quizzes.</p>
                    <button
                        onClick={() => setUploadModal(true)}
                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium transition-colors border border-slate-300 dark:border-slate-700"
                    >
                        Upload Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documents.map(doc => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={doc._id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-indigo-500/50 transition-all group flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-red-100 dark:border-red-500/20">
                                    <FileText size={24} />
                                </div>
                                <h3 className="font-bold text-lg mb-1 truncate" title={doc.fileName}>{doc.fileName}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <Link
                                    to={`/reader/${doc._id}`}
                                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 rounded-xl font-semibold text-sm transition-colors"
                                >
                                    Open Reader
                                </Link>
                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                                    title="Delete Document"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {uploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm"
                            onClick={() => setUploadModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold">Upload Document</h3>
                                <button onClick={() => setUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-xl">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-6">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center space-x-2 border border-red-200 dark:border-red-500/20">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all mb-6 relative group">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="pointer-events-none flex flex-col items-center relative z-10">
                                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                                            <Upload size={28} />
                                        </div>
                                        {file ? (
                                            <div className="text-indigo-600 dark:text-indigo-400 font-medium break-all px-4">{file.name}</div>
                                        ) : (
                                            <>
                                                <h4 className="font-semibold text-lg mb-1 text-slate-800 dark:text-slate-200">Click to browse or drag PDF</h4>
                                                <p className="text-sm text-slate-500">Max file size: 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setUploadModal(false)}
                                        className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading || !file}
                                        className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-md shadow-indigo-600/20 transition-all flex justify-center items-center space-x-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={18} />
                                                <span>Upload</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Documents;
