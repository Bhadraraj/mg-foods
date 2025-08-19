// components/RoleManagement.tsx
import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useRoleManagement } from "../hooks/useManagement";
import RoleTable from "./RoleTable";
import AddEditRoleModal from "./AddEditRoleModal";
import { Role, AddRoleFormData } from "../../../components/types";

const RoleManagement: React.FC = () => {
  const {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    toggleRoleStatus,
  } = useRoleManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleAddRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: AddRoleFormData) => {
    let success = false;
    
    if (editingRole) {
      success = await updateRole(editingRole.no, formData);
    } else {
      success = await createRole(formData);
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleSearch = () => {
    fetchRoles({
      search: searchTerm,
      status: filterStatus !== "All" ? filterStatus : undefined,
    });
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.roleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || role.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <button
          onClick={handleAddRole}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Search */}
          <div className="flex-1 flex items-center">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Roles Table */}
      {!loading && !error && (
        <RoleTable
          roles={filteredRoles}
          onEditRole={handleEditRole}
        />
      )}

      {/* Add/Edit Modal */}
      <AddEditRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingRole={editingRole}
      />
    </div>
  );
};

export default RoleManagement;