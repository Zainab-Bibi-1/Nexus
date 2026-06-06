import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, FileText, Upload, Download, Trash2, 
  CheckCircle, Clock, AlertCircle, Search,
  Briefcase // Naya icon Deals ke liye
} from 'lucide-react';

interface DocumentChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'signed' | 'pending' | 'draft';
  date: string;
}

export const DocumentChamberModal: React.FC<DocumentChamberModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Role-based terminology
  const isInvestor = user?.role === 'investor';
  const titleText = isInvestor ? 'Investment Deal Room' : 'Document Chamber';
  const subText = isInvestor ? 'Track your active investment deals and term sheets.' : 'Manage your legal contracts and pitch decks.';

  // Default Data based on Role
  const initialDocs: Document[] = user?.role === 'entrepreneur' 
    ? [
        { id: '1', name: 'Pitch_Deck_Final.pdf', type: 'PDF', size: '2.4 MB', status: 'signed', date: '2026-03-15' },
        { id: '2', name: 'Business_Model_Canvas.pdf', type: 'PDF', size: '1.1 MB', status: 'pending', date: '2026-03-20' },
      ]
    : [
        { id: '1', name: 'TechStart_Investment_TermSheet.pdf', type: 'PDF', size: '1.8 MB', status: 'signed', date: '2026-03-10' },
        { id: '2', name: 'Portfolio_Q1_Summary.docx', type: 'DOCX', size: '950 KB', status: 'draft', date: '2026-04-01' },
      ];

  const [documents, setDocuments] = useState<Document[]>(initialDocs);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, documents]);

  const handleDelete = (id: string) => {
    if(window.confirm(`Are you sure you want to delete this ${isInvestor ? 'deal document' : 'file'}?`)) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: (file.size / 1024).toFixed(1) + ' KB',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      setDocuments([newDoc, ...documents]);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} /> Signed</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><Clock size={12} /> Pending</span>;
      default:
        return <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full"><AlertCircle size={12} /> Draft</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl sm:my-8">
          {/* Header - Dynamic Title */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{titleText}</h3>
              <p className="text-sm text-gray-500">{subText}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {/* Upload Area - Dynamic Label */}
            <label className="mb-8 border-2 border-dashed border-indigo-100 rounded-2xl p-8 text-center bg-indigo-50/30 hover:bg-indigo-50/50 transition-all cursor-pointer group block">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {isInvestor ? <Briefcase size={24} /> : <Upload size={24} />}
              </div>
              <h4 className="text-sm font-bold text-gray-900">
                {isInvestor ? 'Upload new deal document' : 'Click to upload a new file'}
              </h4>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
            </label>

            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isInvestor ? "Search deals..." : "Search by filename..."} 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-gray-100 rounded-xl max-h-[300px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {isInvestor ? 'Deal Name' : 'Document Name'}
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{doc.size} • {doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(doc.status)}</td>
                      <td className="px-4 py-4 text-xs text-gray-500 font-medium">{doc.date}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-sm border border-transparent hover:border-gray-100 transition-all">
                            <Download size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm border border-transparent hover:border-gray-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                        No {isInvestor ? 'deals' : 'documents'} found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer - Role-based Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">
              Close
            </button>
            <button 
              onClick={() => alert(isInvestor ? "Investment commitment sent!" : "Signature request sent!")}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
            >
              {isInvestor ? 'Confirm Deal' : 'Request Signature'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};