import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, PlusCircle } from 'lucide-react';

// FIXED: Default import use kiya hay taake deployment error na aaye
import  {Joyride} from 'react-joyride';

import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { type CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';
import { MeetingCalendar } from '../../components/collaboration/MeetingCalendar';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [runTour, setRunTour] = useState(false);

  const [profileViews] = useState(24);
  const [upcomingMeetings] = useState(2);
  const [recommendedInvestors] = useState(investors.slice(0, 3));

  const tourSteps: any[] = [
    {
      target: '.welcome-section',
      content: 'Welcome to your Nexus Dashboard. Monitor your startup performance and activities here.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.stats-requests',
      content: 'Manage your incoming collaboration requests and networking growth.',
      placement: 'top',
    },
    {
      target: '.stats-meetings',
      content: 'Track the total count of your upcoming professional meetings.',
      placement: 'top',
    },
    {
      target: '.calendar-card',
      content: 'Use this interactive calendar to coordinate your appointments.',
      placement: 'left',
    },
    {
      target: '.find-investors-btn',
      content: 'Ready to scale? Access our database to find potential strategic partners.',
      placement: 'bottom',
    }
  ];

  const tourStyles: any = {
    options: {
      primaryColor: '#0ea5e9',
      zIndex: 10000,
      backgroundColor: '#ffffff',
      textColor: '#334155',
      arrowColor: '#ffffff',
    },
    tooltip: {
      width: 280,
      padding: '12px',
      borderRadius: '8px',
    },
    tooltipContent: {
      fontSize: '14px',
      padding: '5px 0',
    },
    buttonNext: {
      fontSize: '13px',
      padding: '8px 12px',
      backgroundColor: '#0ea5e9',
    },
    buttonBack: {
      fontSize: '13px',
      marginRight: '10px',
    }
  };

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
      
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  const acceptedRequests = collaborationRequests.filter(req => req.status === 'accepted');

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      {/* FIXED: 'run' prop ko 'runTour' se link kar diya hay */}
      <Joyride 
        {...({
          steps: tourSteps,
          run: runTour,
          continuous: true,
          showProgress: true,
          showSkipButton: true,
          style: tourStyles
        } as any)}
      />

      <div className="welcome-section flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Review your startup performance and professional networking metrics.</p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/investors" className="find-investors-btn">
            <Button leftIcon={<PlusCircle size={18} />}>
              Find Investors
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stats-requests bg-white border-l-4 border-l-primary-500 hover:shadow-md transition-all">
          <CardBody className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg mr-4">
              <Bell size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending Requests</p>
              <h3 className="text-xl font-bold">{pendingRequests.length}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-secondary-500 hover:shadow-md transition-all">
          <CardBody className="flex items-center">
            <div className="p-3 bg-secondary-50 rounded-lg mr-4">
              <Users size={20} className="text-secondary-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Connections</p>
              <h3 className="text-xl font-bold">{acceptedRequests.length}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="stats-meetings bg-white border-l-4 border-l-accent-500 hover:shadow-md transition-all">
          <CardBody className="flex items-center">
            <div className="p-3 bg-accent-50 rounded-lg mr-4">
              <Calendar size={20} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Upcoming Meetings</p>
              <h3 className="text-xl font-bold">{upcomingMeetings}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-green-500 hover:shadow-md transition-all">
          <CardBody className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Profile Views</p>
              <h3 className="text-xl font-bold">{profileViews}</h3>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="flex justify-between items-center bg-white border-b border-gray-100 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Collaboration Requests</h2>
              {pendingRequests.length > 0 && <Badge variant="primary">{pendingRequests.length} New</Badge>}
            </CardHeader>
            <CardBody className="p-0">
              {pendingRequests.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="p-4">
                      <CollaborationRequestCard
                        request={request}
                        onStatusUpdate={handleRequestStatusUpdate}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No pending collaboration requests.</div>
              )}
            </CardBody>
          </Card>

          <Card className="calendar-card border-none shadow-sm overflow-hidden">
             <CardHeader className="bg-white border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Meeting Schedule</h2>
             </CardHeader>
             <CardBody className="p-4">
                <MeetingCalendar />
             </CardBody>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recommended Investors</h2>
            </CardHeader>
            <CardBody className="space-y-4 p-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} showActions={false} />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};