import React, { useState } from 'react';
import { User, LogOut, Settings, Wallet, Trophy, Gift, History, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ApiService, { TokenManager } from '../services/api';
import { useProfile, useBalance, usePaymentHistory } from '../hooks/useApi';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentClick: (type: 'deposit' | 'withdraw') => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, onPaymentClick }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // These hooks will only fetch data if user is authenticated
  const { data: user } = useProfile();
  const { data: balanceData } = useBalance();
  const { data: paymentHistory } = usePaymentHistory({ limit: 10 });

  const handleLogout = async () => {
    try {
      setLoading(true);
      await ApiService.logout();
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      onClose();
      window.location.reload();
    }
  };

  const getUserLevel = () => {
    if (!user || !user.balance) return 1;
    const balance = user.balance;
    if (balance >= 10000) return 10;
    if (balance >= 5000) return 8;
    if (balance >= 2000) return 6;
    if (balance >= 1000) return 4;
    if (balance >= 500) return 3;
    if (balance >= 100) return 2;
    return 1;
  };

  const getLevelName = (level: number) => {
    const levels = {
      1: t('level.beginner'),
      2: t('level.bronze'),
      3: t('level.silver'),
      4: t('level.gold'),
      6: t('level.platinum'),
      8: t('level.diamond'),
      10: t('level.vip')
    };
    return levels[level as keyof typeof levels] || t('level.beginner');
  };

  const getBalance = () => {
    if (balanceData) {
      if (balanceData.totalBalance !== undefined) {
        return balanceData.totalBalance;
      }
      return balanceData.balance || 0;
    }
    return user?.balance || 0;
  };

  const handlePayment = (type: 'deposit' | 'withdraw') => {
    onClose();
    onPaymentClick(type);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Don't render if not open or user not authenticated
  if (!isOpen || !TokenManager.isAuthenticated()) return null;

  // Show loading state if user data is not yet loaded
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('error.profileLoading')}</p>
          </div>
        </div>
      </div>
    );
  }

  const userLevel = getUserLevel();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {user.nickname || user.email.split('@')[0]}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="text-blue-100 text-sm">
                  {t('profile.level')} {userLevel} - {getLevelName(userLevel)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('profile.title')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('profile.history')}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Balance */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('profile.balance')}</p>
                    <p className="text-2xl font-bold text-green-600">{formatAmount(getBalance())}</p>
                  </div>
                  <Wallet className="h-8 w-8 text-green-500" />
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('profile.levelProgress')}</span>
                  <span className="text-sm text-purple-600">{userLevel}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(userLevel / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* User Stats */}
              {user.totalDeposits !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600">{t('profile.totalDeposits')}</p>
                    <p className="text-lg font-bold text-blue-600">{formatAmount(user.totalDeposits || 0)}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="text-xs text-gray-600">{t('profile.totalWithdrawals')}</p>
                    <p className="text-lg font-bold text-orange-600">{formatAmount(user.totalWithdrawals || 0)}</p>
                  </div>
                </div>
              )}

              {/* Settings */}
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{t('profile.settings')}</span>
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {paymentHistory && paymentHistory.data.length > 0 ? (
                <div className="space-y-3">
                  {paymentHistory.data.map((transaction: any) => (
                    <div key={transaction.transactionId} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {transaction.type === 'deposit' ? t('payment.deposit') : t('payment.withdraw')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.paymentMethod.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                          </p>
                          <p className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {transaction.status === 'completed' ? t('profile.completed') :
                             transaction.status === 'pending' ? t('profile.pending') : t('profile.failed')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">{t('profile.emptyHistory')}</h3>
                  <p className="text-gray-400 text-sm">{t('profile.noTransactions')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>{loading ? t('profile.loggingOut') : t('profile.logout')}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('profile.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;