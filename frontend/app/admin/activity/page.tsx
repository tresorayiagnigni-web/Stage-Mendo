// app/admin/activity-tracker/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/app/layout/AppLayout';
import {
  Home,
  Users,
  User,
  LogOut,
  Bell,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Building,
  Mail,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  Database,
  UserCheck,
  UserPlus,
  UserX,
  FileText,
  DollarSign,
  CalendarDays,
  ListChecks,
  TrendingUp,
  BarChart,
  PieChart,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Globe,
  Shield,
  Timer,
  BookOpen,
  Award,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type RequestStatus = 'pending' | 'approved' | 'rejected';
type RequestType = 'leave' | 'salary-advance';
type ActivityType = 'task-created' | 'task-completed' | 'task-assigned' | 'account-removed' | 'user-created' | 'request-approved' | 'request-rejected';

interface GlobalTask {
  id: string;
  title: string;
  department: string;
  assignedPersonnel: string;
  dueDate: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
}

interface ActivityLog {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface EmployeeRequest {
  id: string;
  employeeName: string;
  department: string;
  type: RequestType;
  details: string;
  status: RequestStatus;
  date: string;
}

// ========== MOCK DATA ==========
const MOCK_TASKS: GlobalTask[] = [
  {
    id: 't1',
    title: 'Q2 Performance Review Preparation',
    department: 'IT Architecture',
    assignedPersonnel: 'John Doe',
    dueDate: '2026-03-25',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 't2',
    title: 'IT Infrastructure Security Audit',
    department: 'IT Architecture',
    assignedPersonnel: 'Sarah Chen',
    dueDate: '2026-03-28',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 't3',
    title: 'Employee Onboarding Documentation',
    department: 'Human Resources',
    assignedPersonnel: 'Michael Brown',
    dueDate: '2026-04-01',
    status: 'completed',
    priority: 'medium',
  },
  {
    id: 't4',
    title: 'Department Budget Review',
    department: 'Finance',
    assignedPersonnel: 'Emma Wilson',
    dueDate: '2026-03-20',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 't5',
    title: 'Team Building Workshop Planning',
    department: 'Human Resources',
    assignedPersonnel: 'Unassigned',
    dueDate: '2026-04-05',
    status: 'pending',
    priority: 'low',
  },
  {
    id: 't6',
    title: 'Software License Renewal',
    department: 'IT Architecture',
    assignedPersonnel: 'Anna Kim',
    dueDate: '2026-03-30',
    status: 'in-progress',
    priority: 'medium',
  },
  {
    id: 't7',
    title: 'Payroll System Integration',
    department: 'Finance',
    assignedPersonnel: 'Mark Wilson',
    dueDate: '2026-04-10',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 't8',
    title: 'Supply Chain Optimization',
    department: 'Logistics',
    assignedPersonnel: 'Unassigned',
    dueDate: '2026-04-15',
    status: 'pending',
    priority: 'low',
  },
];

const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 'a1',
    type: 'task-created',
    description: "HOD Dr. Sarah Taylor created task 'API Redesign' for IT Architecture",
    timestamp: '2026-03-18T10:30:00',
    icon: <Plus size={16} />,
  },
  {
    id: 'a2',
    type: 'task-completed',
    description: "Employee John Doe marked task 'UI Review' as Completed",
    timestamp: '2026-03-18T09:15:00',
    icon: <CheckCircle size={16} />,
  },
  {
    id: 'a3',
    type: 'task-assigned',
    description: "HOD Alice Smith assigned task 'Database Migration' to Employee Bob Jones",
    timestamp: '2026-03-17T16:45:00',
    icon: <UserPlus size={16} />,
  },
  {
    id: 'a4',
    type: 'account-removed',
    description: "Admin removed employee account ID 402",
    timestamp: '2026-03-17T14:20:00',
    icon: <UserX size={16} />,
  },
  {
    id: 'a5',
    type: 'task-created',
    description: "HOD Robert Johnson created task 'Quarterly Financial Report' for Finance",
    timestamp: '2026-03-17T11:00:00',
    icon: <Plus size={16} />,
  },
  {
    id: 'a6',
    type: 'request-approved',
    description: "Admin approved leave request for Employee Maria Garcia",
    timestamp: '2026-03-16T15:30:00',
    icon: <CheckCircle size={16} />,
  },
  {
    id: 'a7',
    type: 'task-completed',
    description: "Employee Sarah Chen marked task 'Security Audit' as Completed",
    timestamp: '2026-03-16T13:45:00',
    icon: <CheckCircle size={16} />,
  },
  {
    id: 'a8',
    type: 'user-created',
    description: "Admin created new employee account for James Wilson",
    timestamp: '2026-03-16T10:00:00',
    icon: <UserPlus size={16} />,
  },
];

const MOCK_REQUESTS: EmployeeRequest[] = [
  {
    id: 'r1',
    employeeName: 'John Doe',
    department: 'IT Architecture',
    type: 'leave',
    details: '5 Days Off (Mar 20-24)',
    status: 'pending',
    date: '2026-03-10',
  },
  {
    id: 'r2',
    employeeName: 'Alice Smith',
    department: 'Human Resources',
    type: 'salary-advance',
    details: '$500 Advance',
    status: 'approved',
    date: '2026-03-08',
  },
  {
    id: 'r3',
    employeeName: 'Robert Johnson',
    department: 'Finance',
    type: 'leave',
    details: '2 Days Off (Mar 15-16)',
    status: 'approved',
    date: '2026-03-07',
  },
  {
    id: 'r4',
    employeeName: 'Maria Garcia',
    department: 'Logistics',
    type: 'salary-advance',
    details: '$2,500 Advance',
    status: 'pending',
    date: '2026-03-12',
  },
  {
    id: 'r5',
    employeeName: 'Emma Wilson',
    department: 'IT Architecture',
    type: 'leave',
    details: '3 Days Off (Mar 25-27)',
    status: 'rejected',
    date: '2026-03-14',
  },
  {
    id: 'r6',
    employeeName: 'Michael Brown',
    department: 'Human Resources',
    type: 'salary-advance',
    details: '$1,200 Advance',
    status: 'pending',
    date: '2026-03-15',
  },
];

// ========== MAIN COMPONENT ==========
const AdminActivityPage: React.FC = () => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('all');

  // ========== DERIVED STATE ==========
  const filteredTasks = useMemo(() => {
    let filtered = MOCK_TASKS;
    
    // Apply status filter
    if (taskFilter !== 'all') {
      filtered = filtered.filter(task => task.status === taskFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.department.toLowerCase().includes(query) ||
        task.assignedPersonnel.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [taskFilter, searchQuery]);

  const filteredActivities = useMemo(() => {
    if (selectedActivityType === 'all') return MOCK_ACTIVITIES;
    return MOCK_ACTIVITIES.filter(activity => activity.type === selectedActivityType);
  }, [selectedActivityType]);

  // ========== HELPER FUNCTIONS ==========
  const getStatusBadge = (status: TaskStatus | RequestStatus) => {
    const config = {
      'pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock size={14} className="mr-1" />,
        label: 'Pending',
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Activity size={14} className="mr-1" />,
        label: 'In Progress',
      },
      'completed': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Completed',
      },
      'approved': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Approved',
      },
      'rejected': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertCircle size={14} className="mr-1" />,
        label: 'Rejected',
      },
    };
    return config[status];
  };

  const getRequestTypeBadge = (type: RequestType) => {
    const config = {
      'leave': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: <CalendarDays size={14} className="mr-1" />,
        label: 'Leave Request',
      },
      'salary-advance': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        icon: <DollarSign size={14} className="mr-1" />,
        label: 'Salary Advance',
      },
    };
    return config[type];
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    const config = {
      low: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Low',
      },
      medium: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        label: 'Medium',
      },
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'High',
      },
    };
    return config[priority];
  };

  const getActivityTypeIcon = (type: ActivityType) => {
    const icons = {
      'task-created': <Plus size={16} className="text-blue-600" />,
      'task-completed': <CheckCircle size={16} className="text-green-600" />,
      'task-assigned': <UserPlus size={16} className="text-purple-600" />,
      'account-removed': <UserX size={16} className="text-red-600" />,
      'user-created': <UserPlus size={16} className="text-emerald-600" />,
      'request-approved': <CheckCircle size={16} className="text-green-600" />,
      'request-rejected': <AlertCircle size={16} className="text-red-600" />,
    };
    return icons[type] || <Activity size={16} className="text-gray-600" />;
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    const labels = {
      'task-created': 'Task Created',
      'task-completed': 'Task Completed',
      'task-assigned': 'Task Assigned',
      'account-removed': 'Account Removed',
      'user-created': 'User Created',
      'request-approved': 'Request Approved',
      'request-rejected': 'Request Rejected',
    };
    return labels[type] || 'Activity';
  };

  const getActivityTypeColor = (type: ActivityType) => {
    const colors = {
      'task-created': 'border-blue-200 bg-blue-50',
      'task-completed': 'border-green-200 bg-green-50',
      'task-assigned': 'border-purple-200 bg-purple-50',
      'account-removed': 'border-red-200 bg-red-50',
      'user-created': 'border-emerald-200 bg-emerald-50',
      'request-approved': 'border-green-200 bg-green-50',
      'request-rejected': 'border-red-200 bg-red-50',
    };
    return colors[type] || 'border-gray-200 bg-gray-50';
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFilterButtonClasses = (filter: 'all' | 'pending' | 'in-progress' | 'completed') => {
    const baseClasses =
      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200';
    const activeClasses = 'bg-[#263A81] text-white shadow-lg shadow-[#263A81]/20';
    const inactiveClasses = 'bg-white text-[#1F2937] border border-[#E5E7EB] hover:bg-gray-50';
    return `${baseClasses} ${taskFilter === filter ? activeClasses : inactiveClasses}`;
  };

  // ========== RENDER ==========
  return (
    <AppLayout
      pageTitle="Global Activity & Operations Tracker"
      pageSubtitle="Company-Wide Task Monitoring, Employee Request Pipelines, and Master System Audit Streams"
      showCreateButton={false}
    >
      <div className="space-y-6">
        {/* ===== OPERATIONAL TASK BOARD ===== */}
        <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <ListChecks size={24} className="text-[#263A81]" />
                <h2 className="text-xl font-bold text-[#1F2937]">Operational Task Board</h2>
                <span className="text-sm text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">
                  {filteredTasks.length} tasks
                </span>
              </div>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-56 h-10 pl-10 pr-4 rounded-lg border border-[#E5E7EB] bg-[#FEFEFC] text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Task Filter Controls */}
          <div className="px-6 py-4 border-b border-[#E5E7EB] bg-gray-50/50">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTaskFilter('all')}
                className={getFilterButtonClasses('all')}
              >
                All Tasks
              </button>
              <button
                onClick={() => setTaskFilter('pending')}
                className={getFilterButtonClasses('pending')}
              >
                Pending
              </button>
              <button
                onClick={() => setTaskFilter('in-progress')}
                className={getFilterButtonClasses('in-progress')}
              >
                In Progress
              </button>
              <button
                onClick={() => setTaskFilter('completed')}
                className={getFilterButtonClasses('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Task Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Task Title</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Department</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Assigned Personnel</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Due Date</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#6B7280]">
                      <div className="flex flex-col items-center gap-2">
                        <ListChecks size={48} className="text-[#6B7280] opacity-30" />
                        <p className="font-medium">No tasks found</p>
                        <p className="text-sm">Try adjusting your filters or search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const statusConfig = getStatusBadge(task.status);
                    const priorityConfig = getPriorityBadge(task.priority);
                    return (
                      <tr key={task.id} className="hover:bg-gray-50/50 transition duration-150">
                        <td className="py-3.5 px-6">
                          <div>
                            <div className="text-[#1F2937] font-medium">{task.title}</div>
                            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                              {priorityConfig.label} Priority
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <Building size={14} className="text-[#6B7280]" />
                            <span className="text-[#1F2937]">{task.department}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <User size={14} className="text-[#6B7280]" />
                            <span className={`${task.assignedPersonnel === 'Unassigned' ? 'text-[#6B7280] italic' : 'text-[#1F2937]'}`}>
                              {task.assignedPersonnel}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-[#6B7280]" />
                            <span className="text-[#6B7280]">{formatDate(task.dueDate)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== MASTER ACTIVITY STREAM ===== */}
        <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-[#263A81]" />
                <h2 className="text-xl font-bold text-[#1F2937]">Master Activity Stream</h2>
                <span className="text-sm text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">
                  {filteredActivities.length} events
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedActivityType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedActivityType === 'all'
                      ? 'bg-[#263A81] text-white'
                      : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedActivityType('task-created')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedActivityType === 'task-created'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Created
                </button>
                <button
                  onClick={() => setSelectedActivityType('task-completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedActivityType === 'task-completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setSelectedActivityType('account-removed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedActivityType === 'account-removed'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Removed
                </button>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8 text-[#6B7280]">
                  <p>No activities found for the selected filter</p>
                </div>
              ) : (
                filteredActivities.map((activity, index) => {
                  const activityColor = getActivityTypeColor(activity.type);
                  return (
                    <div key={activity.id} className="flex gap-4">
                      {/* Timeline line and dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${activityColor} flex items-center justify-center border-2 ${activityColor.split(' ')[0]} flex-shrink-0`}>
                          {getActivityTypeIcon(activity.type)}
                        </div>
                        {index < filteredActivities.length - 1 && (
                          <div className="w-0.5 h-12 bg-[#E5E7EB] mt-2"></div>
                        )}
                      </div>

                      {/* Activity content */}
                      <div className="flex-1 pt-1 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${activityColor}`}>
                              {getActivityTypeLabel(activity.type)}
                            </span>
                            <p className="text-[#1F2937]">{activity.description}</p>
                          </div>
                          <span className="text-xs text-[#6B7280] whitespace-nowrap">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ===== CENTRALIZED REQUEST PIPELINE ===== */}
        <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-[#263A81]" />
              <h2 className="text-xl font-bold text-[#1F2937]">Centralized Request Pipeline</h2>
              <span className="text-sm text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">
                {MOCK_REQUESTS.length} requests
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Employee Name</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Department</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Request Type</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Requested Details</th>
                  <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {MOCK_REQUESTS.map((request) => {
                  const statusConfig = getStatusBadge(request.status);
                  const typeConfig = getRequestTypeBadge(request.type);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition duration-150">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#263A81]/10 flex items-center justify-center text-[#263A81] font-semibold text-xs flex-shrink-0">
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-[#1F2937]">{request.employeeName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-[#6B7280]">{request.department}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${typeConfig.bg} ${typeConfig.text}`}
                        >
                          {typeConfig.icon}
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-[#1F2937]">{request.details}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default AdminActivityPage;