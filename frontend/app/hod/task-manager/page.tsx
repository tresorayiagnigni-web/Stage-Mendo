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
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  User as UserIcon,
  AlertTriangle,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'not-started' | 'in-progress' | 'review' | 'completed';

interface DepartmentTask {
  id: string;
  title: string;
  description: string;
  assignedPersonnel: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  assignedPersonnel: string;
}

// ========== MOCK DATA ==========
const MOCK_TASKS: DepartmentTask[] = [
  {
    id: '1',
    title: 'Q2 Performance Review Preparation',
    description: 'Prepare and distribute performance review templates for all department staff.',
    assignedPersonnel: 'John Doe',
    dueDate: '2026-03-25',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: '2',
    title: 'IT Infrastructure Security Audit',
    description: 'Conduct comprehensive security audit of all department systems and networks.',
    assignedPersonnel: 'Sarah Chen',
    dueDate: '2026-03-28',
    priority: 'high',
    status: 'not-started',
  },
  {
    id: '3',
    title: 'Employee Onboarding Documentation',
    description: 'Update and finalize onboarding documentation for new IT Architecture hires.',
    assignedPersonnel: 'Michael Brown',
    dueDate: '2026-04-01',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Department Budget Review',
    description: 'Review Q2 budget allocations and prepare recommendations for Q3.',
    assignedPersonnel: 'Emma Wilson',
    dueDate: '2026-03-20',
    priority: 'high',
    status: 'review',
  },
  {
    id: '5',
    title: 'Team Building Workshop Planning',
    description: 'Organize logistics and activities for the department team building workshop.',
    assignedPersonnel: 'James Rodriguez',
    dueDate: '2026-04-05',
    priority: 'low',
    status: 'not-started',
  },
  {
    id: '6',
    title: 'Software License Renewal',
    description: 'Process renewal for all department software licenses and subscriptions.',
    assignedPersonnel: 'Anna Kim',
    dueDate: '2026-03-30',
    priority: 'medium',
    status: 'in-progress',
  },
];

const DEPARTMENT_EMPLOYEES = [
  'John Doe',
  'Sarah Chen',
  'Michael Brown',
  'Emma Wilson',
  'James Rodriguez',
  'Anna Kim',
  'Unassigned',
];

// ========== MAIN COMPONENT ==========
const HODTaskManagerPage: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // ========== STATE MANAGEMENT ==========
  const [tasks, setTasks] = useState<DepartmentTask[]>(MOCK_TASKS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<DepartmentTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedPersonnel: 'Unassigned',
  });

  // ========== HANDLER FUNCTIONS ==========
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavItemClasses = (targetPath: string) => {
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer w-full';
    const activeClasses = 'bg-white/10 text-white font-medium';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/10';
    const isActive = pathname === targetPath;
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const config = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertTriangle size={14} className="mr-1" />,
        label: 'High',
      },
      medium: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        icon: <Clock size={14} className="mr-1" />,
        label: 'Medium',
      },
      low: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Low',
      },
    };
    return config[priority];
  };

  const getStatusBadge = (status: TaskStatus) => {
    const config = {
      'not-started': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <AlertCircle size={14} className="mr-1" />,
        label: 'Not Started',
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Clock size={14} className="mr-1" />,
        label: 'In Progress',
      },
      'review': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Review',
      },
      'completed': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Completed',
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

  // ========== MODAL HANDLERS ==========
  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignedPersonnel: 'Unassigned',
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (task: DepartmentTask) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedPersonnel: task.assignedPersonnel,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const openDeleteModal = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // ========== CRUD OPERATIONS ==========
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: DepartmentTask = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'not-started',
      assignedPersonnel: formData.assignedPersonnel,
    };
    setTasks([newTask, ...tasks]);
    closeCreateModal();
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    const updatedTasks = tasks.map(task =>
      task.id === selectedTask.id
        ? {
            ...task,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            priority: formData.priority,
            assignedPersonnel: formData.assignedPersonnel,
          }
        : task
    );
    setTasks(updatedTasks);
    closeEditModal();
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks(tasks.filter(task => task.id !== taskToDelete));
    closeDeleteModal();
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            {pathname === '/hod/task-manager' && <ChevronRight size={16} className="ml-auto" />}
          </Link>
          <Link href="/hod/team-roster" className={getNavItemClasses('/hod/team-roster')}>
            <Users size={20} />
            <span>Team Roster</span>
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

        {/* ===== TASK MANAGER CONTENT ===== */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full box-border">
          {/* Control Toolbar Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1F2937]">Task Lifecycle &amp; Assignment Management</h1>
                <p className="text-[#6B7280] text-sm mt-1">
                  Create, assign, and track department tasks through completion
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 shadow-lg shadow-[#263A81]/20 w-full md:w-auto"
              >
                <Plus size={20} />
                Create New Task
              </button>
            </div>
          </div>

          {/* Task Inventory Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Task Title</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Assigned Personnel</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Due Date</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Priority</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Status</th>
                    <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                        <div className="flex flex-col items-center gap-2">
                          <CheckSquare size={48} className="text-[#6B7280] opacity-30" />
                          <p className="font-medium">No tasks found</p>
                          <p className="text-sm">Create a new task to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => {
                      const priorityConfig = getPriorityBadge(task.priority);
                      const statusConfig = getStatusBadge(task.status);
                      return (
                        <tr key={task.id} className="hover:bg-gray-50/50 transition duration-150">
                          <td className="py-3.5 px-6">
                            <div>
                              <div className="text-[#1F2937] font-medium">{task.title}</div>
                              <div className="text-xs text-[#6B7280] mt-0.5 truncate max-w-[200px]">
                                {task.description}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-[#6B7280]">
                            <div className="flex items-center gap-1.5">
                              <UserIcon size={14} />
                              <span>{task.assignedPersonnel}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-[#6B7280]">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${priorityConfig.bg} ${priorityConfig.text}`}
                            >
                              {priorityConfig.icon}
                              {priorityConfig.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${statusConfig.bg} ${statusConfig.text}`}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(task)}
                                className="p-1.5 hover:bg-blue-50 rounded-lg transition text-[#6B7280] hover:text-blue-600"
                                aria-label="Edit task"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(task.id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition text-[#6B7280] hover:text-red-600"
                                aria-label="Delete task"
                              >
                                <Trash2 size={18} />
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
          </div>
        </main>
      </div>

      {/* ===== CREATE TASK MODAL ===== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#1F2937]">Create New Task</h2>
              <button
                onClick={closeCreateModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title"
                  className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Provide detailed task description..."
                  className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-[#1F2937] mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-[#1F2937] mb-1">
                    Priority Scale <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="assignedPersonnel" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Assign to <span className="text-red-500">*</span>
                </label>
                <select
                  id="assignedPersonnel"
                  name="assignedPersonnel"
                  value={formData.assignedPersonnel}
                  onChange={handleFormChange}
                  className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  required
                >
                  {DEPARTMENT_EMPLOYEES.map(employee => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT TASK MODAL ===== */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#1F2937]">Edit Task</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            <form onSubmit={handleEditTask} className="p-6 space-y-5">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title"
                  className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Provide detailed task description..."
                  className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-dueDate" className="block text-sm font-medium text-[#1F2937] mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="edit-dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-priority" className="block text-sm font-medium text-[#1F2937] mb-1">
                    Priority Scale <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-assignedPersonnel" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Assign to <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-assignedPersonnel"
                  name="assignedPersonnel"
                  value={formData.assignedPersonnel}
                  onChange={handleFormChange}
                  className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  required
                >
                  {DEPARTMENT_EMPLOYEES.map(employee => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-[#1F2937]">Confirm Deletion</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-[#1F2937] mb-2">
                Are you sure you want to delete this task?
              </p>
              <p className="text-sm text-[#6B7280]">
                This action cannot be undone and will permanently remove the task from the department board.
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0 border-t border-[#E5E7EB]">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-200 active:scale-95"
              >
                Delete Task
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default HODTaskManagerPage;