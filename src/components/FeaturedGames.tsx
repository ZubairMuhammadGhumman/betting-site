import React from 'react';
import GameCard from './GameCard';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeaturedGames } from '../hooks/useApi';

const FeaturedGames: React.FC = () => {
  const { t } = useLanguage();
  const { data: featuredGames, loading, error } = useFeaturedGames();

  if (loading) {
    return (
      <section className="py-8 bg-black/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <h2 className="text-lg font-medium text-white">{t('featuredGames.title')}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-28 h-32 bg-white/10 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-black/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">{t('error.featuredGamesFailed')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Sort games alphabetically
  const sortedGames = featuredGames ? [...featuredGames].sort((a, b) => a.name.localeCompare(b.name, 'az-AZ')) : [];

  return (
    <section className="py-8 bg-black/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Star className="h-4 w-4 text-yellow-300 fill-current" />
            <h2 className="text-lg font-medium text-white">{t('featuredGames.title')}</h2>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
          {sortedGames.map(game => (
            <GameCard key={game.id} game={game} size="medium" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;