// app/admin/users/page.tsx

'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/app/layout/AppLayout';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Building,
  Clock,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  UserCog,
  Key,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';

// ===== TYPE DEFINITIONS =====
type UserRole = 'admin' | 'hod' | 'employee';
type UserStatus = 'active' | 'suspended' | 'pending';
type UserDepartment = 'IT Architecture' | 'Human Resources' | 'Finance' | 'Logistics' | 'Marketing' | 'Operations' | 'Unassigned';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  status: UserStatus;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  phone?: string;
  location?: string;
}

interface CreateUserFormData {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  department: UserDepartment;
  location: string;
  temporaryPassword: string;
}

interface EditUserFormData {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  department: UserDepartment;
  location: string;
  status: UserStatus;
}

// ===== MOCK DATA =====
const MOCK_USERS: User[] = [
  {
    id: '1',
    fullName: 'Dr. Sarah Taylor',
    email: 's.taylor@mendocompany.com',
    role: 'admin',
    department: 'IT Architecture',
    status: 'active',
    avatar: 'ST',
    joinedDate: '2024-01-01',
    lastActive: '2026-03-18',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
  },
  {
    id: '2',
    fullName: 'John Doe',
    email: 'john.doe@mendocompany.com',
    role: 'employee',
    department: 'IT Architecture',
    status: 'active',
    avatar: 'JD',
    joinedDate: '2024-01-15',
    lastActive: '2026-03-17',
    phone: '+1 (555) 234-5678',
    location: 'Boston, USA',
  },
  {
    id: '3',
    fullName: 'Alice Smith',
    email: 'alice.smith@mendocompany.com',
    role: 'hod',
    department: 'Human Resources',
    status: 'active',
    avatar: 'AS',
    joinedDate: '2024-02-01',
    lastActive: '2026-03-18',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
  },
  {
    id: '4',
    fullName: 'Robert Johnson',
    email: 'robert.johnson@mendocompany.com',
    role: 'employee',
    department: 'Finance',
    status: 'active',
    avatar: 'RJ',
    joinedDate: '2024-03-10',
    lastActive: '2026-03-16',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, USA',
  },
  {
    id: '5',
    fullName: 'Maria Garcia',
    email: 'maria.garcia@mendocompany.com',
    role: 'employee',
    department: 'Logistics',
    status: 'suspended',
    avatar: 'MG',
    joinedDate: '2024-04-05',
    lastActive: '2026-03-10',
    phone: '+1 (555) 567-8901',
    location: 'Miami, USA',
  },
  {
    id: '6',
    fullName: 'James Wilson',
    email: 'james.wilson@mendocompany.com',
    role: 'employee',
    department: 'Marketing',
    status: 'pending',
    avatar: 'JW',
    joinedDate: '2024-05-20',
    lastActive: '2026-03-17',
    phone: '+1 (555) 678-9012',
    location: 'Austin, USA',
  },
];

// ===== MAIN COMPONENT =====
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [formData, setFormData] = useState<CreateUserFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'employee',
    department: 'Unassigned',
    location: '',
    temporaryPassword: '',
  });

  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'employee',
    department: 'Unassigned',
    location: '',
    status: 'active',
  });

  // ===== DERIVED STATE =====
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ===== STATS =====
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  // ===== HELPERS =====
  const getRoleBadge = (role: UserRole) => ({
    admin: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Shield size={14} className="mr-1" />, label: 'Admin' },
    hod: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <UserCog size={14} className="mr-1" />, label: 'HOD' },
    employee: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Users size={14} className="mr-1" />, label: 'Employee' },
  }[role]);

  const getStatusBadge = (status: UserStatus) => ({
    active: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} className="mr-1" />, label: 'Active' },
    suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertCircle size={14} className="mr-1" />, label: 'Suspended' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={14} className="mr-1" />, label: 'Pending' },
  }[status]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  // ===== CREATE HANDLERS =====
  const openCreateModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 'employee',
      department: 'Unassigned',
      location: '',
      temporaryPassword: '',
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'active',
      avatar: formData.fullName.split(' ').map(n => n[0]).join(''),
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      phone: formData.phone,
      location: formData.location || 'Unassigned',
    };
    setUsers([newUser, ...users]);
    showSuccess(`User ${newUser.fullName} created successfully!`);
    closeCreateModal();
  };

  // ===== EDIT HANDLERS =====
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department,
      location: user.location || '',
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          fullName: editFormData.fullName,
          email: editFormData.email,
          role: editFormData.role,
          department: editFormData.department,
          status: editFormData.status,
          phone: editFormData.phone,
          location: editFormData.location || 'Unassigned',
          avatar: editFormData.fullName.split(' ').map(n => n[0]).join(''),
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    showSuccess(`User ${editFormData.fullName} updated successfully!`);
    closeEditModal();
  };

  // ===== DELETE HANDLERS =====
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(users.filter(user => user.id !== userToDelete.id));
    showSuccess(`User ${userToDelete.fullName} deleted successfully`);
    closeDeleteModal();
  };

  // ===== STATUS TOGGLE =====
  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'suspended' : user.status === 'suspended' ? 'active' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    });
    setUsers(updatedUsers);
    const user = users.find(u => u.id === userId);
    if (user) {
      showSuccess(`${user.fullName} ${user.status === 'active' ? 'suspended' : 'activated'} successfully`);
    }
  };

  // ===== RENDER =====
  return (
    <AppLayout
      pageTitle="User Management"
      pageSubtitle="Manage user accounts, roles, and permissions across your organization"
      showCreateButton={true}
      onCreateClick={openCreateModal}
      createButtonText="Create User"
    >
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Total Users</p>
              <p className="text-3xl font-bold text-[#1F2937] mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-[#263A81]/10 rounded-lg">
              <Users size={24} className="text-[#263A81]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-600">● {activeUsers} Active</span>
            <span className="flex items-center gap-1 text-red-600">● {suspendedUsers} Suspended</span>
            <span className="flex items-center gap-1 text-yellow-600">● {pendingUsers} Pending</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Active Now</p>
              <p className="text-3xl font-bold text-[#1F2937] mt-1">12</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-[#6B7280]">Users currently online</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Departments</p>
              <p className="text-3xl font-bold text-[#1F2937] mt-1">6</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-[#6B7280]">Across all departments</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Admin Users</p>
              <p className="text-3xl font-bold text-[#1F2937] mt-1">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-[#6B7280]">System administrators</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-[#263A81]" />
              <h2 className="text-xl font-bold text-[#1F2937]">All Users</h2>
              <span className="text-sm text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">
                {filteredUsers.length} users
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-52 h-10 pl-10 pr-4 rounded-lg border border-[#E5E7EB] bg-[#FEFEFC] text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                />
              </div>
              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full sm:w-36 h-10 px-4 rounded-lg border border-[#E5E7EB] bg-[#FEFEFC] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="hod">HOD</option>
                <option value="employee">Employee</option>
              </select>
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-36 h-10 px-4 rounded-lg border border-[#E5E7EB] bg-[#FEFEFC] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
              {/* Create User Button (Desktop) */}
              <button
                onClick={openCreateModal}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#263A81] text-white font-medium rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 shadow-lg shadow-[#263A81]/20"
              >
                <UserPlus size={18} />
                <span>Create User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">User</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Role</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Department</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Status</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Joined</th>
                <th className="text-right py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-3">
                      <Users size={56} className="text-[#6B7280] opacity-30" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                      <button
                        onClick={openCreateModal}
                        className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-[#263A81] text-white font-medium rounded-lg hover:bg-[#1e2f6a] transition"
                      >
                        <UserPlus size={18} />
                        Create your first user
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleConfig = getRoleBadge(user.role);
                  const statusConfig = getStatusBadge(user.status);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition duration-150">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#263A81]/10 flex items-center justify-center text-[#263A81] font-semibold text-sm flex-shrink-0">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="text-[#1F2937] font-medium">{user.fullName}</div>
                            <div className="text-xs text-[#6B7280] flex items-center gap-1">
                              <Mail size={12} />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleConfig.bg} ${roleConfig.text}`}>
                          {roleConfig.icon}
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-1.5">
                          <Building size={14} className="text-[#6B7280]" />
                          <span className="text-[#1F2937]">{user.department}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-[#6B7280] text-xs">
                        {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition"
                            title="Edit user"
                          >
                            <Edit size={16} className="text-blue-500 hover:text-blue-700" />
                          </button>
                          {/* Status Toggle Button */}
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                          >
                            {user.status === 'active' ? (
                              <UserX size={16} className="text-red-400 hover:text-red-600" />
                            ) : (
                              <UserCheck size={16} className="text-green-400 hover:text-green-600" />
                            )}
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition"
                            title="Delete user"
                          >
                            <Trash2 size={16} className="text-red-400 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Create Button */}
        <div className="p-4 border-t border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
          <div className="text-xs text-[#6B7280]">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#263A81] text-white font-medium rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 shadow-lg shadow-[#263A81]/20 lg:hidden"
          >
            <UserPlus size={18} />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* ===== CREATE USER MODAL ===== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <UserPlus size={24} className="text-[#263A81]" />
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">Create New User</h2>
                  <p className="text-sm text-[#6B7280]">Add a new user to your organization</p>
                </div>
              </div>
              <button
                onClick={closeCreateModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="user@company.com"
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="City, Country"
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="hod">Head of Department</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="IT Architecture">IT Architecture</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="temporaryPassword" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                  Temporary Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="temporaryPassword"
                    name="temporaryPassword"
                    value={formData.temporaryPassword}
                    onChange={handleFormChange}
                    placeholder="Set a temporary password"
                    className="w-full h-11 pl-10 pr-12 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-[#6B7280]">User will be prompted to change this on first login</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT USER MODAL ===== */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Edit size={24} className="text-[#263A81]" />
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">Edit User</h2>
                  <p className="text-sm text-[#6B7280]">Update user information for {selectedUser.fullName}</p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-fullName" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-fullName"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleEditFormChange}
                    placeholder="Enter full name"
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      placeholder="user@company.com"
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="edit-location" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    id="edit-location"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditFormChange}
                    placeholder="City, Country"
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="hod">Head of Department</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-department" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-department"
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditFormChange}
                    className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="IT Architecture">IT Architecture</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                  Account Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  required
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-[#1F2937]">Delete User</h2>
              </div>
              <p className="text-[#6B7280] mb-2">
                Are you sure you want to delete <span className="font-semibold text-[#1F2937]">{userToDelete.fullName}</span>?
              </p>
              <p className="text-sm text-[#6B7280] mb-6">This action cannot be undone. All associated data will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </AppLayout>
  );
};

export default UsersPage;