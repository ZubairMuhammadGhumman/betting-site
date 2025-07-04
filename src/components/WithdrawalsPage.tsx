import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import ApiService, { TokenManager } from '../services/api';

interface WithdrawalRecord {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  transactionId?: string;
}

const WithdrawalsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration - replace with actual API call
  const mockWithdrawals: WithdrawalRecord[] = [
    {
      id: 'WD001',
      amount: 500.00,
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      paymentMethod: 'visa',
      transactionId: 'TXN123456'
    },
    {
      id: 'WD002',
      amount: 250.00,
      status: 'pending',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      paymentMethod: 'mastercard',
      transactionId: 'TXN123457'
    },
    {
      id: 'WD003',
      amount: 1000.00,
      status: 'processing',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T16:30:00Z',
      paymentMethod: 'visa',
      transactionId: 'TXN123458'
    },
    {
      id: 'WD004',
      amount: 75.00,
      status: 'failed',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T17:00:00Z',
      paymentMethod: 'c2c',
      transactionId: 'TXN123459'
    },
    {
      id: 'WD005',
      amount: 300.00,
      status: 'completed',
      createdAt: '2024-01-11T11:20:00Z',
      updatedAt: '2024-01-11T12:35:00Z',
      paymentMethod: 'visa',
      transactionId: 'TXN123460'
    }
  ];

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        // For now, use mock data. Replace with actual API call:
        // const response = await ApiService.getPaymentHistory({ type: 'withdrawal' });
        // setWithdrawals(response.data);
        
        // Simulate API delay
        setTimeout(() => {
          setWithdrawals(mockWithdrawals);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
        setWithdrawals(mockWithdrawals);
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Filter and sort data
  const filteredWithdrawals = withdrawals
    .filter(withdrawal => 
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.amount.toString().includes(searchTerm) ||
      withdrawal.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalEntries = filteredWithdrawals.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = filteredWithdrawals.slice(startIndex, endIndex);

  const handleSort = (column: 'createdAt' | 'amount' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleWithdraw = () => {
    // Navigate back to dashboard and open withdrawal modal
    navigate('/', { state: { openWithdrawal: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/60 via-purple-800/60 to-slate-800/60"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-800/30 via-transparent to-red-800/30"></div>
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-400/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-400/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-400/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Header 
          onSearchClick={() => {}} 
          onPaymentClick={() => {}}
          showOnlyLanguageDropdown={true}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Withdrawals</h1>
            <p className="text-gray-300">Manage your withdrawal history and create new withdrawals</p>
          </div>

          {/* Controls Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Side Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Entries Per Page */}
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">Show</span>
                  <div className="relative">
                    <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <span className="text-white text-sm">entries</span>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">Sort by:</span>
                  <div className="relative">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [column, order] = e.target.value.split('-');
                        setSortBy(column as any);
                        setSortOrder(order as any);
                      }}
                      className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="createdAt-desc">Date (Newest)</option>
                      <option value="createdAt-asc">Date (Oldest)</option>
                      <option value="amount-desc">Amount (High to Low)</option>
                      <option value="amount-asc">Amount (Low to High)</option>
                      <option value="status-asc">Status (A-Z)</option>
                      <option value="status-desc">Status (Z-A)</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 w-full sm:w-64"
                  />
                </div>

                {/* Withdraw Button */}
                <button
                  onClick={handleWithdraw}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Loading withdrawals...</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-slate-800/50 border-b border-white/10">
                  <div className="grid grid-cols-5 gap-4 p-4">
                    <div className="text-white font-medium text-sm">ID</div>
                    <div 
                      className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors flex items-center space-x-1"
                      onClick={() => handleSort('amount')}
                    >
                      <span>Amount</span>
                      {sortBy === 'amount' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                    <div 
                      className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors flex items-center space-x-1"
                      onClick={() => handleSort('status')}
                    >
                      <span>Status</span>
                      {sortBy === 'status' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                    <div 
                      className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors flex items-center space-x-1"
                      onClick={() => handleSort('createdAt')}
                    >
                      <span>Created At</span>
                      {sortBy === 'createdAt' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                    <div className="text-white font-medium text-sm">Updated At</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/10">
                  {currentEntries.length > 0 ? (
                    currentEntries.map((withdrawal, index) => (
                      <div 
                        key={withdrawal.id} 
                        className={`grid grid-cols-5 gap-4 p-4 hover:bg-white/5 transition-colors ${
                          index % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
                        }`}
                      >
                        <div className="text-white text-sm font-mono">{withdrawal.id}</div>
                        <div className="text-white text-sm font-medium">{formatAmount(withdrawal.amount)}</div>
                        <div>{getStatusBadge(withdrawal.status)}</div>
                        <div className="text-gray-300 text-sm">{formatDate(withdrawal.createdAt)}</div>
                        <div className="text-gray-300 text-sm">{formatDate(withdrawal.updatedAt)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-400 text-lg">No data available in table</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Showing Info */}
              <div className="text-white text-sm">
                Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700/50 hover:bg-slate-600/50 text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsPage;