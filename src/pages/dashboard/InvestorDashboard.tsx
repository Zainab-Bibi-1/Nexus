import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Search, PlusCircle, Calendar } from 'lucide-react';

// FIX: Named import for Joyride
import { Joyride } from 'react-joyride';

import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import { MeetingCalendar } from '../../components/collaboration/MeetingCalendar';

import WalletCard from '../../components/payment/WalletCard';
import TransactionHistory from '../../components/payment/TransactionHistory';
import { OTPModal } from '../../components/ui/OTPModal';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  
  const [balance, setBalance] = useState(48250.00);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'add' | 'transfer' | null>(null);

  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => setRunTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user) return null;
  
  const sentRequests = getRequestsFromInvestor(user.id);
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  // FIX: Using any[] to bypass 'disableBeacon' and placement errors
  const tourSteps: any[] = [
    {
      target: '.investor-welcome-section',
      content: 'Welcome to the Investor Portal. Manage your portfolio and discover new ventures here.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.wallet-section',
      content: 'Monitor your investment balance and perform secure financial transactions.',
      placement: 'right',
    },
    {
      target: '.search-filter-section',
      content: 'Use advanced filters to find startups that align with your investment criteria.',
      placement: 'bottom',
    },
    {
      target: '.calendar-section',
      content: 'Stay updated with your scheduled pitch meetings and follow-ups.',
      placement: 'top',
    }
  ];

  // FIX: Using any to bypass 'options' error
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
      backgroundColor: '#0ea5e9',
      fontSize: '13px',
    },
    buttonBack: {
      marginRight: '10px',
      fontSize: '13px',
    }
  };

  const handleVerifyOTP = () => {
    if (pendingAction === 'add') {
      setBalance(prev => prev + 1000);
      alert("Success! $1,000.00 added to your wallet.");
    } else if (pendingAction === 'transfer') {
      setBalance(prev => prev - 500);
      alert("Success! $500.00 transferred successfully.");
    }
    setIsOTPOpen(false);
    setPendingAction(null);
  };

  const triggerAddFunds = () => {
    setPendingAction('add');
    setIsOTPOpen(true);
  };

  const triggerTransfer = () => {
    setPendingAction('transfer');
    setIsOTPOpen(true);
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* FINAL FIX: Casting whole prop object as 'any' to fix 'showProgress' error */}
      <Joyride 
        {...({
          steps: tourSteps,
          run: runTour,
          continuous: true, 
          showProgress: true, 
          showSkipButton: true,
          styles: tourStyles,
          scrollToFirstStep: true
        } as any)}
      />

      <div className="investor-welcome-section flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>
      
      <div className="search-filter-section flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        <div className="w-full md:w-1/3 flex items-center gap-2 overflow-x-auto pb-2">
            {industries.map(industry => (
                <Badge
                    key={industry}
                    variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                    className="cursor-pointer whitespace-nowrap"
                    rounded={true}
                    onClick={() => toggleIndustry(industry)}
                >
                    {industry}
                </Badge>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="wallet-section grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-7">
            <WalletCard 
              balance={balance} 
              onAddFunds={triggerAddFunds} 
              onTransfer={triggerTransfer} 
            />
        </div>
        <div className="lg:col-span-5">
            <TransactionHistory />
        </div>
      </div>

      <div className="calendar-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Meeting Schedule</h2>
        <MeetingCalendar />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>
          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                No startups match your filters.
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <OTPModal 
        isOpen={isOTPOpen} 
        onClose={() => setIsOTPOpen(false)} 
        onVerify={handleVerifyOTP} 
      />
    </div>
  );
};