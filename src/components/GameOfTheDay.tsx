import React, { useState, useEffect } from 'react';
import { Play, Star } from 'lucide-react';

const gamesOfTheDay = [
  {
    id: 1,
    name: "Mega Moolah",
    description: "Ən böyük cekpotlu slot oyunu",
    image: "/image copy.png",
    jackpot: "12.5M AZN",
    rtp: "96.5%"
  },
  {
    id: 2,
    name: "Lightning Roulette",
    description: "Canlı diler ilə elektrikləşdirici rulet",
    image: "/image copy.png",
    jackpot: "Canlı",
    rtp: "97.3%"
  },
  {
    id: 3,
    name: "Sweet Bonanza",
    description: "Şirin meyvələrlə dolu slot oyunu",
    image: "/image copy.png",
    jackpot: "Yeni",
    rtp: "96.5%"
  }
];

const GameOfTheDay: React.FC = () => {
  const [currentGame, setCurrentGame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGame(prev => (prev + 1) % gamesOfTheDay.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const game = gamesOfTheDay[currentGame];

  return (
    <div className="relative bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 backdrop-blur-sm overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <span className="text-yellow-300 font-medium">GÜNÜN OYUNU</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-semibold mb-3 leading-tight">
              {game.name}
            </h2>
            
            <p className="text-lg text-gray-100 mb-4 leading-relaxed font-light">
              {game.description}
            </p>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-xl font-semibold text-yellow-300">{game.jackpot}</div>
                <div className="text-xs text-gray-300">Cekpot</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-300">{game.rtp}</div>
                <div className="text-xs text-gray-300">RTP</div>
              </div>
            </div>

            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-6 py-3 rounded-xl font-medium text-black transition-all transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 shadow-lg">
              <Play className="h-4 w-4" />
              <span>İndi Oyna</span>
            </button>
          </div>

          {/* Game Image */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-black/30 to-transparent backdrop-blur-sm rounded-xl p-4 border border-yellow-300/30 shadow-2xl">
              <img 
                src={game.image}
                alt={game.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full font-medium animate-bounce shadow-lg text-sm">
              🎰 İSTİ!
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {gamesOfTheDay.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGame(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentGame ? 'bg-yellow-300' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameOfTheDay;