import React from "react";
import clsx from "clsx";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  valueClassName?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  className,
  valueClassName,
}) => {
  return (
    <div className={clsx("bg-white p-4 rounded-lg shadow-sm", className)}>
      <h3 className="text-gray-700 font-medium">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-1">({subtitle})</p>}
      <p className={clsx("text-2xl font-semibold mt-2", valueClassName)}>
        {value}
      </p>
    </div>
  );
};

export default DashboardCard;