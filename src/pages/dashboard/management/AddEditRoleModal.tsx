import React, { useState, useEffect } from "react";
import { AddRoleFormData, Role, ScreenPermission } from "../../../components/types/index";

interface AddEditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddRoleFormData) => void;
  editingRole?: Role | null;
}

const AddEditRoleModal: React.FC<AddEditRoleModalProps> = ({ isOpen, onClose, onSubmit, editingRole }) => {
  const [formData, setFormData] = useState<AddRoleFormData>({
    roleName: "",
    permissions: {
      fullAccess: false,
      sales: false,
      kot: false,
      inventory: false,
      management: false,
      reports: false,
      expense: false,
      pos: false,
      dashboard: false,
      purchase: false,
      offer: false,
      item: false,
      approval: false,
      recipe: false,
      party: false,
    },
    dashboardFeatures: {
      overviewBox: false,
      paymentReminders: false,
      payables: false,
      recentTransaction: false,
      receivables: false,
      onlineOrders: false,
    },
  });

  const [activePermissionTab, setActivePermissionTab] = useState("Dashboard");

  useEffect(() => {
    if (editingRole) {
      const permissions: { [key: string]: boolean } = {};
      editingRole.screens.forEach(screen => {
        const key = screen.name.replace(/\s+/g, '')[0].toLowerCase() + screen.name.replace(/\s+/g, '').slice(1);
        if (formData.permissions.hasOwnProperty(key)) {
            permissions[key] = true;
        }
      });

      const dashboardFeatures: { [key: string]: boolean } = {};
      if (editingRole.screens.some(screen => screen.name === 'Overview Box')) dashboardFeatures.overviewBox = true;
      if (editingRole.screens.some(screen => screen.name === 'Payment Reminders')) dashboardFeatures.paymentReminders = true;
      if (editingRole.screens.some(screen => screen.name === 'Payables')) dashboardFeatures.payables = true;
      if (editingRole.screens.some(screen => screen.name === 'Recent Transaction')) dashboardFeatures.recentTransaction = true;
      if (editingRole.screens.some(screen => screen.name === 'Receivables')) dashboardFeatures.receivables = true;
      if (editingRole.screens.some(screen => screen.name === 'Online Orders')) dashboardFeatures.onlineOrders = true;


      setFormData({
        roleName: editingRole.roleName,
        permissions: {
            ...formData.permissions,
            ...permissions,
        },
        dashboardFeatures: {
            ...formData.dashboardFeatures,
            ...dashboardFeatures,
        }
      });
    } else {
      setFormData({
        roleName: "",
        permissions: {
          fullAccess: false,
          sales: false,
          kot: false,
          inventory: false,
          management: false,
          reports: false,
          expense: false,
          pos: false,
          dashboard: false,
          purchase: false,
          offer: false,
          item: false,
          approval: false,
          recipe: false,
          party: false,
        },
        dashboardFeatures: {
          overviewBox: false,
          paymentReminders: false,
          payables: false,
          recentTransaction: false,
          receivables: false,
          onlineOrders: false,
        },
      });
    }
  }, [isOpen, editingRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name in formData.permissions) {
        setFormData((prev) => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            [name]: checked,
          },
        }));
      } else if (name in formData.dashboardFeatures) {
        setFormData((prev) => ({
          ...prev,
          dashboardFeatures: {
            ...prev.dashboardFeatures,
            [name]: checked,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const permissionOptions = [
    { name: "Full Access", key: "fullAccess" },
    { name: "Sales", key: "sales" },
    { name: "KOT", key: "kot" },
    { name: "Inventory", key: "inventory" },
    { name: "Management", key: "management" },
    { name: "Reports", key: "reports" },
    { name: "Expense", key: "expense" },
    { name: "POS", key: "pos" },
  ];

  const secondaryPermissionOptions = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Purchase", key: "purchase" },
    { name: "Offer", key: "offer" },
    { name: "Item", key: "item" },
    { name: "Approval", key: "approval" },
    { name: "Recipe", key: "recipe" },
    { name: "Party", key: "party" },
  ];

  const dashboardFeatureOptions = [
    { name: "Overview Box", key: "overviewBox" },
    { name: "Payment Reminders", key: "paymentReminders" },
    { name: "Payables", key: "payables" },
    { name: "Recent Transaction", key: "recentTransaction" },
    { name: "Receivables", key: "receivables" },
    { name: "Online Orders", key: "onlineOrders" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{editingRole ? "Edit Role" : "Add New Role"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="roleName" className="block text-gray-700 font-medium mb-2">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Role Name"
              required
            />
          </div>

          <div className="mb-4">
            <h3 className="block text-gray-700 font-medium mb-2">Screen Permission</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/3">
                <div className="border border-gray-300 rounded-md p-4">
                  {permissionOptions.map((option) => (
                    <div key={option.key} className="flex items-center justify-between mb-2">
                      <label htmlFor={option.key} className="text-gray-700 cursor-pointer">
                        {option.name}
                      </label>
                      <input
                        type="checkbox"
                        id={option.key}
                        name={option.key}
                        checked={formData.permissions[option.key as keyof AddRoleFormData['permissions']]}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full sm:w-1/3">
                <div className="border border-gray-300 rounded-md p-4 mb-4">
                  {secondaryPermissionOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setActivePermissionTab(option.name)}
                      className={`w-full text-left p-2 mb-2 rounded-md ${
                        activePermissionTab === option.name ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column Dashboard Features */}
              {activePermissionTab === "Dashboard" && (
                <div className="w-full sm:w-1/3">
                  <div className="border border-gray-300 rounded-md p-4">
                    <h4 className="font-semibold mb-3">Dashboard - Features</h4>
                    {dashboardFeatureOptions.map((option) => (
                      <div key={option.key} className="flex items-center justify-between mb-2">
                        <label htmlFor={option.key} className="text-gray-700 cursor-pointer">
                          {option.name}
                        </label>
                        <input
                          type="checkbox"
                          id={option.key}
                          name={option.key}
                          checked={formData.dashboardFeatures[option.key as keyof AddRoleFormData['dashboardFeatures']]}
                          onChange={handleChange}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingRole ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditRoleModal;