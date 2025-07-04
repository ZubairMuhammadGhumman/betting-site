import React, { useState, useEffect } from "react";
import {
  Search,
  Trophy,
  User,
  Wallet,
  Globe,
  ChevronDown,
  CreditCard,
  PlusCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import AuthModal from "./AuthModal";
import UserProfile from "./UserProfile";
import ApiService, { TokenManager } from "../services/api";
import { useGames, useBalance } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearchClick: () => void;
  onPaymentClick: (type: "deposit" | "withdraw") => void;
  hideAuthButtons?: boolean;
  showOnlyLanguageDropdown?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onPaymentClick,
  hideAuthButtons,
  showOnlyLanguageDropdown,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Use API hooks - only call balance if user is logged in
  const { data: gamesData } = useGames({ search: searchTerm, limit: 5 });
  const { data: balanceData } = useBalance(); // This will only fetch if authenticated

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("user");

      if (
        loginStatus === "true" &&
        userData &&
        TokenManager.isAuthenticated()
      ) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
        // Clear any stale data
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    if (!showAccountDropdown) return;
    const handleClick = (e: MouseEvent) => {
      setShowAccountDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAccountDropdown]);

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.nickname) {
      return user.nickname;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.email.split("@")[0];
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
    setSearchTerm("");
    setShowSearchResults(false);
    // Game navigation logic here
  };

  const languages = [
    {
      code: "az",
      name: "Azərbaycan",
      flag: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiMwMDkxRkYiLz4KPHJlY3QgeT0iNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRjAwMDAiLz4KPHJlY3QgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI1IiBmaWxsPSIjMDBCMDQ5Ii8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iNy41IiByPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTEuNSA2LjVMMTIgNy41TDExLjUgOC41SDEwLjVMOSA3LjVMMTAuNSA2LjVIMTEuNVoiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+",
    },
    {
      code: "en",
      name: "English",
      flag: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjMDEyMTY5Ii8+CjxwYXRoIGQ9Ik0wIDFIMjBNMCAzSDIwTTAgNUgyME0wIDdIMjBNMCA5SDIwTTAgMTEgMjBNMCAxM0gyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxwYXRoIGQ9Ik0wIDFIMjBNMCAzSDIwTTAgNUgyME0wIDdIMjAiIHN0cm9rZT0iI0ZGMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzAxMjE2OSIvPgo8L3N2Zz4=",
    },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageSelect = (langCode: "az" | "en") => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Add click outside to close profile dropdown
  useEffect(() => {
    if (!showProfileDropdown) return;
    const handleClick = (e: MouseEvent) => {
      setShowProfileDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfileDropdown]);

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
                  {t("footer.company")}
                </h1>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("header.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchResults(false), 200)
                  }
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-300 focus:border-yellow-300 focus:outline-none transition-all text-sm"
                />
              </div>

              {/* Search Results - Enhanced z-index */}
              {showSearchResults && filteredGames.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 z-[100]">
                  {filteredGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleGameSelect(game.name)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-gray-800 text-sm font-medium">
                        {game.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {showOnlyLanguageDropdown ? (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                      }
                      className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-xl p-2 hover:bg-black/30 transition-all border border-white/20"
                    >
                      <Globe className="h-4 w-4 text-white" />
                      <img
                        src={currentLanguage?.flag}
                        alt={currentLanguage?.code.toUpperCase()}
                        className="w-4 h-3 rounded-sm"
                      />
                      <ChevronDown
                        className={`h-3 w-3 text-white transition-transform ${
                          isLanguageDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden min-w-[140px] z-50">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() =>
                              handleLanguageSelect(lang.code as "az" | "en")
                            }
                            className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 transition-colors ${
                              language === lang.code
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
                            <img
                              src={lang.flag}
                              alt={lang.code.toUpperCase()}
                              className="w-4 h-3 rounded-sm"
                            />
                            <span
                              className={`font-medium text-xs ${
                                language === lang.code
                                  ? "text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {lang.code.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Custom Dropdown 1 (Kazino/Bet/Deposit menu) */}
                  <div className="relative">
                    <button
                      className="bg-[#7B77C7] text-white w-[90px] py-2 rounded-lg shadow border border-[#6C63FF] flex items-center justify-center relative focus:outline-none"
                      onClick={() => setShowAccountDropdown((v) => !v)}
                      type="button"
                    >
                      <span className="flex items-center justify-center gap-1 w-full">
                        <span className="text-white font-semibold text-base">
                          10
                        </span>
                        <CreditCard className="h-6 w-6 text-white opacity-90 font-bold" />
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M7 10l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    {showAccountDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#222] text-white rounded-xl shadow-2xl border border-black/30 z-50 animate-fade-in flex flex-col">
                        <div className="px-5 py-3">
                          <div className="flex justify-between items-center mb-2">
                            <span>Kazino Hesabı:</span>
                            <span className="font-bold">10</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span>Bet Hesabı:</span>
                            <span className="font-bold">0</span>
                          </div>
                        </div>
                        <div className="border-t border-white/10" />
                        <button
                          className="flex items-center justify-center gap-2 py-3 text-white hover:bg-white/10 transition rounded-b-xl w-full"
                          onClick={() => navigate("/deposit")}
                        >
                          <PlusCircle className="h-5 w-5" /> Deposit
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Custom Dropdown 2 (user icon + username) */}
                  <div className="relative">
                    <div
                      className="flex items-center gap-5 px-4 py-2 rounded-lg cursor-pointer"
                      onClick={() => setShowProfileDropdown((v) => !v)}
                    >
                      <img
                        src="/public/profile.png"
                        className="h-10 w-10"
                        alt="user avatar"
                        data-v-1775bd24=""
                      />
                      <span className="text-white font-semibold text-lg">
                        elliottp
                      </span>
                    </div>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#222] text-white rounded-xl shadow-2xl border border-black/30 z-50 animate-fade-in flex flex-col">
                        {/* Arrow */}
                        <div className="absolute -top-2 right-6 w-4 h-4 overflow-hidden">
                          <div className="w-4 h-4 bg-[#222] rotate-45 border-l border-t border-black/30"></div>
                        </div>
                        {/* Options */}
                        <button className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition text-base font-medium text-white text-left">
                          {/* User icon */}
                          <svg
                            className="h-5 w-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition text-base font-medium text-white text-left"
                          onClick={() => navigate("/withdrawals")}
                        >
                          {/* Gear icon */}
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="3.5" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                            />
                          </svg>
                          Withdrawals
                        </button>
                        <button className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition text-base font-medium text-white text-left">
                          {/* Gear icon */}
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="3.5" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                            />
                          </svg>
                          Deposits
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  {/* Balance with Wallet Icon */}
                  <button
                    onClick={() => onPaymentClick("deposit")}
                    className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-green-400/30 hover:bg-green-500/30 transition-all"
                  >
                    <Wallet className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">
                      {getBalance().toFixed(2)} AZN
                    </span>
                  </button>
                  {/* Profile */}
                  <button
                    onClick={() => setShowProfileDropdown(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/80 hover:to-blue-700/80 backdrop-blur-sm px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">
                      {getUserDisplayName()}
                    </span>
                  </button>
                </div>
              ) : hideAuthButtons ? null : (
                <>
                  <button
                    onClick={() => handleAuthClick("login")}
                    className="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 hover:from-yellow-500/90 hover:to-yellow-600/90 backdrop-blur-sm px-5 py-2 rounded-xl font-medium text-black transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t("header.login")}
                  </button>
                  <button
                    onClick={() => handleAuthClick("register")}
                    className="bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-600/80 hover:to-green-700/80 backdrop-blur-sm px-5 py-2 rounded-xl font-medium text-white transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t("header.register")}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                      }
                      className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-xl p-2 hover:bg-black/30 transition-all border border-white/20"
                    >
                      <Globe className="h-4 w-4 text-white" />
                      <img
                        src={currentLanguage?.flag}
                        alt={currentLanguage?.code.toUpperCase()}
                        className="w-4 h-3 rounded-sm"
                      />
                      <ChevronDown
                        className={`h-3 w-3 text-white transition-transform ${
                          isLanguageDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isLanguageDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden min-w-[140px] z-50">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() =>
                              handleLanguageSelect(lang.code as "az" | "en")
                            }
                            className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 transition-colors ${
                              language === lang.code
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
                            <img
                              src={lang.flag}
                              alt={lang.code.toUpperCase()}
                              className="w-4 h-3 rounded-sm"
                            />
                            <span
                              className={`font-medium text-xs ${
                                language === lang.code
                                  ? "text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
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
