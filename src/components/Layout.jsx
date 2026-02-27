import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                <main className="max-w-7xl mx-auto h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
