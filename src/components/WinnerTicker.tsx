import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useRecentWinners } from '../hooks/useApi';

const WinnerTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: recentWinners, loading, error } = useRecentWinners(15);

  useEffect(() => {
    if (recentWinners && recentWinners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % recentWinners.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [recentWinners]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'İndi';
    if (minutes < 60) return `${minutes} dəq əvvəl`;
    const hours = Math.floor(minutes / 60);
    return `${hours} saat əvvəl`;
  };

  if (loading || !recentWinners || recentWinners.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-600/30 via-emerald-500/30 to-green-600/30 backdrop-blur-sm border-y border-green-400/40 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 text-white px-3 py-2 font-medium text-sm uppercase tracking-wide mr-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 animate-bounce" />
                  <span>CANLI</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-white font-medium text-lg">
                    🎉 Qaliblər yüklənir... 🎊 Böyük qazanclar yolda! 🏆 Siz də qazana bilərsiniz!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentWinner = recentWinners[currentIndex];

  return (
    <div className="bg-gradient-to-r from-green-600/30 via-emerald-500/30 to-green-600/30 backdrop-blur-sm border-y border-green-400/40 overflow-hidden">
      <div className="relative">
        {/* Scrolling background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            {/* Breaking News Style Label */}
            <div className="flex-shrink-0 bg-red-500 text-white px-3 py-2 font-medium text-sm uppercase tracking-wide mr-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 animate-bounce" />
                <span>CANLI</span>
              </div>
            </div>
            
            {/* Scrolling Text Container */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-white font-medium text-lg">
                  🎉 {currentWinner.username} qazandı {formatAmount(currentWinner.amount)} - {currentWinner.game} oyununda ({getTimeAgo(currentWinner.timestamp)})
                  <span className="mx-12 text-yellow-300">•</span>
                  {recentWinners[(currentIndex + 1) % recentWinners.length] && (
                    <>
                      🎊 {recentWinners[(currentIndex + 1) % recentWinners.length].username} qazandı {formatAmount(recentWinners[(currentIndex + 1) % recentWinners.length].amount)} - {recentWinners[(currentIndex + 1) % recentWinners.length].game} oyununda
                      <span className="mx-12 text-yellow-300">•</span>
                    </>
                  )}
                  {recentWinners[(currentIndex + 2) % recentWinners.length] && (
                    <>
                      🏆 {recentWinners[(currentIndex + 2) % recentWinners.length].username} qazandı {formatAmount(recentWinners[(currentIndex + 2) % recentWinners.length].amount)} - {recentWinners[(currentIndex + 2) % recentWinners.length].game} oyununda
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerTicker;