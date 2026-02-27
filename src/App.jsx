import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LearnMore from './pages/LearnMore';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Flashcards from './pages/Flashcards';
import Quizzes from './pages/Quizzes';
import Revision from './pages/Revision';
import Profile from './pages/Profile';
import Reader from './pages/Reader';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/services" element={<Services />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/revision" element={<Revision />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reader/:id" element={<Reader />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
