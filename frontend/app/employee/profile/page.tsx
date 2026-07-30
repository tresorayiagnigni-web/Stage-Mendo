'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
type NavItem = 'dashboard' | 'tasks' | 'profile';

type RequestType = 'leave' | 'expense';

interface Request {
  id: string;
  date: string;
  type: string;
  details: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface FormData {
  type: RequestType;
  startDate: string;
  endDate: string;
  amount: string;
  comment: string;
}

// ========== MAIN COMPONENT ==========
const EmployeeProfilePage: React.FC = () => {
  const pathname = usePathname();

  // ========== STATE MANAGEMENT ==========
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    type: 'leave',
    startDate: '',
    endDate: '',
    amount: '',
    comment: '',
  });

  const [requests] = useState<Request[]>([
    {
      id: '1',
      date: '2026-03-10',
      type: 'Salary Advance',
      details: 'Emergency advance - $5,000',
      status: 'approved',
    },
    {
      id: '2',
      date: '2026-03-05',
      type: 'Leave Request',
      details: 'Annual leave - 5 days (Mar 20-24)',
      status: 'pending',
    },
    {
      id: '3',
      date: '2026-02-28',
      type: 'Expense Claim',
      details: 'Travel reimbursement - $350',
      status: 'approved',
    },
    {
      id: '4',
      date: '2026-02-15',
      type: 'Leave Request',
      details: 'Sick leave - 2 days (Feb 16-17)',
      status: 'approved',
    },
  ]);

  // ========== EVENT HANDLERS ==========
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openModal = () => {
    setFormData({
      type: 'leave',
      startDate: '',
      endDate: '',
      amount: '',
      comment: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Request submitted successfully!');
    closeModal();
  };

  // ========== HELPER FUNCTIONS ==========
  const getStatusBadge = (status: Request['status']) => {
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

  const getNavItemClasses = (targetPath: string) => {
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer w-full';
    const activeClasses = 'bg-white/10 text-white font-medium';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/10';
    const isActive = pathname === targetPath;
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // ========== JSX RENDER ==========
  return (
    <div className="min-h-screen bg-[#FEFEFC] font-sans antialiased flex relative">
      {/* ===== DESKTOP SIDEBAR - FIXED POSITION ===== */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] flex-shrink-0 bg-[#263A81] text-white h-screen fixed top-0 left-0 overflow-y-auto z-30">
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl font-bold tracking-tight">MENDO HR</div>
          <div className="text-xs font-light opacity-70 mt-1">
            Employee Workspace
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/employee/dashboard" className={getNavItemClasses('/employee/dashboard')}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/employee/tasks" className={getNavItemClasses('/employee/tasks')}>
            <CheckSquare size={20} />
            <span>My Tasks</span>
          </Link>
          <Link href="/employee/profile" className={getNavItemClasses('/employee/profile')}>
            <User size={20} />
            <span>My Profile</span>
            {pathname === '/employee/profile' && <ChevronRight size={16} className="ml-auto" />}
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

      {/* ===== MAIN CONTENT WRAPPER - WITH LEFT MARGIN FOR SIDEBAR ===== */}
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
                JD
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-sm font-medium text-[#1F2937] truncate">John Doe</div>
                <div className="text-xs text-[#6B7280] truncate">Software Engineer</div>
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
                <Link href="/employee/dashboard" className={getNavItemClasses('/employee/dashboard')} onClick={toggleMobileMenu}>
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link href="/employee/tasks" className={getNavItemClasses('/employee/tasks')} onClick={toggleMobileMenu}>
                  <CheckSquare size={20} />
                  <span>My Tasks</span>
                </Link>
                <Link href="/employee/profile" className={getNavItemClasses('/employee/profile')} onClick={toggleMobileMenu}>
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

        {/* ===== PROFILE CONTENT ===== */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full box-border">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1F2937]">My Profile</h1>
            <p className="text-[#6B7280] text-sm mt-1">
              View your employee information and manage requests.
            </p>
          </div>

          <div className="space-y-6 w-full">
            {/* ===== EMPLOYEE IDENTITY CARD ===== */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm w-full box-border">
              <div className="flex flex-col sm:flex-row lg:flex-row gap-6 items-center sm:items-start">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#263A81] flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-sm">
                    JD
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">
                      Full Name
                    </label>
                    <p className="text-[#1F2937] font-medium break-words">John Doe</p>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">
                      Job Title
                    </label>
                    <p className="text-[#1F2937] font-medium break-words">Software Engineer</p>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">
                      Assigned Department
                    </label>
                    <p className="text-[#1F2937] font-medium break-words">IT Architecture</p>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-[#6B7280] mb-1">
                      Corporate Email
                    </label>
                    <p className="text-[#1F2937] font-medium break-all select-all">j.doe@mendocompany.com</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== REQUEST CONSOLE ===== */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm w-full box-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">Request Console</h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Submit new requests for approval
                  </p>
                </div>
                <button
                  onClick={openModal}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95 shadow-lg shadow-[#263A81]/20 w-full sm:w-auto self-start sm:self-center text-sm"
                >
                  <Plus size={18} />
                  Submit New Request
                </button>
              </div>

              {/* ===== HISTORICAL REQUESTS TABLE ===== */}
              <div className="mt-6 w-full overflow-hidden">
                <h3 className="text-sm font-semibold text-[#1F2937] mb-4">
                  Historical Requests
                </h3>
                <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] w-full">
                  <table className="w-full text-sm min-w-[600px] table-auto">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-gray-50/70">
                        <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold tracking-wide">Date</th>
                        <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold tracking-wide">Request Type</th>
                        <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold tracking-wide">Details</th>
                        <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {requests.map((request) => {
                        const statusConfig = getStatusBadge(request.status);
                        return (
                          <tr
                            key={request.id}
                            className="hover:bg-gray-50/50 transition duration-150"
                          >
                            <td className="py-3.5 px-4 text-[#1F2937] font-medium whitespace-nowrap">
                              {new Date(request.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-[#1F2937] font-medium whitespace-nowrap">{request.type}</td>
                            <td className="py-3.5 px-4 text-[#6B7280] max-w-[240px] truncate">{request.details}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
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
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* ===== MODAL OVERLAY ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#1F2937]">Submit New Request</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="requestType"
                  className="block text-sm font-medium text-[#1F2937] mb-1"
                >
                  Request Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="requestType"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                  required
                >
                  <option value="leave">Leave Request</option>
                  <option value="expense">Salary Advance / Expense Claim</option>
                </select>
              </div>

              {formData.type === 'leave' && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-[#1F2937] mb-1"
                    >
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-[#1F2937] mb-1"
                    >
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.type === 'expense' && (
                <div className="animate-fade-in">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-[#1F2937] mb-1"
                  >
                    Requested Amount (CFA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0"
                    step="100"
                    className="w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition"
                    required
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-[#1F2937] mb-1"
                >
                  Comment / Description
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Provide additional details about your request..."
                  className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#263A81] focus:border-transparent transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DB] text-[#1F2937] font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#263A81] text-white font-bold rounded-lg hover:bg-[#1e2f6a] transition-all duration-200 active:scale-95"
                >
                  Submit Request
                </button>
              </div>
            </form>
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

export default EmployeeProfilePage;