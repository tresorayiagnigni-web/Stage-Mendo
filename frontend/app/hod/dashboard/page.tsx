// app/hod/dashboard/page.tsx

'use client';

import React, { useState } from 'react';
import { HODLayout } from '@/app/layout/HodLayout';
import {
  CheckSquare,
  Users as UsersIcon,
  ClipboardList,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Plus,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
interface DepartmentTask {
  id: string;
  title: string;
  assignedEmployee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
}

interface DepartmentRequest {
  id: string;
  employee: string;
  type: string;
  details: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

// ========== MAIN COMPONENT ==========
const HODDashboardPage: React.FC = () => {
  // ========== MOCK DATA ==========
  const departmentTasks: DepartmentTask[] = [
    {
      id: '1',
      title: 'Q2 Performance Review Preparation',
      assignedEmployee: 'John Doe',
      dueDate: '2026-03-25',
      priority: 'high',
      progress: 75,
    },
    {
      id: '2',
      title: 'IT Infrastructure Security Audit',
      assignedEmployee: 'Sarah Chen',
      dueDate: '2026-03-28',
      priority: 'high',
      progress: 40,
    },
    {
      id: '3',
      title: 'Employee Onboarding Documentation',
      assignedEmployee: 'Michael Brown',
      dueDate: '2026-04-01',
      priority: 'medium',
      progress: 100,
    },
    {
      id: '4',
      title: 'Department Budget Review',
      assignedEmployee: 'Emma Wilson',
      dueDate: '2026-03-20',
      priority: 'high',
      progress: 25,
    },
    {
      id: '5',
      title: 'Team Building Workshop Planning',
      assignedEmployee: 'James Rodriguez',
      dueDate: '2026-04-05',
      priority: 'low',
      progress: 60,
    },
    {
      id: '6',
      title: 'Software License Renewal',
      assignedEmployee: 'Anna Kim',
      dueDate: '2026-03-30',
      priority: 'medium',
      progress: 90,
    },
  ];

  const departmentRequests: DepartmentRequest[] = [
    {
      id: '1',
      employee: 'John Doe',
      type: 'Leave Request',
      details: 'Annual leave - 5 days (Mar 20-24)',
      status: 'pending',
      date: '2026-03-10',
    },
    {
      id: '2',
      employee: 'Alice Smith',
      type: 'Expense Claim',
      details: 'Travel reimbursement - $350',
      status: 'approved',
      date: '2026-03-08',
    },
    {
      id: '3',
      employee: 'Robert Johnson',
      type: 'Leave Request',
      details: 'Sick leave - 2 days (Mar 15-16)',
      status: 'approved',
      date: '2026-03-07',
    },
    {
      id: '4',
      employee: 'Maria Garcia',
      type: 'Salary Advance',
      details: 'Emergency advance - $2,500',
      status: 'pending',
      date: '2026-03-12',
    },
  ];

  // ========== DERIVED STATISTICS ==========
  const totalEmployees = 12;
  const pendingTasks = departmentTasks.filter(task => task.progress < 100).length;
  const completedTasks = departmentTasks.filter(task => task.progress === 100).length;
  const tasksDueThisWeek = departmentTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return dueDate >= today && dueDate <= weekFromNow && task.progress < 100;
  }).length;

  // ========== HANDLERS ==========
  const handleNewTask = () => {
    alert('New Task modal would open here');
  };

  // ========== HELPER FUNCTIONS ==========
  const getPriorityBadge = (priority: DepartmentTask['priority']) => {
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

  const getStatusBadge = (status: DepartmentRequest['status']) => {
    const config = {
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />,
        label: 'Approved',
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock size={14} className="mr-1" />,
        label: 'Pending',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertCircle size={14} className="mr-1" />,
        label: 'Rejected',
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

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // ========== RENDER ==========
  return (
    <HODLayout
      pageTitle="Department Dashboard Overview"
      pageSubtitle=""
      departmentName="IT Architecture"
      hodName="Dr. Sarah Taylor"
      hodInitials="ST"
      showCreateButton={true}
      onCreateClick={handleNewTask}
      createButtonText="New Task"
    >
      {/* KPI Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#6B7280]">Total Department Employees</div>
              <div className="text-3xl font-bold text-[#1F2937] mt-2">{totalEmployees}</div>
            </div>
            <div className="p-3 bg-[#263A81]/10 rounded-lg">
              <UsersIcon size={28} className="text-[#263A81]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#6B7280]">Active Tasks Array</div>
              <div className="text-3xl font-bold text-[#1F2937] mt-2">
                <span className="text-amber-600">{pendingTasks}</span>
                <span className="text-[#6B7280] text-base font-normal mx-1">/</span>
                <span className="text-green-600">{completedTasks}</span>
              </div>
              <div className="text-xs text-[#6B7280] mt-1">Pending / Completed</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardList size={28} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#6B7280]">Critical Deadlines</div>
              <div className="text-3xl font-bold text-[#1F2937] mt-2">{tasksDueThisWeek}</div>
              <div className="text-xs text-[#6B7280] mt-1">Tasks due this week</div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar size={28} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Tracking Matrix Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm mb-8 overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">Active Department Tasks</h2>
              <p className="text-sm text-[#6B7280] mt-1">Tracking progress across all team members</p>
            </div>
            {/* New Task button removed from here - now in layout header */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Task Title</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Assigned Employee</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Due Date</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Priority</th>
                <th className="text-left py-3.5 px-6 text-[#6B7280] font-semibold tracking-wide">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {departmentTasks.map((task) => {
                const priorityConfig = getPriorityBadge(task.priority);
                const progressColor = getProgressColor(task.progress);
                return (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition duration-150">
                    <td className="py-3.5 px-6 text-[#1F2937] font-medium">{task.title}</td>
                    <td className="py-3.5 px-6 text-[#6B7280]">{task.assignedEmployee}</td>
                    <td className="py-3.5 px-6 text-[#6B7280]">{formatDate(task.dueDate)}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${priorityConfig.bg} ${priorityConfig.text}`}
                      >
                        {priorityConfig.icon}
                        {priorityConfig.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[60px]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#1F2937] min-w-[36px]">
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Request Log */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-[#263A81]" />
            <h2 className="text-xl font-bold text-[#1F2937]">Recent Department Requests</h2>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Pending approvals and recent activity</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentRequests.map((request) => {
              const statusConfig = getStatusBadge(request.status);
              return (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FEFEFC] border border-[#E5E7EB] rounded-lg hover:border-[#263A81]/20 transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#1F2937]">{request.employee}</span>
                      <span className="text-[#6B7280] text-sm">-</span>
                      <span className="text-sm text-[#6B7280]">{request.type}</span>
                    </div>
                    <div className="text-sm text-[#6B7280] truncate mt-0.5">{request.details}</div>
                    <div className="text-xs text-[#6B7280] mt-1">{formatDate(request.date)}</div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HODLayout>
  );
};

export default HODDashboardPage;