import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle
} from 'lucide-react';

// Path aapke folder structure ke mutabiq: layout se bahar nikal kar collaboration folder mein
import { DocumentChamberModal } from '../collaboration/DocumentChamber';
interface SidebarItemProps {
  to?: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, onClick }) => {
  const content = (
    <>
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-semibold">{text}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center py-2.5 px-4 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left"
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to || '#'}
      className={({ isActive }) => 
        `flex items-center py-2.5 px-4 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-primary-50 text-primary-700 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      {content}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  
  if (!user) return null;
  
  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];
  
  return (
    <div className="w-64 bg-white h-full border-r border-gray-100 hidden md:block shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="px-4 space-y-1.5">
            {/* Main Links */}
            <SidebarItem 
              to={user.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor'} 
              icon={<Home size={20} />} 
              text="Dashboard" 
            />
            
            <SidebarItem 
              to={user.role === 'entrepreneur' ? '/profile/entrepreneur/' + user.id : '/profile/investor/' + user.id} 
              icon={user.role === 'entrepreneur' ? <Building2 size={20} /> : <CircleDollarSign size={20} />} 
              text={user.role === 'entrepreneur' ? 'My Startup' : 'My Portfolio'} 
            />

            <SidebarItem 
              to={user.role === 'entrepreneur' ? '/investors' : '/entrepreneurs'} 
              icon={user.role === 'entrepreneur' ? <CircleDollarSign size={20} /> : <Users size={20} />} 
              text={user.role === 'entrepreneur' ? 'Find Investors' : 'Find Startups'} 
            />

            <SidebarItem to="/messages" icon={<MessageCircle size={20} />} text="Messages" />
            <SidebarItem to="/notifications" icon={<Bell size={20} />} text="Notifications" />

            {/* Document Chamber Trigger Button */}
            <SidebarItem 
              icon={<FileText size={20} />} 
              text={user.role === 'entrepreneur' ? 'Documents' : 'Deals'} 
              onClick={() => setIsDocModalOpen(true)} 
            />
          </div>
          
          <div className="mt-10 px-4">
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
              System Settings
            </h3>
            <div className="space-y-1.5">
              {commonItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Help Desk</p>
            <h4 className="text-sm font-bold text-gray-900 mt-1">Nexus Support</h4>
            <a 
              href="mailto:support@businessnexus.com" 
              className="mt-3 block text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors truncate"
            >
              support@businessnexus.com
            </a>
          </div>
        </div>
      </div>

      {/* Document Modal Component */}
      <DocumentChamberModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
      />
    </div>
  );
};