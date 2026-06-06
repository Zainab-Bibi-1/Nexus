import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

const transactions = [
  {
    id: '1',
    name: 'TechStart AI Funding',
    type: 'sent',
    amount: '$5,000.00',
    date: 'Oct 12, 2026',
    status: 'Completed',
  },
  {
    id: '2',
    name: 'Wallet Top-up',
    type: 'received',
    amount: '$10,000.00',
    date: 'Oct 10, 2026',
    status: 'Completed',
  },
  {
    id: '3',
    name: 'Consultation Fee',
    type: 'received',
    amount: '$450.00',
    date: 'Oct 08, 2026',
    status: 'Pending',
  },
];

const TransactionHistory = () => {
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-800 text-lg">Recent Transactions</h3>
        <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'received' ? (
                        <ArrowDownLeft className="text-green-600" size={18} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{tx.name}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 px-6">
                   <div className="flex flex-col items-end">
                      <p className={`font-bold ${tx.type === 'received' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'received' ? '+' : '-'}{tx.amount}
                      </p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${
                        tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tx.status}
                      </span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionHistory;