import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { VideoCallModal } from '../../components/collaboration/VideoCallModal';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCallOpen, setIsCallOpen] = useState(false);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Navbar fixed height ke sath */}
      <Navbar onJoinCall={() => setIsCallOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar ko flex-shrink-0 diya taake ye dabay nahi */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content Area: overflow-y-auto zaroori hai scroll ke liye */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 relative">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            {/* Dashboard pages yahan load honge */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Video Call Modal */}
      <VideoCallModal 
        isOpen={isCallOpen} 
        onClose={() => setIsCallOpen(false)} 
        meetingTitle={`Seed Round Pitch - ${user?.name || 'Collaboration Session'}`} 
      />
    </div>
  );
};