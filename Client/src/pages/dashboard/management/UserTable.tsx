import React from "react"; 
import { User } from "../../../components/types/index";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onToggleStatus: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser, onToggleStatus }) => {
  const displayUsers = users;
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By / At</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayUsers.map((user) => (
              <tr key={user.no}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.no}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.mobile}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.store}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  <label htmlFor={`toggle-status-${user.no}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`toggle-status-${user.no}`}
                        className="sr-only"
                        checked={user.status}
                        onChange={() => onToggleStatus(user.no)}
                      />
                      <div className={`block w-10 h-6 rounded-full ${user.status ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${user.status ? 'translate-x-full' : ''}`}></div>
                    </div>
                  </label>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {user.createdBy} <br /> {user.createdAt}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onEditUser(user)} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;