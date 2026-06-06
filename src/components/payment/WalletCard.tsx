import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Interface add ki hai taake props receive ho saken
interface WalletCardProps {
  balance: number;
  onAddFunds: () => void;
  onTransfer: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, onAddFunds, onTransfer }) => {
  return (
    <Card className="p-0 border-none overflow-hidden shadow-xl shadow-blue-100/50">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 text-white">
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">
              Total Wallet Balance
            </p>
            {/* Ab yahan static value ki jagah dynamic balance show hoga */}
            <h2 className="text-4xl font-bold tracking-tight">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Wallet className="text-white" size={28} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={onAddFunds} // Dashboard ka function call hoga
            className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white flex items-center justify-center gap-2 py-6"
          >
            <Plus size={18} /> Add Funds
          </Button>
          <Button 
            variant="outline" 
            onClick={onTransfer} // Dashboard ka function call hoga
            className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white flex items-center justify-center gap-2 py-6"
          >
            <ArrowUpRight size={18} /> Transfer
          </Button>
        </div>
      </div>
      
      {/* Mini Stats Footer */}
      <div className="bg-white p-4 px-8 flex justify-between border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1.5 rounded-full">
            <ArrowDownLeft className="text-green-600" size={14} />
          </div>
          <span className="text-sm text-gray-500 font-medium">Income: <span className="text-gray-900">+$12k</span></span>
        </div>
        <div className="flex items-center gap-2 border-l pl-6 border-gray-100">
          <div className="bg-red-100 p-1.5 rounded-full">
            <ArrowUpRight className="text-red-600" size={14} />
          </div>
          <span className="text-sm text-gray-500 font-medium">Spent: <span className="text-gray-900">-$3.5k</span></span>
        </div>
      </div>
    </Card>
  );
};

export default WalletCard;