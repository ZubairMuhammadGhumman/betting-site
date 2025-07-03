import React, { useState, useEffect } from 'react';
import { Search, Trophy, User, Wallet, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import ApiService, { TokenManager } from '../services/api';
import { useGames, useBalance } from '../hooks/useApi';

interface HeaderProps {
  onSearchClick: () => void;
  onPaymentClick: (type: 'deposit' | 'withdraw') => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, onPaymentClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Use API hooks - only call balance if user is logged in
  const { data: gamesData } = useGames({ search: searchTerm, limit: 5 });
  const { data: balanceData } = useBalance(); // This will only fetch if authenticated

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      const userData = localStorage.getItem('user');
      
      if (loginStatus === 'true' && userData && TokenManager.isAuthenticated()) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
        // Clear any stale data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.nickname) {
      return user.nickname;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.email.split('@')[0];
  };

  const getBalance = () => {
    // Only use API balance data if user is logged in and data is available
    if (isLoggedIn && balanceData) {
      if (balanceData.totalBalance !== undefined) {
        return balanceData.totalBalance;
      }
      return balanceData.balance || 0;
    }
    // Fallback to user data from localStorage
    return user?.balance || 0;
  };

  const filteredGames = gamesData?.data || [];

  const handleGameSelect = (gameName: string) => {
    setSearchTerm('');
    setShowSearchResults(false);
    // Game navigation logic here
  };

  const languages = [
    {
      code: 'az',
      name: 'Azərbaycan',
      flag: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiMwMDkxRkYiLz4KPHJlY3QgeT0iNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRjAwMDAiLz4KPHJlY3QgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI1IiBmaWxsPSIjMDBCMDQ5Ii8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iNy41IiByPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTEuNSA2LjVMMTIgNy41TDExLjUgOC41SDEwLjVMOSA3LjVMMTAuNSA2LjVIMTEuNVoiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+"
    },
    {
      code: 'en',
      name: 'English',
      flag: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjMDEyMTY5Ii8+CjxwYXRoIGQ9Ik0wIDFIMjBNMCAzSDIwTTAgNUgyME0wIDdIMjBNMCA5SDIwTTAgMTFIMjBNMCAxM0gyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxwYXRoIGQ9Ik0wIDFIMjBNMCAzSDIwTTAgNUgyME0wIDdIMjAiIHN0cm9rZT0iI0ZGMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzAxMjE2OSIvPgo8L3N2Zz4="
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode: 'az' | 'en') => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-md text-white shadow-2xl border-b border-white/10 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-xl shadow-lg">
                <Trophy className="h-7 w-7 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  {t('footer.company')}
                </h1>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('header.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-300 focus:border-yellow-300 focus:outline-none transition-all text-sm"
                />
              </div>
              
              {/* Search Results - Enhanced z-index */}
              {showSearchResults && filteredGames.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 z-[100]">
                  {filteredGames.map(game => (
                    <button
                      key={game.id}
                      onClick={() => handleGameSelect(game.name)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <img src={game.image} alt={game.name} className="w-8 h-8 rounded object-cover" />
                      <span className="text-gray-800 text-sm font-medium">{game.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  {/* Balance with Wallet Icon */}
                  <button
                    onClick={() => onPaymentClick('deposit')}
                    className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-green-400/30 hover:bg-green-500/30 transition-all"
                  >
                    <Wallet className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">{getBalance().toFixed(2)} AZN</span>
                  </button>
                  
                  {/* Profile */}
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/80 hover:to-blue-700/80 backdrop-blur-sm px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">{getUserDisplayName()}</span>
                  </button>

                  {/* Language Dropdown - Profile button sağında */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-xl p-2 hover:bg-black/30 transition-all border border-white/20"
                    >
                      <Globe className="h-4 w-4 text-white" />
                      <img 
                        src={currentLanguage?.flag}
                        alt={currentLanguage?.code.toUpperCase()}
                        className="w-4 h-3 rounded-sm"
                      />
                      <ChevronDown className={`h-3 w-3 text-white transition-transform ${
                        isLanguageDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden min-w-[140px] z-50">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code as 'az' | 'en')}
                            className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 transition-colors ${
                              language === lang.code ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <img 
                              src={lang.flag}
                              alt={lang.code.toUpperCase()}
                              className="w-4 h-3 rounded-sm"
                            />
                            <span className={`font-medium text-xs ${
                              language === lang.code ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {lang.code.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 hover:from-yellow-500/90 hover:to-yellow-600/90 backdrop-blur-sm px-5 py-2 rounded-xl font-medium text-black transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t('header.login')}
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-600/80 hover:to-green-700/80 backdrop-blur-sm px-5 py-2 rounded-xl font-medium text-white transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t('header.register')}
                  </button>

                  {/* Language Dropdown - Registration button sağında */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-xl p-2 hover:bg-black/30 transition-all border border-white/20"
                    >
                      <Globe className="h-4 w-4 text-white" />
                      <img 
                        src={currentLanguage?.flag}
                        alt={currentLanguage?.code.toUpperCase()}
                        className="w-4 h-3 rounded-sm"
                      />
                      <ChevronDown className={`h-3 w-3 text-white transition-transform ${
                        isLanguageDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden min-w-[140px] z-50">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code as 'az' | 'en')}
                            className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 transition-colors ${
                              language === lang.code ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <img 
                              src={lang.flag}
                              alt={lang.code.toUpperCase()}
                              className="w-4 h-3 rounded-sm"
                            />
                            <span className={`font-medium text-xs ${
                              language === lang.code ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {lang.code.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close language dropdown */}
      {isLanguageDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onPaymentClick={onPaymentClick}
      />
    </>
  );
};

export default Header;