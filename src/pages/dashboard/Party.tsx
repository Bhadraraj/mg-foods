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
} from '../../types/index';

const PartyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [currentLabourSubTab, setCurrentLabourSubTab] = useState<'labour-list' | 'labour-attendance'>('labour-list');

  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingReferrer, setEditingReferrer] = useState<Referrer | null>(null);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
 
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '01', customerName: 'Ravikumar', phoneNumber: '9994435640', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'VELLALAR THERKUTHERU VADASERY' },
    { id: '02', customerName: 'V WILLIAM', phoneNumber: '9994435640', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'MARAVAN KUDIERUPPU' },
    { id: '03', customerName: 'BABU', phoneNumber: '9955555540', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'KOTTAR NAGERCOIL' },
    { id: '04', customerName: 'DREAM SHOP ARUN', phoneNumber: '9923436440', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'CHETTIKULAM' },
    { id: '05', customerName: 'V MURUGAN', phoneNumber: '9523445640', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'SOORANKUDI NAGERCOIL' },
    { id: '06', customerName: 'GONZHA', phoneNumber: '9994435640', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'PUNNAR KULAM' },
    { id: '07', customerName: 'BUBA WOOD WORK', phoneNumber: '9994435640', gstNumber: 'UH7567977GFD87', payLimit: 0, payLimitDays: 0, address: 'ERULAPPAPURAM' },
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: '00', vendorNameCode: 'Bhavani Hardware', gstNo: 'UH7567977GFD87', phoneNumber: '9443163195', address: '73-B, West Masi Street, Madurai-625 001', purchaseTotal: 10342245.31, paidTotal: 5215337, balance: 1275104.31, account: 'Bhavani Hardwares, Tamilnadu Mercantile Bank, Chinthamani, 118509345528224, TMBL000011B' },
    { id: '01', vendorNameCode: 'Sheenloc Paints Limited', gstNo: 'UH7567977GFD87', phoneNumber: '9443163195', address: '73-B, West Masi Street, Madurai-625 001', purchaseTotal: 10342245.31, paidTotal: 5215337, balance: 1275104.31, account: '702, M.S Road, Vadasery, Nagercoil-629001' },
    { id: '02', vendorNameCode: 'Balaji Hardwares', gstNo: 'UH7567977GFD87', phoneNumber: '9443163195', address: '73-B, West Masi Street, Madurai-625 001', purchaseTotal: 10342245.31, paidTotal: 5215337, balance: 1275104.31, account: 'No:40 Sivasakthi Road, Tirunelveli Junction Tiru' },
  ]);

  const [referrers, setReferrers] = useState<Referrer[]>([
    { id: '01', referrerName: 'Ravikumar', phoneNumber: '9994435640', gstNumber: 'UH7567977GFD87', address: 'VELLALAR THERKUTHERU VADASERY', commissionPoints: 0, yearlyPoints: 0, totalPoints: 0, balanceCommissionPoints: 0, balanceYearlyPoints: 0, balanceTotalPoints: 0 },
    { id: '02', referrerName: 'V WILLIAM', phoneNumber: '9994435640', gstNumber: 'UH7567977GFD87', address: 'MARAVAN KUDIERUPPU', commissionPoints: 0, yearlyPoints: 0, totalPoints: 0, balanceCommissionPoints: 0, balanceYearlyPoints: 0, balanceTotalPoints: 0 },
  ]);

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
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? {
        ...c,
        customerName: formData.customerName,
        phoneNumber: formData.mobileNumber,
        gstNumber: formData.gstNumber,
        payLimit: formData.creditLimitAmount,
        payLimitDays: formData.creditLimitDays,
        address: formData.address,
      } : c));
    } else {
      const newId = (customers.length + 1).toString().padStart(2, '0');
      setCustomers(prev => [...prev, {
        id: newId,
        customerName: formData.customerName,
        phoneNumber: formData.mobileNumber,
        gstNumber: formData.gstNumber,
        payLimit: formData.creditLimitAmount,
        payLimitDays: formData.creditLimitDays,
        address: formData.address,
      }]);
    }
    setIsAddEditModalOpen(false);
    setEditingCustomer(null);
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
          onEditCustomer={handleEditCustomer}
          searchTerm={searchTerm}
        />
      )}
      {activeTab === 'vendor' && (
        <VendorTable
          onEditVendor={handleEditVendor}
          
          searchTerm={searchTerm}
        />

      )}
      {activeTab === 'referrer' && (
        <ReferrerTable
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