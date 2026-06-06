import React from 'react';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

const DocumentChamber: React.FC = () => {
  const documents = [
    { id: 1, name: 'Partnership_Agreement.pdf', type: 'Legal', size: '1.2 MB', date: '2026-03-25' },
    { id: 2, name: 'Project_Roadmap_Q2.pdf', type: 'Planning', size: '2.5 MB', date: '2026-03-28' },
    { id: 3, name: 'Budget_Allocation.xlsx', type: 'Finance', size: '850 KB', date: '2026-04-01' },
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
        <p className="text-gray-600">Access and manage all collaboration assets</p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search documents..." startAdornment={<Search size={18} />} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* List of Documents */}
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:border-primary-300 transition-all cursor-pointer shadow-sm">
            <CardBody className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                    {doc.type} • {doc.size} • {doc.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button title="View" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Eye size={20} />
                </button>
                <button title="Download" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Download size={20} />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentChamber;