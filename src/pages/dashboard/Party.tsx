import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import AddPartyModal from './party/AddPartyModal';
import AddEditCustomerModal from './party/AddEditCustomerModal';
import AddEditVendorModal from './party/AddEditVendorModal';
import AddEditReferrerModal from './party/AddEditReferrerModal';
import AddEditLabourModal from './party/AddEditLabourModal'; 
import PartyTable from './party/PartyTable';
import CustomerTable from './party/CustomerTable';
import VendorTable from './party/VendorTable';
import ReferrerTable from './party/ReferrerTable';
import LabourTable from './party/LabourTable';
import AttendanceTable from './party/AttendanceTable';
 
import {
  Party, AddPartyFormData,
  Customer, AddEditCustomerFormData,
  Vendor, AddEditVendorFormData,
  Referrer, AddEditReferrerFormData,
  Labour, AddEditLabourFormData,
  AttendanceRecord
} from '../../components/types/index';
import { useApi, useApiMutation } from "../../hooks/useApi";
import { partyAPI } from "../../services/api";

const PartyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [currentLabourSubTab, setCurrentLabourSubTab] = useState<'labour-list' | 'labour-attendance'>('labour-list');

  // API hooks
  const { data: partiesData, loading, error, refetch } = useApi(() => partyAPI.getParties({ type: activeTab }));
  const { mutate: createParty, loading: createLoading } = useApiMutation(partyAPI.createParty);
  const { mutate: updateParty, loading: updateLoading } = useApiMutation(partyAPI.updateParty);
  const { mutate: deleteParty } = useApiMutation(partyAPI.deleteParty);

  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingReferrer, setEditingReferrer] = useState<Referrer | null>(null);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
 
  // Transform API data based on active tab
  const transformPartyData = (parties) => {
    if (!parties) return [];
    
    return parties.map((party, index) => {
      const baseData = {
        id: party._id || party.id,
        name: party.name,
        phoneNumber: party.contact.mobile,
        address: party.contact.address?.street || party.fullAddress || '',
      };

      if (activeTab === 'customer') {
        return {
          ...baseData,
          customerName: party.name,
          gstNumber: party.business?.gstNumber || '',
          payLimit: party.financial?.creditLimit || 0,
          payLimitDays: party.financial?.creditDays || 0,
        };
      } else if (activeTab === 'vendor') {
        return {
          ...baseData,
          vendorNameCode: party.name,
          gstNo: party.business?.gstNumber || '',
          purchaseTotal: 0, // This would come from purchase aggregation
          paidTotal: 0,
          balance: party.financial?.currentBalance || 0,
          account: party.vendorDetails?.bankDetails ? 
            `${party.vendorDetails.bankDetails.accountName}, ${party.vendorDetails.bankDetails.bankName}` : '',
        };
      } else if (activeTab === 'referrer') {
        return {
          ...baseData,
          referrerName: party.name,
          gstNumber: party.business?.gstNumber || '',
          commissionPoints: party.referrerDetails?.commissionPoints || 0,
          yearlyPoints: party.referrerDetails?.yearlyPoints || 0,
          totalPoints: (party.referrerDetails?.commissionPoints || 0) + (party.referrerDetails?.yearlyPoints || 0),
          balanceCommissionPoints: party.referrerDetails?.commissionPoints || 0,
          balanceYearlyPoints: party.referrerDetails?.yearlyPoints || 0,
          balanceTotalPoints: (party.referrerDetails?.commissionPoints || 0) + (party.referrerDetails?.yearlyPoints || 0),
        };
      }
      
      return baseData;
    });
  };

  const customers = transformPartyData(partiesData?.data?.parties);
  const vendors = transformPartyData(partiesData?.data?.parties);
  const referrers = transformPartyData(partiesData?.data?.parties);

  const [labours, setLabours] = useState<Labour[]>([
    { id: '01', labourName: 'Saravanan', phoneNumber: '8765445678', monthlyIncome: 20000, address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016' },
  ]);

  const [parties, setParties] = useState<Party[]>([
    { id: 'CUST-001', name: 'Rahul Sharma', type: 'Customer', phone: '+91 9876543210', email: 'rahul@example.com', balance: '₹0.00', status: 'Active' },
    { id: 'SUP-001', name: 'ABC Suppliers', type: 'Supplier', phone: '+91 9123456789', email: 'abc@example.com', balance: '₹5000.00', status: 'Active' },
    { id: 'CUST-002', name: 'Priya Singh', type: 'Customer', phone: '+91 8765432109', email: 'priya@example.com', balance: '₹-200.00', status: 'Inactive' },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '01', labourName: 'Saravanan', date: '11 Aug 2025', attendance: 'Present', clockIn: '09:00', clockOut: '18:00',
      last7DaysStatus: ['present', 'present', 'absent', 'present', 'present', 'present', 'present']
    },
    {
      id: '02', labourName: 'Ravanan', date: '11 Aug 2025', attendance: 'Present', clockIn: '09:00', clockOut: '18:00',
      last7DaysStatus: ['present', 'present', 'present', 'present', 'present', 'present', 'present']
    },
    {
      id: '03', labourName: 'Ravi', date: '11 Aug 2025', attendance: 'Absent', clockIn: '00:00', clockOut: '00:00',
      last7DaysStatus: ['absent', 'present', 'absent', 'present', 'present', 'present', 'present']
    },
    {
      id: '04', labourName: 'Ravi', date: '11 Aug 2025', attendance: 'Present', clockIn: '09:00', clockOut: '18:00',
      last7DaysStatus: ['present', 'present', 'present', 'present', 'present', 'present', 'present']
    },
  ]);
 
  const [attendanceSelectedDate, setAttendanceSelectedDate] = useState('11 Aug 2025');
  const [attendanceSelectedMonth, setAttendanceSelectedMonth] = useState('11 Aug 2025'); 

  const handleAddClick = () => {
    setEditingCustomer(null);
    setEditingVendor(null);
    setEditingReferrer(null);
    setEditingLabour(null);
    setEditingParty(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsAddEditModalOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsAddEditModalOpen(true);
  };

  const handleEditReferrer = (referrer: Referrer) => {
    setEditingReferrer(referrer);
    setIsAddEditModalOpen(true);
  };

  const handleEditLabour = (labour: Labour) => {
    setEditingLabour(labour);
    setIsAddEditModalOpen(true);
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setIsAddEditModalOpen(true);
  }

  const handleSubmitCustomer = (formData: AddEditCustomerFormData) => {
    const partyData = {
      name: formData.customerName,
      type: 'customer',
      contact: {
        mobile: formData.mobileNumber,
        address: { street: formData.address }
      },
      business: {
        gstNumber: formData.gstNumber
      },
      financial: {
        creditLimit: formData.creditLimitAmount,
        creditDays: formData.creditLimitDays
      }
    };

    const submitParty = async () => {
      try {
        if (editingCustomer) {
          await updateParty(editingCustomer.id, partyData);
        } else {
          await createParty(partyData);
        }
        refetch();
        setIsAddEditModalOpen(false);
        setEditingCustomer(null);
      } catch (error) {
        console.error('Error saving customer:', error);
      }
    };
    
    submitParty();
  };

  // Refetch data when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center text-red-600 p-8">
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
    }
  };

  const handleSubmitVendor = (formData: AddEditVendorFormData) => {
    if (editingVendor) {
      setVendors(prev => prev.map(v => v.id === editingVendor.id ? {
        ...v,
        vendorNameCode: formData.vendorName,
        gstNo: formData.gst,
        phoneNumber: formData.mobileNumber,
        address: formData.address,
        account: `${formData.accountName}, ${formData.accountBankName}, ${formData.accountNumber}, ${formData.accountIfscCode}`,
      } : v));
    } else {
      const newId = (vendors.length + 1).toString().padStart(2, '0');
      setVendors(prev => [...prev, {
        id: newId,
        vendorNameCode: formData.vendorName,
        gstNo: formData.gst,
        phoneNumber: formData.mobileNumber,
        address: formData.address,
        purchaseTotal: 0, paidTotal: 0, balance: 0,
        account: `${formData.accountName}, ${formData.accountBankName}, ${formData.accountNumber}, ${formData.accountIfscCode}`,
      }]);
    }
    setIsAddEditModalOpen(false);
    setEditingVendor(null);
  };

  const handleSubmitReferrer = (formData: AddEditReferrerFormData) => {
    if (editingReferrer) {
      setReferrers(prev => prev.map(r => r.id === editingReferrer.id ? {
        ...r,
        referrerName: formData.referrerName,
        phoneNumber: formData.mobileNumber,
        address: formData.address,
        commissionPoints: r.commissionPoints,
        yearlyPoints: r.yearlyPoints,
        totalPoints: r.totalPoints,
        balanceCommissionPoints: r.balanceCommissionPoints,
        balanceYearlyPoints: r.balanceYearlyPoints,
        balanceTotalPoints: r.balanceTotalPoints,
      } : r));
    } else {
      const newId = (referrers.length + 1).toString().padStart(2, '0');
      setReferrers(prev => [...prev, {
        id: newId,
        referrerName: formData.referrerName,
        phoneNumber: formData.mobileNumber,
        gstNumber: '',
        address: formData.address,
        commissionPoints: 0, yearlyPoints: 0, totalPoints: 0,
        balanceCommissionPoints: 0, balanceYearlyPoints: 0, balanceTotalPoints: 0,
      }]);
    }
    setIsAddEditModalOpen(false);
    setEditingReferrer(null);
  };

  const handleSubmitLabour = (formData: AddEditLabourFormData) => {
    if (editingLabour) {
      setLabours(prev => prev.map(l => l.id === editingLabour.id ? {
        ...l,
        labourName: formData.labourName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        monthlyIncome: formData.monthlyIncome,
      } : l));
    } else {
      const newId = (labours.length + 1).toString().padStart(2, '0');
      setLabours(prev => [...prev, {
        id: newId,
        labourName: formData.labourName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        monthlyIncome: formData.monthlyIncome,
      }]);
    }
    setIsAddEditModalOpen(false);
    setEditingLabour(null);
  };

  const handleSubmitParty = (formData: AddPartyFormData) => {
    const newId = `PARTY-${(parties.length + 1).toString().padStart(3, '0')}`;
    setParties(prev => [...prev, {
      id: newId,
      name: formData.partyName,
      type: formData.partyType,
      phone: formData.mobileNumber,
      email: formData.email,
      balance: `₹${formData.openingBalance.toFixed(2)}`,
      status: 'Active'
    }]);
    setIsAddEditModalOpen(false);
    setEditingParty(null);
  };
 
  const handleAttendanceDateChange = (date: string) => {
    setAttendanceSelectedDate(date);
  };

  const handleAttendanceMonthChange = (month: string) => {
    setAttendanceSelectedMonth(month);
  };

  const handleAttendanceNavigateDate = (direction: 'prev' | 'next') => { 
    const currentDate = new Date(attendanceSelectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setAttendanceSelectedDate(currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4"> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4 gap-4">
         <div className="flex-grow flex space-x-4 overflow-x-auto">
          {['customer', 'vendor', 'referrer', 'labour'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab  
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                if (tab === 'labour') {
                  setActiveTab('labour');
                  setCurrentLabourSubTab('labour-list'); 
                } else {
                  setActiveTab(tab);
                }
                setSearchTerm(''); 
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div> 
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search"
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute inset-y-0 right-0 px-3 bg-black text-white rounded-r-md flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            <Plus size={20} />
          </button>
        </div>
      </div> 
      {activeTab === 'customer' && (
        <CustomerTable
          customers={customers}
          onEditCustomer={handleEditCustomer}
          searchTerm={searchTerm}
        />
      )}
      {activeTab === 'vendor' && (
        <VendorTable
          vendors={vendors}
          onEditVendor={handleEditVendor}
          searchTerm={searchTerm}
        />
      )}
      {activeTab === 'referrer' && (
        <ReferrerTable
          referrers={referrers}
          onEditReferrer={handleEditReferrer}
          searchTerm={searchTerm}
        />
      )}
 
      {activeTab === 'labour' && (
        <>
          <div className="flex justify-start mb-4">
            <button
              onClick={() => setCurrentLabourSubTab('labour-list')}
              className={`px-4 py-2 rounded-md ${currentLabourSubTab === 'labour-list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Labour List
            </button>
            <button
              onClick={() => setCurrentLabourSubTab('labour-attendance')}
              className={`ml-3 px-4 py-2 rounded-md ${currentLabourSubTab === 'labour-attendance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Attendance
            </button>
          </div>
          {currentLabourSubTab === 'labour-list' ? (
            <LabourTable
              labours={labours}
              onEditLabour={handleEditLabour}
              searchTerm={searchTerm}
            />
          ) : (
            <AttendanceTable
              attendanceRecords={attendanceRecords}
              searchTerm={searchTerm}
              selectedDate={attendanceSelectedDate}
              selectedMonth={attendanceSelectedMonth}
              onDateChange={handleAttendanceDateChange}
              onMonthChange={handleAttendanceMonthChange}
              onNavigateDate={handleAttendanceNavigateDate}
            />
          )}
        </>
      )} 
      {isAddEditModalOpen && activeTab === 'customer' && (
        <AddEditCustomerModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSubmit={handleSubmitCustomer}
          editingCustomer={editingCustomer}
        />
      )}
      {isAddEditModalOpen && activeTab === 'vendor' && (
        <AddEditVendorModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSubmit={handleSubmitVendor}
          editingVendor={editingVendor}
        />
      )}
      {isAddEditModalOpen && activeTab === 'referrer' && (
        <AddEditReferrerModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSubmit={handleSubmitReferrer}
          editingReferrer={editingReferrer}
        />
      )}
      {isAddEditModalOpen && activeTab === 'labour' && (
        <AddEditLabourModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSubmit={handleSubmitLabour}
          editingLabour={editingLabour}
        />
      )}
    </div>
  );
};

export default PartyManagement;