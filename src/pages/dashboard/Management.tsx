import React, { useState } from "react";
import UserTable from "./management/UserTable";
import AddUserModal from "./management/AddUserModal";
import RoleTable from "./management/RoleTable";
import AddEditRoleModal from "./management/AddEditRoleModal";
import LabourTable from "./management/LabourTable";
import AddEditLabourModal from "./management/AddEditLabourModal";
import { User, NewUserFormData, Role, AddRoleFormData, Labour, AddLabourFormData, ScreenPermission } from "../../components/types";
import { Plus } from "lucide-react";

const initialUsers: User[] = [
  { no: "01", name: "Sundar", mobile: "6775776558", role: "Admin", store: "All", status: true, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "02", name: "VENI", mobile: "7010396993", role: "Role02", store: "NA", status: true, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "03", name: "USHA", mobile: "9994611220", role: "Role02", store: "NA", status: true, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "04", name: "SUGANYA", mobile: "9629365770", role: "Role02", store: "NA", status: false, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "05", name: "Sudha", mobile: "6775776558", role: "Role02", store: "NA", status: true, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "06", name: "Sheeba Sekar", mobile: "6775776558", role: "Role02", store: "NA", status: false, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "07", name: "SANTHYAG", mobile: "6379517048", role: "Role02", store: "NA", status: true, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
  { no: "08", name: "SANDHIYA", mobile: "8807002085", role: "Role02", store: "NA", status: true, createdBy: "sundar@gmail.com", createdAt: "19 Sept 2022" },
];

const initialRoles: Role[] = [
  { no: "01", roleName: "Admin", screens: [{ name: "Full Access", hasAccess: true }], status: "Active" },
  { no: "02", roleName: "Manager", screens: [{ name: "Sales", hasAccess: true }, { name: "Reports", hasAccess: true }], status: "Active" },
  { no: "03", roleName: "Staff", screens: [{ name: "POS", hasAccess: true }, { name: "KOT", hasAccess: true }], status: "Inactive" },
];

const initialLabours: Labour[] = [
  { no: "01", name: "Kumar", mobile: "9124321345", address: "D-57, Main Road, Brahmpuri", monthlySalary: 16890 },
  { no: "02", name: "Shiva", mobile: "9124321345", address: "D-57, Main Road, Brahmpuri", monthlySalary: 16890 },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("User");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [isAddEditRoleModalOpen, setIsAddEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const [isAddEditLabourModalOpen, setIsAddEditLabourModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
  const [labours, setLabours] = useState<Labour[]>(initialLabours);

  const handleAddUserClick = () => {
    setEditingUser(null);
    setIsAddUserModalOpen(true);
  };

  const handleEditUserClick = (user: User) => {
    setEditingUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleAddUserSubmit = (formData: NewUserFormData) => {
    if (editingUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.no === editingUser.no
            ? {
                ...user,
                name: formData.name,
                mobile: formData.mobile,
                role: formData.role,
                createdBy: formData.email,
              }
            : user
        )
      );
    } else {
      const newUserId = (users.length + 1).toString().padStart(2, "0");
      const newUser: User = {
        no: newUserId,
        name: formData.name,
        mobile: formData.mobile,
        role: formData.role,
        store: "NA",
        status: true,
        createdBy: formData.email,
        createdAt: new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }
    setIsAddUserModalOpen(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.no === userId ? { ...user, status: !user.status } : user
      )
    );
  };

  const handleAddRoleClick = () => {
    setEditingRole(null);
    setIsAddEditRoleModalOpen(true);
  };

  const handleEditRoleClick = (role: Role) => {
    setEditingRole(role);
    setIsAddEditRoleModalOpen(true);
  };

  const handleAddEditRoleSubmit = (formData: AddRoleFormData) => {
    const selectedScreens: ScreenPermission[] = [];
    Object.entries(formData.permissions).forEach(([key, value]) => {
      if (value) {
           const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        selectedScreens.push({ name, hasAccess: true });
      }
    }); 
    Object.entries(formData.dashboardFeatures).forEach(([key, value]) => {
      if (value) {
        const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        selectedScreens.push({ name, hasAccess: true });
      }
    });


    if (editingRole) {
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.no === editingRole.no
            ? {
                ...role,
                roleName: formData.roleName,
                screens: selectedScreens,
                status: "Active", 
              }
            : role
        )
      );
    } else {
      const newRoleNo = (roles.length + 1).toString().padStart(2, "0");
      const newRole: Role = {
        no: newRoleNo,
        roleName: formData.roleName,
        screens: selectedScreens,
        status: "Active", 
      };
      setRoles((prevRoles) => [...prevRoles, newRole]);
    }
    setIsAddEditRoleModalOpen(false);
  };

  const handleAddLabourClick = () => {
    setEditingLabour(null);
    setIsAddEditLabourModalOpen(true);
  };

  const handleEditLabourClick = (labour: Labour) => {
    setEditingLabour(labour);
    setIsAddEditLabourModalOpen(true);
  };

  const handleAddEditLabourSubmit = (formData: AddLabourFormData) => {
    if (editingLabour) {
      setLabours((prevLabours) =>
        prevLabours.map((labour) =>
          labour.no === editingLabour.no
            ? {
                ...labour,
                name: formData.name,
                mobile: formData.mobile,
                address: formData.address,
                monthlySalary: formData.monthlySalary,
              }
            : labour
        )
      );
    } else {
      const newLabourNo = (labours.length + 1).toString().padStart(2, "0");
      const newLabour: Labour = {
        no: newLabourNo,
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        monthlySalary: formData.monthlySalary,
      };
      setLabours((prevLabours) => [...prevLabours, newLabour]);
    }
    setIsAddEditLabourModalOpen(false);
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
          />
        );
      case "Labour":
        return (
          <LabourTable
            labours={labours}
            onEditLabour={handleEditLabourClick}
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
        <div className="container   sm:px-6 lg:px-8">
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

      <div className="container  py-6">
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