import React from 'react';
import { Star, Zap, Trophy, DollarSign } from 'lucide-react';
import ApiService, { TokenManager } from '../services/api';

interface Game {
  id: string;
  name: string;
  category: string;
  provider: string;
  image: string;
  featured: boolean;
  jackpot?: number;
  rtp: number;
  isActive: boolean;
  createdAt: string;
}

interface GameCardProps {
  game: Game;
  size?: 'small' | 'medium' | 'large';
}

const GameCard: React.FC<GameCardProps> = ({ game, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-24 h-28',
    medium: 'w-28 h-32',
    large: 'w-32 h-36'
  };

  const formatJackpot = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return `${amount}`;
  };

  const getCategoryIcon = () => {
    switch (game.category) {
      case 'jackpot':
        return <Trophy className="h-2 w-2 text-yellow-400" />;
      case 'new':
        return <Zap className="h-2 w-2 text-purple-400" />;
      case 'live':
        return <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = () => {
    const badges = {
      jackpot: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      new: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      live: 'bg-red-500/20 text-red-400 border-red-400/30',
      slots: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      table: 'bg-green-500/20 text-green-400 border-green-400/30'
    };

    return badges[game.category as keyof typeof badges] || 'bg-gray-500/20 text-gray-400 border-gray-400/30';
  };

  const handleGameLaunch = async () => {
    try {
      if (!TokenManager.isAuthenticated()) {
        // Show login modal or redirect to login
        alert('Oyunu oynamaq üçün giriş etməlisiniz');
        return;
      }

      const result = await ApiService.launchGame(game.id, 'real');
      
      // Open game in new window/tab
      if (result.gameUrl) {
        window.open(result.gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      }
    } catch (error: any) {
      console.error('Game launch error:', error);
      const errorMessage = error.response?.data?.message || 'Oyun açılarkən xəta baş verdi';
      alert(errorMessage);
    }
  };

  return (
    <div className={`${sizeClasses[size]} group relative cursor-pointer`}>
      <div className="relative h-full bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20 hover:-translate-y-1">
        
        {/* Game Image */}
        <div className="relative h-3/4 overflow-hidden">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback to default image if game image fails to load
              (e.target as HTMLImageElement).src = "/image copy.png";
            }}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={handleGameLaunch}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded-lg font-bold transform scale-95 group-hover:scale-100 transition-transform text-xs"
            >
              Oyna
            </button>
          </div>

          {/* Category Badge */}
          {size !== 'small' && (
            <div className="absolute top-1 left-1">
              <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full border ${getCategoryBadge()} backdrop-blur-sm`}>
                {getCategoryIcon()}
                <span className="text-xs font-bold uppercase">
                  {game.category === 'jackpot' ? 'JP' : 
                   game.category === 'new' ? 'YENİ' :
                   game.category === 'live' ? 'CANLI' :
                   game.category === 'slots' ? 'SLOT' : 'MASA'}
                </span>
              </div>
            </div>
          )}

          {/* Featured Star */}
          {game.featured && (
            <div className="absolute top-1 right-1">
              <div className="bg-yellow-500 p-0.5 rounded-full">
                <Star className="h-2 w-2 text-black fill-current" />
              </div>
            </div>
          )}

          {/* Jackpot Amount */}
          {game.jackpot && size !== 'small' && (
            <div className="absolute bottom-1 right-1">
              <div className="bg-yellow-500/90 text-black px-1.5 py-0.5 rounded-full flex items-center space-x-1">
                <DollarSign className="h-2 w-2" />
                <span className="text-xs font-bold">{formatJackpot(game.jackpot)}</span>
              </div>
            </div>
          )}

          {/* Inactive Game Overlay */}
          {!game.isActive && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded">
                Aktiv Deyil
              </span>
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="p-1.5 h-1/4 flex flex-col justify-center">
          <h3 className="text-white font-medium text-xs leading-tight text-center group-hover:text-yellow-400 transition-colors truncate">
            {game.name}
          </h3>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-yellow-400/10 via-transparent to-transparent"></div>
      </div>
    </div>
  );
};

export default GameCard;