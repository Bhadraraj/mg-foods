import React from 'react';

interface ReceivableCardProps {
  title: string;
  subtitle: string;
  amount: string;
  progressPercent: number;
  progressColor: string;
  currentAmount: string;
  overdueAmount: string;
}

const ReceivableCard: React.FC<ReceivableCardProps> = ({
  title,
  subtitle,
  amount,
  progressPercent,
  progressColor,
  currentAmount,
  overdueAmount
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-gray-700 font-medium">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{subtitle} {amount}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
        <div 
          className={`h-2.5 rounded-full ${progressColor}`} 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-sm text-blue-600 font-medium">Current</p>
          <p className="font-semibold">{currentAmount}</p>
        </div>
        <div>
          <p className="text-sm text-red-600 font-medium">Overdue</p>
          <p className="font-semibold">{overdueAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceivableCard;