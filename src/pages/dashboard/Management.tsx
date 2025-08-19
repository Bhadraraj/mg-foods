import React, { useState } from "react";
import UserTable from "./management/UserTable";
import AddUserModal from "./management/AddEditUserModal";
import RoleTable from "./management/RoleTable";
import AddEditRoleModal from "./management/AddEditRoleModal";
import LabourTable from "./management/LabourTable";
import AddEditLabourModal from "./management/AddEditLabourModal";
<<<<<<< HEAD
import { User, NewUserFormData, Role, AddRoleFormData, Labour, AddLabourFormData } from "../../types";
import { useUserManagement, useRoleManagement, useLabourManagement } from "../../components/hooks/useManagement";
import { Plus } from "lucide-react";

=======
import { User, NewUserFormData, Role, AddRoleFormData, Labour, AddLabourFormData, ScreenPermission } from "../../types";
import { useUsers } from "../../hooks/useUsers";
import { useLabour } from "../../hooks/useLabour";
import { useUserManagement, useLabourManagement } from "../../components/hooks/useManagement";
import { Plus } from "lucide-react";


const initialRoles: Role[] = [
  { no: "01", roleName: "Admin", screens: [{ name: "Full Access", hasAccess: true }], status: "Active" },
  { no: "02", roleName: "Manager", screens: [{ name: "Sales", hasAccess: true }, { name: "Reports", hasAccess: true }], status: "Active" },
  { no: "03", roleName: "Staff", screens: [{ name: "POS", hasAccess: true }, { name: "KOT", hasAccess: true }], status: "Inactive" },
];


>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("User");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isAddEditRoleModalOpen, setIsAddEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [isAddEditLabourModalOpen, setIsAddEditLabourModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
<<<<<<< HEAD

  // Use API hooks - now all three use actual API calls
  const { users, createUser, updateUser, toggleUserStatus } = useUserManagement();
  const { roles, createRole, updateRole, deleteRole, toggleRoleStatus } = useRoleManagement();
  const { labours, createLabour, updateLabour, deleteLabour } = useLabourManagement();
=======
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447

  // Use API hooks
  const { users, createUser, updateUser, toggleUserStatus } = useUserManagement();
  const { labours, createLabour, updateLabour, deleteLabour } = useLabourManagement();
  const handleAddUserClick = () => {
    setEditingUser(null);
    setIsAddUserModalOpen(true);
  };

  const handleEditUserClick = (user: User) => {
    setEditingUser(user);
    setIsAddUserModalOpen(true);
  };

<<<<<<< HEAD
  const handleAddUserSubmit = async (formData: NewUserFormData) => {
    try {
      if (editingUser) {
        // FIX: Changed from `editingUser._id` to `editingUser.no` to match the expected property
        // on the User type. This assumes your User type has a 'no' property
        // similar to your Role and Labour types.
        await updateUser(editingUser.no, formData);
      } else {
        await createUser(formData);
      }
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
=======
  const handleAddUserSubmit = (formData: NewUserFormData) => {
    if (editingUser) {
      updateUser(editingUser.no, formData);
    } else {
      createUser(formData);
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    }
  };

<<<<<<< HEAD
  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
=======
  const handleToggleUserStatus = (userId: string) => {
    toggleUserStatus(userId);
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
  };

  const handleAddRoleClick = () => {
    setEditingRole(null);
    setIsAddEditRoleModalOpen(true);
  };

  const handleEditRoleClick = (role: Role) => {
    setEditingRole(role);
    setIsAddEditRoleModalOpen(true);
  };

  const handleAddEditRoleSubmit = async (formData: AddRoleFormData) => {
    try {
      if (editingRole) {
        await updateRole(editingRole.no, formData);
      } else {
        await createRole(formData);
      }
      setIsAddEditRoleModalOpen(false);
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId);
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleToggleRoleStatus = async (roleId: string) => {
    try {
      await toggleRoleStatus(roleId);
    } catch (error) {
      console.error('Failed to toggle role status:', error);
    }
  };

  const handleAddLabourClick = () => {
    setEditingLabour(null);
    setIsAddEditLabourModalOpen(true);
  };

  const handleEditLabourClick = (labour: Labour) => {
    setEditingLabour(labour);
    setIsAddEditLabourModalOpen(true);
  };

<<<<<<< HEAD
  const handleAddEditLabourSubmit = async (formData: AddLabourFormData) => {
    try {
      if (editingLabour) {
        await updateLabour(editingLabour.no, formData);
      } else {
        await createLabour(formData);
      }
      setIsAddEditLabourModalOpen(false);
    } catch (error) {
      console.error('Failed to save labour:', error);
    }
  };

  const handleDeleteLabour = async (labourId: string) => {
    try {
      await deleteLabour(labourId);
    } catch (error) {
      console.error('Failed to delete labour:', error);
=======
  const handleAddEditLabourSubmit = (formData: AddLabourFormData) => {
    if (editingLabour) {
      updateLabour(editingLabour.no, formData);
    } else {
      createLabour(formData);
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "User":
        return (
          <UserTable
            users={users}
            onEditUser={handleEditUserClick}
            onToggleStatus={handleToggleUserStatus}
          />
        );
      case "Role":
        return (
          <RoleTable
            roles={roles}
            onEditRole={handleEditRoleClick}
            onDeleteRole={handleDeleteRole}
            onToggleStatus={handleToggleRoleStatus}
          />
        );
      case "Labour":
        return (
          <LabourTable
            labours={labours}
            onEditLabour={handleEditLabourClick}
            onDeleteLabour={handleDeleteLabour}
          />
        );
      default:
        return null;
    }
  };

  const handleAddButtonClick = () => {
    if (activeTab === "User") {
      handleAddUserClick();
    } else if (activeTab === "Role") {
      handleAddRoleClick();
    } else if (activeTab === "Labour") {
      handleAddLabourClick();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container   sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "User"
                    ? "text-blue-600 bg-transparent"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("User")}
              >
                User
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "Role"
                    ? "text-blue-600 bg-transparent"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("Role")}
              >
                Role
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "Labour"
                    ? "text-blue-600 bg-transparent"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("Labour")}
              >
                Labour
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="relative flex-grow sm:flex-grow-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="absolute inset-y-0 right-0 px-3 bg-black text-white rounded-r-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <button
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-500"
                onClick={handleAddButtonClick}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container  py-6">
        {renderContent()}
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUserSubmit}
        editingUser={editingUser}
      />

      <AddEditRoleModal
        isOpen={isAddEditRoleModalOpen}
        onClose={() => setIsAddEditRoleModalOpen(false)}
        onSubmit={handleAddEditRoleSubmit}
        editingRole={editingRole}
      />

      <AddEditLabourModal
        isOpen={isAddEditLabourModalOpen}
        onClose={() => setIsAddEditLabourModalOpen(false)}
        onSubmit={handleAddEditLabourSubmit}
        editingLabour={editingLabour}
      />
    </div>
  );
};

export default Dashboard;
