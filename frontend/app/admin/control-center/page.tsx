'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import {
  Users, User, Plus, Edit, Mail, Building, Shield, UserPlus, UserCog,
  Key, CheckCircle, AlertCircle, Search, UserCheck, Database, Clock,
  Users as UsersIcon, CheckSquare, X, UserPlusIcon, Briefcase
} from 'lucide-react';

// ===== TYPE DEFINITIONS =====
type UserRole = 'admin' | 'hod' | 'employee';
type UserStatus = 'active' | 'suspended';
type UserDepartment = 'IT Architecture' | 'Human Resources' | 'Finance' | 'Logistics' | 'Unassigned';

interface UserAccount {
  id: string; fullName: string; email: string; role: UserRole;
  department: UserDepartment; status: UserStatus; avatar: string;
  joinedDate: string; lastActive: string;
}

interface FormData {
  fullName: string; email: string; temporaryPassword: string;
  role: UserRole; department: UserDepartment;
}

interface EditFormData {
  fullName: string; email: string; role: UserRole;
  department: UserDepartment; passwordOverride: string;
}

interface CreateOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}
// ===== MOCK DATA =====
const MOCK_USERS: UserAccount[] = [
  { id: '1', fullName: 'Dr. Sarah Taylor', email: 's.taylor@mendocompany.com', role: 'admin', department: 'IT Architecture', status: 'active', avatar: 'ST', joinedDate: '2024-01-01', lastActive: '2026-03-18' },
  { id: '2', fullName: 'John Doe', email: 'john.doe@mendocompany.com', role: 'employee', department: 'IT Architecture', status: 'active', avatar: 'JD', joinedDate: '2024-01-15', lastActive: '2026-03-17' },
  { id: '3', fullName: 'Alice Smith', email: 'alice.smith@mendocompany.com', role: 'hod', department: 'Human Resources', status: 'active', avatar: 'AS', joinedDate: '2024-02-01', lastActive: '2026-03-18' },
  { id: '4', fullName: 'Robert Johnson', email: 'robert.johnson@mendocompany.com', role: 'employee', department: 'Finance', status: 'active', avatar: 'RJ', joinedDate: '2024-03-10', lastActive: '2026-03-16' },
  { id: '5', fullName: 'Maria Garcia', email: 'maria.garcia@mendocompany.com', role: 'employee', department: 'Logistics', status: 'suspended', avatar: 'MG', joinedDate: '2024-04-05', lastActive: '2026-03-10' },
  { id: '6', fullName: 'James Wilson', email: 'james.wilson@mendocompany.com', role: 'employee', department: 'IT Architecture', status: 'active', avatar: 'JW', joinedDate: '2024-05-20', lastActive: '2026-03-17' },
];

// ===== MAIN COMPONENT =====
const AdminControlCenterPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', temporaryPassword: '', role: 'employee', department: 'Unassigned'
  });
  const [editFormData, setEditFormData] = useState<EditFormData>({
    fullName: '', email: '', role: 'employee', department: 'Unassigned', passwordOverride: ''
  });

  // ===== STATS =====
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const departments = ['IT Architecture', 'Human Resources', 'Finance', 'Logistics', 'Unassigned'];
  const totalDepartments = departments.filter(d => users.some(u => u.department === d)).length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const hodCount = users.filter(u => u.role === 'hod').length;
  const employeeCount = users.filter(u => u.role === 'employee').length;

  // ===== HELPERS =====
  const getRoleBadge = (role: UserRole) => ({
    admin: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Shield size={14} className="mr-1" />, label: 'Admin' },
    hod: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <UserCog size={14} className="mr-1" />, label: 'HOD' },
    employee: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <User size={14} className="mr-1" />, label: 'Employee' },
  }[role]);

  const getStatusBadge = (status: UserStatus) => ({
    active: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} className="mr-1" />, label: 'Active' },
    suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertCircle size={14} className="mr-1" />, label: 'Suspended' },
  }[status]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  // ===== HANDLERS =====
  const openCreateModal = () => {
    setFormData({ fullName: '', email: '', temporaryPassword: '', role: 'employee', department: 'Unassigned' });
    setIsCreateModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'active',
      avatar: formData.fullName.split(' ').map(n => n[0]).join(''),
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
    };
    setUsers([newUser, ...users]);
    showSuccess(`User ${newUser.fullName} created successfully!`);
    setIsCreateModalOpen(false);
  };

  const openEditDrawer = (user: UserAccount) => {
    setSelectedUser(user);
    setEditFormData({ fullName: user.fullName, email: user.email, role: user.role, department: user.department, passwordOverride: '' });
    setIsEditDrawerOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...editFormData, avatar: editFormData.fullName.split(' ').map(n => n[0]).join('') } : user));
    showSuccess(`User ${editFormData.fullName} updated successfully!`);
    setIsEditDrawerOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const createOptions: CreateOption[] = [
    { id: 'department', label: 'Department', icon: <Building size={18} />, description: 'Create a new department' },
    { id: 'user', label: 'User', icon: <UserPlusIcon size={18} />, description: 'Add a new user account' },
    { id: 'task', label: 'Task', icon: <CheckSquare size={18} />, description: 'Create a new task' },
    { id: 'project', label: 'Project', icon: <Briefcase size={18} />, description: 'Start a new project' },
  ];

  

  return (
    <AppLayout
      pageTitle="Admin Control Center"
      pageSubtitle="Account Provisioning, Role Allocation, and Master Identity Controls"
      showCreateButton={false}
      onCreateClick={openCreateModal}
      createButtonText="Create User"
    >
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-[#6B7280]">Total Users</p><p className="text-3xl font-bold text-[#1F2937] mt-1">{totalUsers}</p></div>
            <div className="p-3 bg-[#263A81]/10 rounded-lg"><UsersIcon size={24} className="text-[#263A81]" /></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-green-600">● {activeUsers} Active</span>
            <span className="text-red-600">● {suspendedUsers} Suspended</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-[#6B7280]">Departments</p><p className="text-3xl font-bold text-[#1F2937] mt-1">{totalDepartments}</p></div>
            <div className="p-3 bg-blue-100 rounded-lg"><Building size={24} className="text-blue-600" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-[#6B7280]">Role Distribution</p><p className="text-3xl font-bold text-[#1F2937] mt-1">{totalUsers}</p></div>
            <div className="p-3 bg-purple-100 rounded-lg"><Shield size={24} className="text-purple-600" /></div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Admin: {adminCount}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>HOD: {hodCount}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span>Emp: {employeeCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-[#6B7280]">Total Tasks</p><p className="text-3xl font-bold text-[#1F2937] mt-1">28</p></div>
            <div className="p-3 bg-green-100 rounded-lg"><CheckSquare size={24} className="text-green-600" /></div>
          </div>
        </div>
      </div>

      {/* User Registry Table */}
      <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database size={24} className="text-[#263A81]" />
            <h2 className="text-xl font-bold text-[#1F2937]">User Registry</h2>
            <span className="text-sm text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">{users.length} users</span>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            <input type="text" placeholder="Search registry..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-64 h-10 pl-10 pr-4 rounded-lg border border-[#E5E7EB] bg-[#FEFEFC] text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">User Details</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Assigned Role</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Department</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Status</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredUsers.map((user) => {
                const roleConfig = getRoleBadge(user.role);
                const statusConfig = getStatusBadge(user.status);
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition duration-150">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#263A81]/10 flex items-center justify-center text-[#263A81] font-semibold flex-shrink-0">{user.avatar}</div>
                        <div><div className="text-[#1F2937] font-medium">{user.fullName}</div><div className="text-xs text-[#6B7280] flex items-center gap-1"><Mail size={12} /><span>{user.email}</span></div></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${roleConfig.bg} ${roleConfig.text}`}>
                        {roleConfig.icon}{roleConfig.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-6"><div className="flex items-center gap-1.5"><Building size={14} className="text-[#6B7280]" /><span className="text-[#1F2937]">{user.department}</span></div></td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.icon}{statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <button onClick={() => openEditDrawer(user)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#263A81]/10 text-[#263A81] hover:bg-[#263A81]/20 rounded-lg transition font-medium text-xs">
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Drawer */}
      {isEditDrawerOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between z-10">
              <div><h2 className="text-xl font-bold text-[#1F2937]">Edit User Profile</h2><p className="text-sm text-[#6B7280]">Managing: {selectedUser.fullName}</p></div>
              <button onClick={() => setIsEditDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X size={24} className="text-[#6B7280]" /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="fullName" value={editFormData.fullName} onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Corporate Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                  <input type="email" name="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#D1D5DB] bg-white" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Assigned Role <span className="text-red-500">*</span></label>
                  <select name="role" value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value as UserRole})} className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white" required>
                    <option value="employee">Employee</option><option value="hod">HOD</option><option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Department <span className="text-red-500">*</span></label>
                  <select name="department" value={editFormData.department} onChange={(e) => setEditFormData({...editFormData, department: e.target.value as UserDepartment})} className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white" required>
                    <option value="Unassigned">Unassigned</option><option value="IT Architecture">IT Architecture</option><option value="Human Resources">Human Resources</option><option value="Finance">Finance</option><option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button type="button" onClick={() => setIsEditDrawerOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </AppLayout>
  );
};

export default AdminControlCenterPage;