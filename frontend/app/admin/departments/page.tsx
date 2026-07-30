'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import {
  Users,
  User,
  Briefcase,
  Building,
  Mail,
  UserCog,
  Eye,
  Search,
  Database,
  Activity,
  UserCheck,
  Clock,
  Plus,
  X,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
interface Employee {
  id: string;
  name: string;
  email: string;
  jobRole: string;
  activeTasks: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
  headcount: number;
  hodName: string;
  hodEmail: string;
  hodStatus: 'active' | 'inactive';
  hodActivityCount: number;
  operationalFocus: string;
  employees: Employee[];
}

// ========== MOCK DATA ==========
const MOCK_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'IT Architecture',
    code: 'DEPT-ITA-2026',
    headcount: 12,
    hodName: 'Dr. Sarah Taylor',
    hodEmail: 's.taylor@mendocompany.com',
    hodStatus: 'active',
    hodActivityCount: 47,
    operationalFocus: 'Enterprise infrastructure, cloud solutions, security protocols, and system architecture design.',
    employees: [
      { id: 'e1', name: 'John Doe', email: 'john.doe@mendocompany.com', jobRole: 'Senior Software Engineer', activeTasks: 3 },
      { id: 'e2', name: 'Sarah Chen', email: 'sarah.chen@mendocompany.com', jobRole: 'IT Security Analyst', activeTasks: 2 },
      { id: 'e3', name: 'Michael Brown', email: 'michael.brown@mendocompany.com', jobRole: 'DevOps Engineer', activeTasks: 4 },
      { id: 'e4', name: 'Emma Wilson', email: 'emma.wilson@mendocompany.com', jobRole: 'Cloud Solutions Architect', activeTasks: 3 },
      { id: 'e5', name: 'James Rodriguez', email: 'james.rodriguez@mendocompany.com', jobRole: 'Network Administrator', activeTasks: 2 },
      { id: 'e6', name: 'Anna Kim', email: 'anna.kim@mendocompany.com', jobRole: 'Software Developer', activeTasks: 1 },
    ],
  },
  {
    id: '2',
    name: 'Human Resources',
    code: 'DEPT-HR-2026',
    headcount: 8,
    hodName: 'Alice Smith',
    hodEmail: 'alice.smith@mendocompany.com',
    hodStatus: 'active',
    hodActivityCount: 31,
    operationalFocus: 'Talent acquisition, employee relations, performance management, and organizational development.',
    employees: [
      { id: 'e7', name: 'Robert Johnson', email: 'robert.johnson@mendocompany.com', jobRole: 'HR Generalist', activeTasks: 3 },
      { id: 'e8', name: 'Maria Garcia', email: 'maria.garcia@mendocompany.com', jobRole: 'Recruitment Specialist', activeTasks: 2 },
      { id: 'e9', name: 'David Kim', email: 'david.kim@mendocompany.com', jobRole: 'Employee Relations Manager', activeTasks: 1 },
    ],
  },
  {
    id: '3',
    name: 'Finance',
    code: 'DEPT-FIN-2026',
    headcount: 6,
    hodName: 'Robert Johnson',
    hodEmail: 'robert.johnson@mendocompany.com',
    hodStatus: 'active',
    hodActivityCount: 23,
    operationalFocus: 'Financial planning, budgeting, accounting, payroll, and compliance management.',
    employees: [
      { id: 'e10', name: 'Lisa Thompson', email: 'lisa.thompson@mendocompany.com', jobRole: 'Senior Accountant', activeTasks: 3 },
      { id: 'e11', name: 'Mark Wilson', email: 'mark.wilson@mendocompany.com', jobRole: 'Financial Analyst', activeTasks: 2 },
      { id: 'e12', name: 'Jennifer Lee', email: 'jennifer.lee@mendocompany.com', jobRole: 'Payroll Specialist', activeTasks: 2 },
    ],
  },
  {
    id: '4',
    name: 'Logistics',
    code: 'DEPT-LOG-2026',
    headcount: 5,
    hodName: 'Maria Garcia',
    hodEmail: 'maria.garcia@mendocompany.com',
    hodStatus: 'inactive',
    hodActivityCount: 12,
    operationalFocus: 'Supply chain management, inventory control, distribution, and logistics optimization.',
    employees: [
      { id: 'e13', name: 'Thomas Brown', email: 'thomas.brown@mendocompany.com', jobRole: 'Logistics Coordinator', activeTasks: 2 },
      { id: 'e14', name: 'Patricia Davis', email: 'patricia.davis@mendocompany.com', jobRole: 'Supply Chain Analyst', activeTasks: 1 },
    ],
  },
];

// ========== MAIN COMPONENT ==========
const AdminDepartmentInspectorPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(departments[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hodName: '',
    hodEmail: '',
    operationalFocus: '',
  });

  // ========== DERIVED STATE ==========
  const selectedDepartment = departments.find(d => d.id === selectedDepartmentId);
  const filteredEmployees = selectedDepartment?.employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // ========== HELPER FUNCTIONS ==========
  const getStatusBadge = (status: 'active' | 'inactive') => {
    const config = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <UserCheck size={14} className="mr-1" />,
        label: 'Active',
      },
      inactive: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <Clock size={14} className="mr-1" />,
        label: 'Inactive',
      },
    };
    return config[status];
  };

  const getDepartmentStats = (department: Department) => {
    const totalActiveTasks = department.employees.reduce((sum, emp) => sum + emp.activeTasks, 0);
    return { totalActiveTasks };
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  // ========== CREATE DEPARTMENT HANDLERS ==========
  const openCreateModal = () => {
    setFormData({
      name: '',
      code: '',
      hodName: '',
      hodEmail: '',
      operationalFocus: '',
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDepartment: Department = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code || `DEPT-${formData.name.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}`,
      headcount: 0,
      hodName: formData.hodName,
      hodEmail: formData.hodEmail,
      hodStatus: 'active',
      hodActivityCount: 0,
      operationalFocus: formData.operationalFocus,
      employees: [],
    };

    setDepartments([newDepartment, ...departments]);
    setSelectedDepartmentId(newDepartment.id);
    showSuccess(`Department "${newDepartment.name}" created successfully!`);
    closeCreateModal();
  };

  // ========== JSX RENDER ==========
  return (
    <AppLayout
      pageTitle="Corporate Architecture & Department Inspector"
      pageSubtitle="Macro-to-Micro Company Structure Oversight and Departmental Breakdown Exploration"
      showCreateButton={true}
      onCreateClick={openCreateModal}
      createButtonText="Create Department"
    >
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
          <UserCheck size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      {/* ===== DEPARTMENT MATRIX GRID ===== */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database size={24} className="text-[#263A81]" />
          <h2 className="text-xl font-bold text-[#1F2937]">Department Matrix</h2>
          <span className="text-sm text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">
            {departments.length} departments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => {
            const stats = getDepartmentStats(department);
            const statusConfig = getStatusBadge(department.hodStatus);
            const isSelected = selectedDepartmentId === department.id;

            return (
              <div
                key={department.id}
                className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                  isSelected ? 'border-[#263A81] shadow-lg shadow-[#263A81]/10' : 'border-[#E5E7EB]'
                }`}
                onClick={() => setSelectedDepartmentId(department.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">{department.name}</h3>
                    <p className="text-xs text-[#6B7280] font-mono">{department.code}</p>
                  </div>
                  <div className="p-2 bg-[#263A81]/10 rounded-lg">
                    <Building size={18} className="text-[#263A81]" />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Employees</span>
                    <span className="font-semibold text-[#1F2937]">{department.headcount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Head of Department</span>
                    <span className="font-medium text-[#1F2937]">{department.hodName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">HOD Status</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Active Tasks</span>
                    <span className="font-semibold text-[#1F2937]">{stats.totalActiveTasks}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDepartmentId(department.id);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#263A81]/10 text-[#263A81] hover:bg-[#263A81]/20 rounded-lg transition font-medium text-sm"
                >
                  <Eye size={16} />
                  Inspect Department
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== INTERACTIVE INSPECTOR PANEL ===== */}
      {selectedDepartment && (
        <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-fade-in">
          {/* Selected Department Header */}
          <div className="p-6 border-b border-[#E5E7EB] bg-gradient-to-r from-[#263A81]/5 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <Building size={28} className="text-[#263A81]" />
                  <div>
                    <h2 className="text-2xl font-bold text-[#1F2937]">{selectedDepartment.name}</h2>
                    <p className="text-sm text-[#6B7280]">
                      {selectedDepartment.code} · {selectedDepartment.operationalFocus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                  <Users size={16} className="text-[#263A81]" />
                  <span className="font-medium">{selectedDepartment.headcount}</span>
                  <span className="text-[#6B7280]">employees</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* HOD Activity Spotlight */}
            <div className="bg-[#FEFEFC] rounded-lg border border-[#E5E7EB] p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserCog size={18} className="text-[#263A81]" />
                <h3 className="font-semibold text-[#1F2937]">HOD Activity Spotlight</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#263A81] flex items-center justify-center text-white font-bold text-sm">
                    {selectedDepartment.hodName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-[#1F2937]">{selectedDepartment.hodName}</p>
                    <p className="text-sm text-[#6B7280] truncate max-w-[180px]" title={selectedDepartment.hodEmail}>
                      {selectedDepartment.hodEmail}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Account Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedDepartment.hodStatus).bg} ${getStatusBadge(selectedDepartment.hodStatus).text}`}
                    >
                      {getStatusBadge(selectedDepartment.hodStatus).icon}
                      {getStatusBadge(selectedDepartment.hodStatus).label}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Total Activity Count
                  </label>
                  <p className="text-2xl font-bold text-[#1F2937] mt-1">
                    {selectedDepartment.hodActivityCount}
                  </p>
                  <p className="text-xs text-[#6B7280]">Tasks managed</p>
                </div>
              </div>
            </div>

            {/* Unit Personnel Sub-Table */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#263A81]" />
                  <h3 className="font-semibold text-[#1F2937]">Unit Personnel</h3>
                  <span className="text-sm text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">
                    {selectedDepartment.employees.length}
                  </span>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search personnel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-56 h-9 pl-9 pr-4 rounded-lg border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold tracking-wide">Employee Name</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold tracking-wide">Corporate Email</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold tracking-wide">Job Role</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold tracking-wide">Active Tasks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-[#6B7280]">
                          No personnel found matching your search
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50/50 transition duration-150">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#263A81]/10 flex items-center justify-center text-[#263A81] font-semibold text-xs flex-shrink-0">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium text-[#1F2937] truncate max-w-[120px] md:max-w-[180px]" title={employee.name}>
                                {employee.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#6B7280]">
                            <div className="flex items-center gap-1 min-w-0">
                              <Mail size={14} className="flex-shrink-0" />
                              <span className="truncate max-w-[150px] md:max-w-[200px] block" title={employee.email}>
                                {employee.email}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#1F2937] truncate max-w-[120px] md:max-w-[160px]" title={employee.jobRole}>
                            {employee.jobRole}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 whitespace-nowrap">
                              {employee.activeTasks} {employee.activeTasks === 1 ? 'task' : 'tasks'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== CREATE DEPARTMENT MODAL ===== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <Building size={24} className="text-[#263A81]" />
                <h2 className="text-xl font-bold text-[#1F2937]">Create New Department</h2>
              </div>
              <button
                onClick={closeCreateModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Marketing"
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Department Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="e.g., DEPT-MKT-2026"
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">Leave blank to auto-generate</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Head of Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hodName"
                    value={formData.hodName}
                    onChange={handleFormChange}
                    placeholder="e.g., John Doe"
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    HOD Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="email"
                      name="hodEmail"
                      value={formData.hodEmail}
                      onChange={handleFormChange}
                      placeholder="hod@company.com"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">
                  Operational Focus <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="operationalFocus"
                  value={formData.operationalFocus}
                  onChange={handleFormChange}
                  placeholder="Describe the department's primary focus and responsibilities..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95"
                >
                  <Plus size={18} className="inline mr-2" />
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </AppLayout>
  );
};

export default AdminDepartmentInspectorPage;