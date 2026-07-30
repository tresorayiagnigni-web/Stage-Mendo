'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CheckSquare,
  Users,
  User,
  LogOut,
  Bell,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Trash2,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCircle,
  UserX,
  Eye,
  Search,
  Filter,
  Building,
  Award,
  FileText,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
interface Employee {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  employeeId: string;
  dateJoined: string;
  activeTasks: number;
  completedTasks: number;
  recentTasks: RecentTask[];
}

interface RecentTask {
  id: string;
  title: string;
  assignedDate: string;
  status: 'completed' | 'in-progress' | 'pending';
}

// ========== MOCK DATA ==========
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@mendocompany.com',
    jobTitle: 'Senior Software Engineer',
    department: 'IT Architecture',
    employeeId: 'EMP-2024-001',
    dateJoined: '2024-01-15',
    activeTasks: 3,
    completedTasks: 12,
    recentTasks: [
      {
        id: 't1',
        title: 'Q2 Performance Review Preparation',
        assignedDate: '2026-03-10',
        status: 'in-progress',
      },
      {
        id: 't2',
        title: 'Update Employee Handbook',
        assignedDate: '2026-03-05',
        status: 'completed',
      },
      {
        id: 't3',
        title: 'API Integration Testing',
        assignedDate: '2026-02-28',
        status: 'completed',
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@mendocompany.com',
    jobTitle: 'IT Security Analyst',
    department: 'IT Architecture',
    employeeId: 'EMP-2024-002',
    dateJoined: '2024-02-01',
    activeTasks: 2,
    completedTasks: 8,
    recentTasks: [
      {
        id: 't4',
        title: 'IT Infrastructure Security Audit',
        assignedDate: '2026-03-12',
        status: 'in-progress',
      },
      {
        id: 't5',
        title: 'Security Policy Review',
        assignedDate: '2026-03-08',
        status: 'completed',
      },
    ],
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@mendocompany.com',
    jobTitle: 'DevOps Engineer',
    department: 'IT Architecture',
    employeeId: 'EMP-2024-003',
    dateJoined: '2024-03-10',
    activeTasks: 4,
    completedTasks: 6,
    recentTasks: [
      {
        id: 't6',
        title: 'Employee Onboarding Documentation',
        assignedDate: '2026-03-14',
        status: 'completed',
      },
      {
        id: 't7',
        title: 'CI/CD Pipeline Optimization',
        assignedDate: '2026-03-11',
        status: 'in-progress',
      },
    ],
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@mendocompany.com',
    jobTitle: 'Cloud Solutions Architect',
    department: 'IT Architecture',
    employeeId: 'EMP-2024-004',
    dateJoined: '2024-04-05',
    activeTasks: 3,
    completedTasks: 15,
    recentTasks: [
      {
        id: 't8',
        title: 'Department Budget Review',
        assignedDate: '2026-03-13',
        status: 'in-progress',
      },
      {
        id: 't9',
        title: 'Cloud Migration Strategy',
        assignedDate: '2026-03-06',
        status: 'completed',
      },
    ],
  },
  {
    id: '5',
    name: 'James Rodriguez',
    email: 'james.rodriguez@mendocompany.com',
    jobTitle: 'Network Administrator',
    department: 'IT Architecture',
    employeeId: 'EMP-2024-005',
    dateJoined: '2024-05-20',
    activeTasks: 2,
    completedTasks: 4,
    recentTasks: [
      {
        id: 't10',
        title: 'Team Building Workshop Planning',
        assignedDate: '2026-03-15',
        status: 'pending',
      },
      {
        id: 't11',
        title: 'Network Infrastructure Upgrade',
        assignedDate: '2026-03-09',
        status: 'completed',
      },
    ],
  },
  {
    id: '6',
    name: 'Anna Kim',
    email: 'anna.kim@mendocompany.com',
    jobTitle: 'Software Developer',
    department: 'IT Architecture',
    employeeId: 'EMP-2024-006',
    dateJoined: '2024-06-01',
    activeTasks: 1,
    completedTasks: 3,
    recentTasks: [
      {
        id: 't12',
        title: 'Software License Renewal',
        assignedDate: '2026-03-16',
        status: 'in-progress',
      },
    ],
  },
];

// ========== MAIN COMPONENT ==========
const HODTeamRosterPage: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // ========== STATE MANAGEMENT ==========
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);
  const [confirmationInput, setConfirmationInput] = useState<string>('');

  // ========== DERIVED STATE ==========
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ========== HELPER FUNCTIONS ==========
  const getNavItemClasses = (targetPath: string) => {
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer w-full';
    const activeClasses = 'bg-white/10 text-white font-medium';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/10';
    const isActive = pathname === targetPath;
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getStatusBadge = (status: RecentTask['status']) => {
    const config = {
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Completed',
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Clock size={14} className="mr-1" />,
        label: 'In Progress',
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertCircle size={14} className="mr-1" />,
        label: 'Pending',
      },
    };
    return config[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openProfileDrawer = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsProfileDrawerOpen(true);
  };

  const closeProfileDrawer = () => {
    setIsProfileDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const openRemoveModal = (employee: Employee) => {
    setEmployeeToRemove(employee);
    setConfirmationInput('');
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setEmployeeToRemove(null);
    setConfirmationInput('');
  };

  const handleRemoveEmployee = () => {
    if (!employeeToRemove) return;
    if (confirmationInput !== employeeToRemove.name && confirmationInput !== 'CONFIRM') return;
    
    setEmployees(employees.filter(emp => emp.id !== employeeToRemove.id));
    closeRemoveModal();
  };

  // ========== JSX RENDER ==========
  return (
    <div className="min-h-screen bg-[#FEFEFC] font-sans antialiased flex relative">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] flex-shrink-0 bg-[#263A81] text-white h-screen fixed top-0 left-0 overflow-y-auto z-30">
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl font-bold tracking-tight">MENDO HR</div>
          <div className="text-xs font-light opacity-70 mt-1">
            Head of Department
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/hod/dashboard" className={getNavItemClasses('/hod/dashboard')}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/hod/task-manager" className={getNavItemClasses('/hod/task-manager')}>
            <CheckSquare size={20} />
            <span>Task Manager</span>
          </Link>
          <Link href="/hod/team-roster" className={getNavItemClasses('/hod/team-roster')}>
            <Users size={20} />
            <span>Team Roster</span>
            {pathname === '/hod/team-roster' && <ChevronRight size={16} className="ml-auto" />}
          </Link>
          <Link href="/hod/profile" className={getNavItemClasses('/hod/profile')}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen w-full">
        {/* ===== TOP HEADER ===== */}
        <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20 w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <Menu size={24} className="text-[#1F2937]" />
            </button>
            <div className="flex items-center gap-2">
              <Briefcase size={24} className="text-[#263A81] md:hidden" />
              <span className="text-xl font-bold text-[#263A81] hidden md:inline">
                MENDO HR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} className="text-[#6B7280]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
              <div className="w-10 h-10 rounded-full bg-[#263A81] flex items-center justify-center text-white font-semibold flex-shrink-0">
                ST
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-sm font-medium text-[#1F2937] truncate">Dr. Sarah Taylor</div>
                <div className="text-xs text-[#6B7280] truncate">Head of IT Architecture</div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== MOBILE MENU OVERLAY ===== */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={toggleMobileMenu}
            />
            <div className="absolute left-0 top-0 h-full w-[280px] bg-[#263A81] text-white p-6 shadow-xl animate-slide-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-2xl font-bold tracking-tight">MENDO HR</div>
                  <div className="text-xs font-light opacity-70 mt-1">
                    Head of Department
                  </div>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-2">
                <Link href="/hod/dashboard" className={getNavItemClasses('/hod/dashboard')} onClick={toggleMobileMenu}>
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link href="/hod/task-manager" className={getNavItemClasses('/hod/task-manager')} onClick={toggleMobileMenu}>
                  <CheckSquare size={20} />
                  <span>Task Manager</span>
                </Link>
                <Link href="/hod/team-roster" className={getNavItemClasses('/hod/team-roster')} onClick={toggleMobileMenu}>
                  <Users size={20} />
                  <span>Team Roster</span>
                </Link>
                <Link href="/hod/profile" className={getNavItemClasses('/hod/profile')} onClick={toggleMobileMenu}>
                  <User size={20} />
                  <span>Profile</span>
                </Link>
              </nav>

              <div className="absolute bottom-6 left-6 right-6 border-t border-white/10 pt-4">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===== TEAM ROSTER CONTENT ===== */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full box-border">
          {/* Administrative Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1F2937]">Departmental Team Roster &amp; Administration</h1>
                <p className="text-[#6B7280] text-sm mt-1">
                  <span className="font-medium text-[#263A81]">Unit Control Scope:</span> IT Architecture Staff Only
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280] bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                <Users size={18} className="text-[#263A81]" />
                <span>Total Staff: <span className="font-semibold text-[#1F2937]">{employees.length}</span></span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E5E7EB] bg-[#FEFEFC] text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-gray-50 transition whitespace-nowrap">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {/* Personnel Directory Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Employee Info</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Job Title</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Workload Metrics</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-[#6B7280]">
                        <div className="flex flex-col items-center gap-2">
                          <Users size={48} className="text-[#6B7280] opacity-30" />
                          <p className="font-medium">No employees found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="hover:bg-gray-50/50 transition duration-150 cursor-pointer"
                        onClick={() => openProfileDrawer(employee)}
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#263A81]/10 flex items-center justify-center text-[#263A81] font-semibold flex-shrink-0">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-[#1F2937] font-medium">{employee.name}</div>
                              <div className="text-xs text-[#6B7280] flex items-center gap-1">
                                <Mail size={12} />
                                <span>{employee.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <Building size={14} className="text-[#6B7280]" />
                            <span className="text-[#1F2937]">{employee.jobTitle}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-[#6B7280]" />
                              <span className="font-medium text-[#1F2937]">{employee.activeTasks}</span>
                              <span className="text-[#6B7280]">active</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle size={14} className="text-green-600" />
                              <span className="font-medium text-[#1F2937]">{employee.completedTasks}</span>
                              <span className="text-[#6B7280]">completed</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProfileDrawer(employee);
                              }}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition text-[#6B7280] hover:text-blue-600"
                              aria-label="View profile"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRemoveModal(employee);
                              }}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition text-[#6B7280] hover:text-red-600"
                              aria-label="Remove employee"
                            >
                              <UserX size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ===== PROFILE SLIDE-OUT DRAWER ===== */}
      {isProfileDrawerOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeProfileDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-[#1F2937]">Employee Profile</h2>
              <button
                onClick={closeProfileDrawer}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close drawer"
              >
                <X size={24} className="text-[#6B7280]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#263A81] flex items-center justify-center text-white text-2xl font-bold">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1F2937]">{selectedEmployee.name}</h3>
                  <p className="text-[#6B7280]">{selectedEmployee.jobTitle}</p>
                  <p className="text-sm text-[#6B7280] flex items-center gap-1">
                    <Mail size={14} />
                    {selectedEmployee.email}
                  </p>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FEFEFC] rounded-xl border border-[#E5E7EB] p-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Departmental ID
                  </label>
                  <p className="text-[#1F2937] font-medium mt-1">{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Date Joined
                  </label>
                  <p className="text-[#1F2937] font-medium mt-1">{formatDate(selectedEmployee.dateJoined)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Total Completed Tasks
                  </label>
                  <p className="text-[#1F2937] font-medium mt-1">{selectedEmployee.completedTasks}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Active Tasks
                  </label>
                  <p className="text-[#1F2937] font-medium mt-1">{selectedEmployee.activeTasks}</p>
                </div>
              </div>

              {/* Recent Task History */}
              <div>
                <h4 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-[#263A81]" />
                  Recent Task History
                </h4>
                <div className="space-y-3">
                  {selectedEmployee.recentTasks.length === 0 ? (
                    <p className="text-[#6B7280] text-sm">No recent tasks assigned.</p>
                  ) : (
                    selectedEmployee.recentTasks.map((task) => {
                      const statusConfig = getStatusBadge(task.status);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 bg-[#FEFEFC] border border-[#E5E7EB] rounded-lg"
                        >
                          <div>
                            <p className="text-[#1F2937] font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-[#6B7280] flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(task.assignedDate)}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== REMOVE EMPLOYEE CONFIRMATION MODAL ===== */}
      {isRemoveModalOpen && employeeToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX size={24} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">Remove Employee Account</h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">This action is irreversible</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">Warning:</span> You are about to remove <strong>{employeeToRemove.name}</strong> from the department.
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  <li>Account access will be immediately revoked</li>
                  <li>All active tasks will be reassigned</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>

              <div>
                <label htmlFor="confirmationInput" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Type the employee&apos;s name or &quot;CONFIRM&quot; to proceed
                </label>
                <input
                  type="text"
                  id="confirmationInput"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="Enter employee name or CONFIRM"
                  className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  autoFocus
                />
                <p className="text-xs text-[#6B7280] mt-1">
                  Type &quot;{employeeToRemove.name}&quot; or &quot;CONFIRM&quot; to unlock removal
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0 border-t border-[#E5E7EB]">
              <button
                onClick={closeRemoveModal}
                className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveEmployee}
                disabled={confirmationInput !== employeeToRemove.name && confirmationInput !== 'CONFIRM'}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== GLOBAL STYLES ===== */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default HODTeamRosterPage;