import React from 'react';
import GameCard from './GameCard';
import { Gamepad2 } from 'lucide-react';
import { useGames } from '../hooks/useApi';

const GamesGrid: React.FC = () => {
  const { data: gamesData, loading, error } = useGames({ limit: 80 });

  if (loading) {
    return (
      <section className="py-12 bg-black/5 backdrop-blur-sm" id="games">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Gamepad2 className="h-4 w-4 text-blue-300" />
              <h2 className="text-lg font-medium text-white">Oyunlar</h2>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 justify-items-center">
            {[...Array(40)].map((_, index) => (
              <div key={index} className="w-24 h-28 bg-white/10 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-black/5 backdrop-blur-sm" id="games">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Oyunlar yüklənərkən xəta baş verdi</p>
          </div>
        </div>
      </section>
    );
  }

  const games = gamesData?.data || [];

  return (
    <section className="py-12 bg-black/5 backdrop-blur-sm" id="games">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Gamepad2 className="h-4 w-4 text-blue-300" />
            <h2 className="text-lg font-medium text-white">Oyunlar</h2>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 justify-items-center">
          {games.map(game => (
            <GameCard key={game.id} game={game} size="small" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesGrid;