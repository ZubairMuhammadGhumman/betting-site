import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import GameOfTheDay from './components/GameOfTheDay';
import WinnerTicker from './components/WinnerTicker';
import FeaturedGames from './components/FeaturedGames';
import GamesGrid from './components/GamesGrid';
import SearchModal from './components/SearchModal';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import Dashboard from './components/Dashboard';
import { TokenManager } from './services/api';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'deposit' | 'withdraw'>('deposit');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      const hasToken = TokenManager.isAuthenticated();
      setIsLoggedIn(loginStatus === 'true' && hasToken);
    };

    checkLoginStatus();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom login events
    window.addEventListener('userLoggedIn', handleStorageChange);
    window.addEventListener('userLoggedOut', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleStorageChange);
      window.removeEventListener('userLoggedOut', handleStorageChange);
    };
  }, []);

  const handlePaymentOpen = (type: 'deposit' | 'withdraw') => {
    setPaymentType(type);
    setIsPaymentOpen(true);
  };

  // If user is logged in, show dashboard
  if (isLoggedIn) {
    return (
      <LanguageProvider>
        <Dashboard />
      </LanguageProvider>
    );
  }

  // If user is not logged in, show home page
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* ULTRA PARLAQ VƏ AYDIN ARXA FON */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Əsas güclü gradient arxa fon */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 via-purple-800/80 to-slate-800/80"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-800/50 via-transparent to-red-800/50"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-yellow-800/30 via-transparent to-pink-800/30"></div>
          
          {/* NƏHƏNG animasiyalı dairələr - çox daha böyük və parlaq */}
          <div className="absolute -top-48 -left-48 w-[800px] h-[800px] bg-blue-400/60 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-48 -right-48 w-[800px] h-[800px] bg-purple-400/60 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/50 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          {/* Əlavə böyük rəngli elementlər */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-400/40 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-400/40 rounded-full blur-2xl animate-pulse delay-1500"></div>
          <div className="absolute top-3/4 left-3/4 w-[400px] h-[400px] bg-pink-400/35 rounded-full blur-2xl animate-pulse delay-3000"></div>
          <div className="absolute top-1/6 right-1/6 w-[350px] h-[350px] bg-cyan-400/35 rounded-full blur-2xl animate-pulse delay-2500"></div>
          <div className="absolute bottom-1/6 left-1/6 w-[350px] h-[350px] bg-orange-400/35 rounded-full blur-2xl animate-pulse delay-3500"></div>
          
          {/* Casino Ornaments - NƏHƏNG ÖLÇÜLƏR VƏ PARLAQ */}
          <div className="absolute top-8 left-8 text-yellow-300 text-[180px] animate-spin-slow opacity-90">♠</div>
          <div className="absolute top-16 right-16 text-red-300 text-[160px] animate-bounce opacity-90">♥</div>
          <div className="absolute bottom-16 left-16 text-yellow-300 text-[140px] animate-pulse opacity-90">♦</div>
          <div className="absolute bottom-8 right-8 text-green-300 text-[170px] animate-spin-slow opacity-90">♣</div>
          
          {/* Slot və Dice - NƏHƏNG ÖLÇÜLƏR */}
          <div className="absolute top-1/3 right-1/3 text-[200px] animate-pulse opacity-80">🎰</div>
          <div className="absolute bottom-1/3 left-1/3 text-[180px] animate-bounce opacity-80">🎲</div>
          
          {/* Əlavə dekorativ elementlər - BÖYÜK ÖLÇÜLƏR VƏ PARLAQ */}
          <div className="absolute top-1/4 right-1/4 text-green-300 text-[120px] animate-pulse delay-300 opacity-85">💎</div>
          <div className="absolute bottom-1/4 left-1/4 text-yellow-300 text-[130px] animate-spin-slow delay-700 opacity-85">👑</div>
          <div className="absolute top-3/4 right-1/2 text-red-300 text-[90px] animate-bounce delay-1500 opacity-75">🃏</div>
          <div className="absolute top-1/2 left-1/4 text-purple-300 text-[100px] animate-pulse delay-2000 opacity-75">💰</div>
          <div className="absolute top-1/6 left-1/2 text-blue-300 text-[80px] animate-spin-slow delay-2500 opacity-75">🎯</div>
          <div className="absolute bottom-1/6 right-1/6 text-orange-300 text-[110px] animate-pulse delay-3000 opacity-85">🏆</div>
          
          {/* Yeni əlavə ornamentlər - BÖYÜK VƏ PARLAQ */}
          <div className="absolute top-2/3 left-1/6 text-pink-300 text-[70px] animate-bounce delay-1000 opacity-70">🌟</div>
          <div className="absolute top-1/5 right-1/5 text-cyan-300 text-[80px] animate-pulse delay-1800 opacity-70">💫</div>
          <div className="absolute bottom-2/3 right-2/3 text-lime-300 text-[70px] animate-spin-slow delay-2200 opacity-70">⭐</div>
          
          {/* Əlavə casino elementləri - BÖYÜK */}
          <div className="absolute top-1/8 left-1/8 text-yellow-200 text-[60px] animate-pulse delay-4000 opacity-60">🎪</div>
          <div className="absolute bottom-1/8 right-1/8 text-red-200 text-[65px] animate-bounce delay-4500 opacity-60">🎊</div>
          <div className="absolute top-5/6 left-5/6 text-purple-200 text-[55px] animate-spin-slow delay-5000 opacity-60">🎭</div>
          
          {/* Çoxlu hərəkətli parıltılar - BÖYÜK VƏ PARLAQ */}
          <div className="absolute top-1/3 left-1/6 w-8 h-8 bg-yellow-300 rounded-full animate-ping opacity-80"></div>
          <div className="absolute bottom-1/3 right-1/6 w-6 h-6 bg-blue-300 rounded-full animate-ping delay-1000 opacity-80"></div>
          <div className="absolute top-2/3 right-1/3 w-10 h-10 bg-green-300 rounded-full animate-ping delay-2000 opacity-80"></div>
          <div className="absolute bottom-2/3 left-2/3 w-8 h-8 bg-red-300 rounded-full animate-ping delay-3000 opacity-80"></div>
          <div className="absolute top-1/5 left-3/4 w-7 h-7 bg-purple-300 rounded-full animate-ping delay-1500 opacity-80"></div>
          <div className="absolute bottom-1/5 right-3/4 w-9 h-9 bg-pink-300 rounded-full animate-ping delay-2500 opacity-80"></div>
          <div className="absolute top-4/5 left-1/5 w-6 h-6 bg-cyan-300 rounded-full animate-ping delay-3500 opacity-80"></div>
          <div className="absolute bottom-4/5 right-1/5 w-8 h-8 bg-orange-300 rounded-full animate-ping delay-4000 opacity-80"></div>
          
          {/* Əlavə kiçik ornamentlər - hər yerdə */}
          <div className="absolute top-1/12 left-1/3 text-yellow-200 text-[40px] animate-pulse delay-5500 opacity-50">🎲</div>
          <div className="absolute top-11/12 right-1/3 text-red-200 text-[45px] animate-bounce delay-6000 opacity-50">🎰</div>
          <div className="absolute top-1/2 left-1/12 text-green-200 text-[35px] animate-spin-slow delay-6500 opacity-50">♠</div>
          <div className="absolute top-1/2 right-1/12 text-blue-200 text-[40px] animate-pulse delay-7000 opacity-50">♥</div>
          
          {/* Minimal gradient overlay - çox az şəffaf */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10"></div>
        </div>
        
        <div className="relative z-10">
          <Header 
            onSearchClick={() => setIsSearchOpen(true)} 
            onPaymentClick={handlePaymentOpen}
          />
          <GameOfTheDay />
          <WinnerTicker />
          <FeaturedGames />
          <GamesGrid />
          <Footer />
          
          <SearchModal 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
          
          <PaymentModal
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            type={paymentType}
          />
          
          <ChatWidget />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;