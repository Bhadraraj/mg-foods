import React from "react";
import { Table } from "../../../types";
import { TableCard } from "../../cards";

interface TableGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
  onSplitTable?: (parentTable: Table) => void;
  onDeleteTable?: (table: Table) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ 
  tables, 
  onTableClick, 
  onSplitTable,
  onDeleteTable 
}) => {
  const orderedTables = React.useMemo(() => {
    const groups: { [key: string]: Table[] } = {};
    const mainTables: Table[] = [];
    const result: Array<{ table: Table; isChild: boolean; parentName?: string }> = [];
    
    tables.forEach(table => {
      if (table.name.includes('-')) {
        const parentName = table.name.split('-')[0];
        if (!groups[parentName]) {
          groups[parentName] = [];
        }
        groups[parentName].push(table);
      } else {
        mainTables.push(table);
      }
    });
    
    Object.keys(groups).forEach(parentName => {
      groups[parentName].sort((a, b) => {
        const aNum = parseInt(a.name.split('-')[1] || '0');
        const bNum = parseInt(b.name.split('-')[1] || '0');
        return aNum - bNum;
      });
    });
    
    mainTables.forEach(table => {
      result.push({ table, isChild: false });
      
      if (groups[table.name]) {
        groups[table.name].forEach(childTable => {
          result.push({ 
            table: childTable, 
            isChild: true, 
            parentName: table.name 
          });
        });
      }
    });
    
    return result;
  }, [tables]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {orderedTables.map(({ table, isChild, parentName }) => (
        <div key={table.id} className={isChild ? "ml-4" : ""}>
          <TableCard
            table={table}
            onClick={onTableClick}
            onSplitTable={!isChild ? onSplitTable : undefined}
            onDeleteTable={isChild ? onDeleteTable : undefined}
            isChildTable={isChild}
            parentTableName={parentName}
          />
        </div>
      ))}
    </div>
  );
};

export default TableGrid;