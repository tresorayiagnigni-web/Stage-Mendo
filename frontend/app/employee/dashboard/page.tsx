'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  CheckSquare,
  User,
  LogOut,
  Clock,
  Bell,
  Calendar,
  Briefcase,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

// Type Definitions
type NavItem = 'dashboard' | 'tasks' | 'profile';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
}

const EmployeeWorkspaceDashboardV2: React.FC = () => {
  // ========== STATE MANAGEMENT ==========
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Attendance State
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [hoursWorked, setHoursWorked] = useState<number>(0); // in seconds
  const [clockInTime, setClockInTime] = useState<Date | null>(null);

  // Task State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Q2 Performance Reviews',
      dueDate: '2026-03-25',
      completed: false,
    },
    {
      id: '2',
      title: 'Update Employee Handbook',
      dueDate: '2026-03-28',
      completed: false,
    },
    {
      id: '3',
      title: 'Prepare Monthly HR Report',
      dueDate: '2026-04-01',
      completed: false,
    },
  ]);

  // Announcements Data (static)
  const announcements: Announcement[] = [
    {
      id: 1,
      title: 'Updated Health & Safety Policy',
      date: 'March 15, 2026',
      content:
        'Please review the updated workplace safety guidelines. New protocols for remote work and office hygiene have been implemented effective immediately.',
    },
    {
      id: 2,
      title: 'Performance Review Cycle Q2 2026',
      date: 'March 12, 2026',
      content:
        'The Q2 performance review cycle will begin on April 1st. Managers are requested to schedule review meetings with their team members.',
    },
    {
      id: 3,
      title: 'System Maintenance Notice',
      date: 'March 10, 2026',
      content:
        'HRMS platform will undergo scheduled maintenance on March 20th from 2:00 AM to 6:00 AM EST. Please plan your work accordingly.',
    },
  ];

  // ========== DERIVED STATE ==========
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.filter(task => !task.completed).length;

  // Format hours worked
  const formatHoursWorked = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        setHoursWorked(prev => prev + 1);
      }, 1000);
    } else if (!isClockedIn && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, clockInTime]);

  // ========== EVENT HANDLERS ==========
  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date());
      setHoursWorked(0);
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer w-full';
    const activeClasses = 'bg-white/10 text-white font-medium';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/10';
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
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
          <Link href="/employee/dashboard" className={getNavItemClasses(true)}>
            <Home size={20} />
            <span>Dashboard</span>
            <ChevronRight size={16} className="ml-auto" />
          </Link>
          <Link href="/employee/tasks" className={getNavItemClasses(false)}>
            <CheckSquare size={20} />
            <span>My Tasks</span>
          </Link>
          <Link href="/employee/profile" className={getNavItemClasses(false)}>
            <User size={20} />
            <span>My Profile</span>
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
              <Link href="/employee/dashboard" className={getNavItemClasses(true)} onClick={toggleMobileMenu}>
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link href="/employee/tasks" className={getNavItemClasses(false)} onClick={toggleMobileMenu}>
                <CheckSquare size={20} />
                <span>My Tasks</span>
              </Link>
              <Link href="/employee/profile" className={getNavItemClasses(false)} onClick={toggleMobileMenu}>
                <User size={20} />
                <span>My Profile</span>
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
                <div className="text-xs text-[#6B7280]">Senior Developer</div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== DASHBOARD MAIN VIEWPORT ===== */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard</h1>
            <p className="text-[#6B7280] text-sm mt-1">
              Welcome back, John. Here's your workspace overview.
            </p>
          </div>

          <div className="space-y-6">
            {/* ===== ATTENDANCE TRACKER ===== */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${
                    isClockedIn ? 'bg-green-100' : 'bg-[#263A81]/10'
                  }`}>
                    <Clock size={28} className={isClockedIn ? 'text-green-600' : 'text-[#263A81]'} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#6B7280]">
                      Hours Worked Today
                    </div>
                    <div className="text-3xl font-bold text-[#1F2937] font-mono">
                      {formatHoursWorked(hoursWorked)}
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        isClockedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`}></span>
                        Status: {isClockedIn ? 'On the Clock' : 'Off the Clock'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClockToggle}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white transition-all duration-200 active:scale-95 ${
                    isClockedIn
                      ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100'
                      : 'bg-[#263A81] hover:bg-[#1e2f6a] shadow-lg shadow-[#263A81]/20'
                  }`}
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </button>
              </div>
            </section>

            {/* ===== TASK SUMMARY MATRIX ===== */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#6B7280]">Pending Tasks</div>
                    <div className="text-3xl font-bold text-[#1F2937] mt-1">{pendingTasks}</div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <CheckSquare size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#6B7280]">In Progress</div>
                    <div className="text-3xl font-bold text-[#1F2937] mt-1">{inProgressTasks}</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#6B7280]">Completed Tasks</div>
                    <div className="text-3xl font-bold text-[#1F2937] mt-1">{completedTasks}</div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckSquare size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </section>

            {/* ===== TASK LIST (Interactive Dashboard Matrix) ===== */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CheckSquare size={24} className="text-[#263A81]" />
                  <h2 className="text-xl font-bold text-[#1F2937]">Current Tasks</h2>
                </div>
                <span className="text-sm text-[#6B7280]">
                  {tasks.length} total · {pendingTasks} pending
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                      task.completed ? 'border-green-200 bg-green-50/50' : 'border-[#E5E7EB] hover:border-[#263A81]/20 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className="mt-1 w-4 h-4 rounded border-[#D1D5DB] text-[#263A81] focus:ring-2 focus:ring-[#263A81] focus:ring-offset-1 transition cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'text-[#6B7280] line-through' : 'text-[#1F2937]'}`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-[#6B7280] flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {task.completed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== ANNOUNCEMENTS ===== */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Bell size={24} className="text-[#263A81]" />
                <h2 className="text-xl font-bold text-[#1F2937]">Company Announcements</h2>
              </div>

              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={announcement.id} className={`pb-4 ${index < announcements.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-[#1F2937]">{announcement.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <Calendar size={14} />
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* ===== GLOBAL STYLES ===== */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default EmployeeWorkspaceDashboardV2;