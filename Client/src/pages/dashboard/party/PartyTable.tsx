import React from 'react';
import { User } from 'lucide-react';
import { Party } from '../../../components/types/';

interface PartyTableProps {
  parties: Party[];
  onEditParty: (party: Party) => void;
  searchTerm: string;
  activeTab: string; 
}

const PartyTable: React.FC<PartyTableProps> = ({ parties, onEditParty, searchTerm, activeTab }) => {

  const filteredParties = parties.filter(party =>
    (activeTab === 'all' || activeTab === party.type.toLowerCase() || activeTab === party.status.toLowerCase()) &&
    (party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     party.phone.includes(searchTerm) ||
     party.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     party.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50"> {/* Changed to bg-blue-50 as per other tables */}
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredParties.map(party => (
            <tr key={party.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                {party.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{party.name}</div>
                    <div className="text-sm text-gray-500">{party.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  party.type === 'Customer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {party.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {party.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {party.balance}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  party.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' // Using red for inactive
                }`}>
                  {party.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                <button onClick={() => onEditParty(party)} className="text-blue-600 hover:text-blue-900">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartyTable;