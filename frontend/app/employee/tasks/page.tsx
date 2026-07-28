'use client';

import React, { useState, useMemo } from 'react';
import {
  Home,
  CheckSquare,
  User,
  LogOut,
  Bell,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  Filter,
  ListChecks,
  Tag,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
type NavItem = 'dashboard' | 'tasks' | 'profile';
type TaskStatus = 'pending' | 'completed';
type TaskPriority = 'high' | 'medium' | 'low';
type FilterType = 'all' | 'pending' | 'completed';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  department: string;
  assignee: string;
}

// ========== MOCK DATA ==========
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Q2 Performance Reviews',
    description: 'Review and submit performance evaluations for all team members in the Engineering department.',
    dueDate: '2026-03-25',
    priority: 'high',
    status: 'pending',
    department: 'Engineering',
    assignee: 'John Doe',
  },
  {
    id: '2',
    title: 'Update Employee Handbook - Remote Work Policy',
    description: 'Revise the remote work policy section to include new guidelines for hybrid work arrangements.',
    dueDate: '2026-03-28',
    priority: 'medium',
    status: 'pending',
    department: 'HR',
    assignee: 'John Doe',
  },
  {
    id: '3',
    title: 'Prepare Monthly HR Analytics Report',
    description: 'Compile and analyze employee attendance, turnover, and engagement metrics for March.',
    dueDate: '2026-04-01',
    priority: 'low',
    status: 'pending',
    department: 'HR',
    assignee: 'John Doe',
  },
  {
    id: '4',
    title: 'Onboard New Engineering Hires',
    description: 'Complete onboarding process for 3 new engineers including IT setup and orientation sessions.',
    dueDate: '2026-03-20',
    priority: 'high',
    status: 'completed',
    department: 'Engineering',
    assignee: 'John Doe',
  },
  {
    id: '5',
    title: 'Implement New Payroll System Integration',
    description: 'Coordinate with IT to integrate the new payroll software with existing HRMS platform.',
    dueDate: '2026-04-15',
    priority: 'medium',
    status: 'pending',
    department: 'IT',
    assignee: 'John Doe',
  },
  {
    id: '6',
    title: 'Team Building Workshop Planning',
    description: 'Organize and plan the Q2 team building workshop for the HR department.',
    dueDate: '2026-03-30',
    priority: 'low',
    status: 'pending',
    department: 'HR',
    assignee: 'John Doe',
  },
];

// ========== MAIN COMPONENT ==========
const EmployeeTasksPage: React.FC = () => {
  // ========== STATE MANAGEMENT ==========
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ========== DERIVED STATE ==========
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filter === 'pending') {
      filtered = filtered.filter(task => task.status === 'pending');
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    return { total, completed, pending };
  }, [tasks]);

  // ========== EVENT HANDLERS ==========
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  // ========== HELPER FUNCTIONS ==========
  const getPriorityConfig = (priority: TaskPriority) => {
    const config = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        icon: <AlertCircle size={14} className="mr-1" />,
        label: 'High',
      },
      medium: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        icon: <Clock size={14} className="mr-1" />,
        label: 'Medium',
      },
      low: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Low',
      },
    };
    return config[priority];
  };

  const getStatusIcon = (status: TaskStatus) => {
    return status === 'completed' ? (
      <CheckCircle size={20} className="text-green-600" />
    ) : (
      <Circle size={20} className="text-[#6B7280]" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const isOverdue = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // ========== RENDER HELPERS ==========
  const getNavItemClasses = (item: NavItem) => {
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer';
    const activeClasses = 'bg-white/10 text-white font-medium';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/10';
    return `${baseClasses} ${item === 'tasks' ? activeClasses : inactiveClasses}`;
  };

  const getFilterButtonClasses = (filterType: FilterType) => {
    const baseClasses =
      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200';
    const activeClasses = 'bg-[#263A81] text-white shadow-lg shadow-[#263A81]/20';
    const inactiveClasses = 'bg-white text-[#1F2937] border border-[#E5E7EB] hover:bg-gray-50';
    return `${baseClasses} ${filter === filterType ? activeClasses : inactiveClasses}`;
  };

  // ========== JSX RENDER ==========
  return (
    <div className="min-h-screen bg-[#FEFEFC] font-sans antialiased flex">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] bg-[#263A81] text-white h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl font-bold tracking-tight">MENDO HR</div>
          <div className="text-xs font-light opacity-70 mt-1">
            Employee Workspace
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/employee/dashboard" className={getNavItemClasses('dashboard')}>
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a href="/employee/tasks" className={getNavItemClasses('tasks')}>
            <CheckSquare size={20} />
            <span>My Tasks</span>
            <ChevronRight size={16} className="ml-auto" />
          </a>
          <a href="/employee/profile" className={getNavItemClasses('profile')}>
            <User size={20} />
            <span>My Profile</span>
          </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <a
            href="/login"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>

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
                  Employee Workspace
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
              <a href="/employee/dashboard" className={getNavItemClasses('dashboard')}>
                <Home size={20} />
                <span>Dashboard</span>
              </a>
              <a href="/employee/tasks" className={getNavItemClasses('tasks')}>
                <CheckSquare size={20} />
                <span>My Tasks</span>
              </a>
              <a href="/employee/profile" className={getNavItemClasses('profile')}>
                <User size={20} />
                <span>My Profile</span>
              </a>
            </nav>

            <div className="absolute bottom-6 left-6 right-6 border-t border-white/10 pt-4">
              <a
                href="/login"
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ===== TOP HEADER ===== */}
        <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
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
              <div className="w-10 h-10 rounded-full bg-[#263A81] flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-[#1F2937]">John Doe</div>
                <div className="text-xs text-[#6B7280]">Software Engineer</div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== TASKS CONTENT ===== */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1F2937]">My Tasks</h1>
                <p className="text-[#6B7280] text-sm mt-1">
                  Manage and track your assigned tasks efficiently.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#263A81] text-white font-medium rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 shadow-lg shadow-[#263A81]/20">
                  <Plus size={18} />
                  New Task
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#6B7280]">Total Tasks</div>
                  <div className="text-2xl font-bold text-[#1F2937] mt-1">{stats.total}</div>
                </div>
                <div className="p-3 bg-[#263A81]/10 rounded-lg">
                  <ListChecks size={24} className="text-[#263A81]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#6B7280]">Pending</div>
                  <div className="text-2xl font-bold text-[#1F2937] mt-1">{stats.pending}</div>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#6B7280]">Completed</div>
                  <div className="text-2xl font-bold text-[#1F2937] mt-1">{stats.completed}</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={getFilterButtonClasses('all')}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => handleFilterChange('pending')}
                  className={getFilterButtonClasses('pending')}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange('completed')}
                  className={getFilterButtonClasses('completed')}
                >
                  Completed
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 h-10 px-4 pr-10 rounded-lg border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                />
                <Filter size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <CheckSquare size={48} className="text-[#6B7280] opacity-30" />
                  <p className="text-[#1F2937] font-medium">No tasks found</p>
                  <p className="text-[#6B7280] text-sm">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : 'All tasks are completed or none match the current filter'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {filteredTasks.map((task) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  const isTaskOverdue = task.status === 'pending' && isOverdue(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 hover:bg-gray-50 transition group ${
                        task.status === 'completed' ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
                          aria-label={`Mark "${task.title}" as ${
                            task.status === 'completed' ? 'pending' : 'completed'
                          }`}
                        >
                          {getStatusIcon(task.status)}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3
                                className={`text-base font-medium ${
                                  task.status === 'completed'
                                    ? 'text-[#6B7280] line-through'
                                    : 'text-[#1F2937]'
                                }`}
                              >
                                {task.title}
                              </h3>
                              <p
                                className={`text-sm mt-1 ${
                                  task.status === 'completed'
                                    ? 'text-[#6B7280] line-through'
                                    : 'text-[#6B7280]'
                                }`}
                              >
                                {task.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <Tag size={12} />
                                  {task.department}
                                </span>
                                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <User size={12} />
                                  {task.assignee}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}
                                >
                                  {priorityConfig.icon}
                                  {priorityConfig.label}
                                </span>
                                {isTaskOverdue && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <AlertCircle size={12} className="mr-1" />
                                    Overdue
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6B7280] whitespace-nowrap">
                              <Calendar size={14} />
                              <span className={isTaskOverdue ? 'text-red-600 font-medium' : ''}>
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 text-center text-xs text-[#6B7280]">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} displayed
          </div>
        </main>
      </div>

      {/* ===== GLOBAL STYLES ===== */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmployeeTasksPage;