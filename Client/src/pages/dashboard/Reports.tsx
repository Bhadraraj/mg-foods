import React, { useState } from 'react';
import ReportNavigation from './reports/ReportNavigation';  
import GstReport from './reports/GstReport';
import RecipeReport from './reports/RecipeReport';
import BrandReport from './reports/BrandReport';
import ProductReport from './reports/ProductReport';
import HsnReport from './reports/HsnReport';
import CreditorsReport from './reports/CreditorsReport';
import DebtorsReport from './reports/DebtorsReport';
import StockReport from './reports/StockReport';
import LabourReport from './reports/LabourReport';
import SalesSummaryReport from './reports/SalesSummaryReport';
import KotSupportReport from './reports/KotSupportReport';
import TaxReport from './reports/TaxReport';
import CashBookReport from './reports/CashBookReport';
import BankReport from './reports/BankReport';
import TradePlReport from './reports/TradePlReport';
import TrialBalanceReport from './reports/TrialBalanceReport';
import BalanceSheetReport from './reports/BalanceSheetReport';
import DiscountReport from './reports/DiscountReport';
import SalesRoundOffReport from './reports/SalesRoundOffReport';
import PurchaseRoundOffReport from './reports/PurchaseRoundOffReport';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('gst'); 
  const gstReportData = [
    {
      no: 1,
      billNo: 'MGGST20250501001',
      billDate: '2025-05-02 16:26:17',
      customerName: 'Customer01',
      gstNo: '33BSAPC0157K1Z7',
      gst5: { sAmt: 0, tax: 0 },
      gst12: { sAmt: 0, tax: 0 },
      gst18: { sAmt: 0, tax: 0 },
      igst: { sAmt: 0, tax: 0 }
    },
    {
      no: 2,
      billNo: 'MGGST20250501002',
      billDate: '2025-05-03 10:00:00',
      customerName: 'Customer02',
      gstNo: '33ABCDE1234F1Z1',
      gst5: { sAmt: 100, tax: 5 },
      gst12: { sAmt: 0, tax: 0 },
      gst18: { sAmt: 0, tax: 0 },
      igst: { sAmt: 0, tax: 0 }
    },
  ];

  const recipeData = [
    {
      no: '01',
      date: '12 Aug 2025',
      totalManufacturingPrice: '₹ 18,202',
      totalSellingPrice: '₹ 28,207',
      status: 'Profit'
    },
    {
      no: '02',
      date: '13 Aug 2025',
      totalManufacturingPrice: '₹ 5,000',
      totalSellingPrice: '₹ 8,000',
      status: 'Profit'
    },
  ];

  const brandData = [
    {
      brand: 'Brand01',
      total: 170,
      onRequest: 0,
      unApproved: 0,
      verifiedProduct: 170,
      availOnLive: 170
    },
    {
      brand: 'Brand02',
      total: 80,
      onRequest: 5,
      unApproved: 2,
      verifiedProduct: 73,
      availOnLive: 70
    },
  ];

  const productData = [
    {
      slNo: '01',
      category: 'Category01',
      productName: 'Product01',
      mrp: '₹ 200',
      salesCount: 302,
      totalSalesPrice: '₹ 60,400'
    },
    {
      slNo: '02',
      category: 'Category02',
      productName: 'Product02',
      mrp: '₹ 150',
      salesCount: 150,
      totalSalesPrice: '₹ 22,500'
    },
  ];

  const hsnData = [
    {
      no: '01',
      hsnCode: '878787KBJ',
      cgst25: { sAmt: '00', tax: '00' },
      cgst06: { sAmt: '00', tax: '00' },
      cgst09: { sAmt: '00', tax: '00' },
      purchase1: '₹ 85,000',
      purchase2: '₹ 15,000',
      sales: '',
      closingBalance: '₹ 1,00000'
    },
    {
      no: '02',
      hsnCode: '123456XYZ',
      cgst25: { sAmt: '500', tax: '25' },
      cgst06: { sAmt: '00', tax: '00' },
      cgst09: { sAmt: '00', tax: '00' },
      purchase1: '₹ 20,000',
      purchase2: '₹ 5,000',
      sales: '₹ 2,000',
      closingBalance: '₹ 23,000'
    },
  ];

  const creditorsData = [
    {
      no: '01',
      vendor: 'Eskay Traders(Vendor)',
      gstNo: '33AAWFB1838P1ZT',
      address: '73-B, West Masi Street, Madurai-625001',
      openingBalance: '₹ 11,03,360.00',
      credit: '₹ 1,38,685.00',
      debit: '₹ 1,38,685.00',
      closingBalance: '₹ 9,42,045.00'
    },
    {
      no: '02',
      vendor: 'Vendor B',
      gstNo: '33ABCDE1234F1Z1',
      address: '10 Main Road, Chennai-600001',
      openingBalance: '₹ 50,000.00',
      credit: '₹ 10,000.00',
      debit: '₹ 5,000.00',
      closingBalance: '₹ 55,000.00'
    }
  ];

  const debtorsData = [
    {
      no: '01',
      customerName: 'NAVEEN',
      contact: 'SM(6379517048)',
      gstNo: '33AAWFB1838P1ZT',
      openingBalance: '₹ 11,03,360.00',
      credit: '₹ 1,38,685.00',
      debit: '₹ 1,38,685.00',
      closingBalance: '₹ 9,42,045.00'
    },
    {
      no: '02',
      customerName: 'RUBAN',
      contact: 'CONTACT(9843399656)',
      gstNo: '33CHSPM5689L1ZC',
      openingBalance: '₹ 11,03,360.00',
      credit: '₹ 1,38,685.00',
      debit: '₹ 1,38,685.00',
      closingBalance: '₹ 9,42,045.00'
    }
  ];

  const stockReportData = [
    {
      no: '01',
      productName: 'Product A',
      category: 'Category 1',
      currentStock: 150,
      minStock: 50,
      maxStock: 500,
      value: '₹ 45,000'
    },
    {
      no: '02',
      productName: 'Product B',
      category: 'Category 2',
      currentStock: 75,
      minStock: 20,
      maxStock: 200,
      value: '₹ 15,000'
    }
  ];

  const labourReportData = [
    {
      no: '01',
      employeeName: 'John Doe',
      date: '12 Aug 2025',
      hoursWorked: 8,
      rate: '₹ 500',
      totalAmount: '₹ 4,000'
    },
    {
      no: '02',
      employeeName: 'Jane Smith',
      date: '12 Aug 2025',
      hoursWorked: 7,
      rate: '₹ 600',
      totalAmount: '₹ 4,200'
    }
  ];

  const salesSummaryData = [
    {
      no: '01',
      date: '12 Aug 2025',
      totalSales: '₹ 25,000',
      totalOrders: 15,
      avgOrderValue: '₹ 1,667'
    },
    {
      no: '02',
      date: '13 Aug 2025',
      totalSales: '₹ 30,000',
      totalOrders: 20,
      avgOrderValue: '₹ 1,500'
    }
  ];

  const kotSupportData = [
    {
      no: '01',
      kotNo: 'KOT001',
      table: 'Table 5',
      items: 'Biriyani, Chicken Curry',
      status: 'Completed',
      time: '12:30 PM'
    },
    {
      no: '02',
      kotNo: 'KOT002',
      table: 'Table 2',
      items: 'Dosa, Idli',
      status: 'Pending',
      time: '01:00 PM'
    }
  ];

  const taxReportData = [
    {
      no: '01',
      period: 'Aug 2025',
      totalTax: '₹ 5,500',
      cgst: '₹ 2,750',
      sgst: '₹ 2,750',
      igst: '₹ 0'
    },
    {
      no: '02',
      period: 'Sept 2025',
      totalTax: '₹ 6,000',
      cgst: '₹ 3,000',
      sgst: '₹ 3,000',
      igst: '₹ 0'
    }
  ];

  const cashBookData = [
    {
      no: '01',
      date: '12 Aug 2025',
      particular: 'Cash Sales',
      debit: '₹ 15,000',
      credit: '',
      balance: '₹ 25,000'
    },
    {
      no: '02',
      date: '12 Aug 2025',
      particular: 'Rent Paid',
      debit: '',
      credit: '₹ 5,000',
      balance: '₹ 20,000'
    }
  ];

  const bankReportData = [
    {
      no: '01',
      date: '12 Aug 2025',
      particular: 'Online Payment',
      debit: '₹ 10,000',
      credit: '',
      balance: '₹ 50,000'
    },
    {
      no: '02',
      date: '13 Aug 2025',
      particular: 'Withdrawal',
      debit: '',
      credit: '₹ 2,000',
      balance: '₹ 48,000'
    }
  ];

  const tradePLData = [
    {
      particular: 'Sales',
      amount: '₹ 1,50,000'
    },
    {
      particular: 'Cost of Goods Sold',
      amount: '₹ 90,000'
    },
    {
      particular: 'Gross Profit',
      amount: '₹ 60,000'
    }
  ];

  const trialBalanceData = [
    {
      particular: 'Cash',
      debit: '₹ 25,000',
      credit: ''
    },
    {
      particular: 'Sales',
      debit: '',
      credit: '₹ 1,50,000'
    },
    {
      particular: 'Purchases',
      debit: '₹ 90,000',
      credit: ''
    }
  ];

  const balanceSheetData = [
    {
      particular: 'Current Assets',
      amount: '₹ 2,50,000'
    },
    {
      particular: 'Current Liabilities',
      amount: '₹ 1,00,000'
    },
    {
      particular: 'Owner\'s Equity',
      amount: '₹ 1,50,000'
    }
  ];

  const discountData = [
    {
      no: '01',
      billNo: 'INV001',
      customer: 'Customer A',
      discountAmount: '₹ 500',
      discountPercent: '5%'
    },
    {
      no: '02',
      billNo: 'INV002',
      customer: 'Customer B',
      discountAmount: '₹ 200',
      discountPercent: '10%'
    }
  ];

  const salesRoundOffData = [
    {
      no: '01',
      billNo: 'INV001',
      originalAmount: '₹ 1,234.67',
      roundedAmount: '₹ 1,235.00',
      roundOff: '₹ 0.33'
    },
    {
      no: '02',
      billNo: 'INV002',
      originalAmount: '₹ 567.21',
      roundedAmount: '₹ 567.00',
      roundOff: '-₹ 0.21'
    }
  ];

  const purchaseRoundOffData = [
    {
      no: '01',
      billNo: 'PUR001',
      originalAmount: '₹ 2,345.78',
      roundedAmount: '₹ 2,346.00',
      roundOff: '₹ 0.22'
    },
    {
      no: '02',
      billNo: 'PUR002',
      originalAmount: '₹ 890.12',
      roundedAmount: '₹ 890.00',
      roundOff: '-₹ 0.12'
    }
  ]; 
  const renderContent = () => {
    switch (activeTab) {
      case 'gst':
        return <GstReport gstReportData={gstReportData} />;
      case 'recipe':
        return <RecipeReport recipeData={recipeData} />;
      case 'brand':
        return <BrandReport brandData={brandData} />;
      case 'product':
        return <ProductReport productData={productData} />;
      case 'hsn':
        return <HsnReport hsnData={hsnData} />;
      case 'creditors':
        return <CreditorsReport creditorsData={creditorsData} />;
      case 'debtors':
        return <DebtorsReport debtorsData={debtorsData} />;
      case 'stock-report':
        return <StockReport stockReportData={stockReportData} />;
      case 'labour-report':
        return <LabourReport labourReportData={labourReportData} />;
      case 'sales-summary':
        return <SalesSummaryReport salesSummaryData={salesSummaryData} />;
      case 'kot-support':
        return <KotSupportReport kotSupportData={kotSupportData} />;
      case 'tax-report':
        return <TaxReport taxReportData={taxReportData} />;
      case 'cash-book':
        return <CashBookReport cashBookData={cashBookData} />;
      case 'bank-report':
        return <BankReport bankReportData={bankReportData} />;
      case 'trade-pl':
        return <TradePlReport tradePLData={tradePLData} />;
      case 'trial-balance':
        return <TrialBalanceReport trialBalanceData={trialBalanceData} />;
      case 'balance-sheet':
        return <BalanceSheetReport balanceSheetData={balanceSheetData} />;
      case 'discount':
        return <DiscountReport discountData={discountData} />;
      case 'sales-round-off':
        return <SalesRoundOffReport salesRoundOffData={salesRoundOffData} />;
      case 'purchase-round-off':
        return <PurchaseRoundOffReport purchaseRoundOffData={purchaseRoundOffData} />;
      default:
        return <div className="p-4 text-gray-600">Select a report from the tabs above to view its content.</div>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <ReportNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="bg-white">
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;