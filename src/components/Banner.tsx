import React from 'react';
import { Trophy, Gift, Zap } from 'lucide-react';

const Banner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Böyük Qazanc
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Qızıl Kazino
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              1000+ oyun, canlı dilerlərlə və böyük cekpotlarla premium oyun həyəcanını yaşayın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl">
                100% Bonus Al
              </button>
              <button className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-xl font-bold text-lg transition-all">
                İndi Oyna
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-sm font-semibold">50M+ Cekpot</p>
              </div>
              <div className="text-center">
                <div className="bg-green-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-sm font-semibold">Gündəlik Bonuslar</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-sm font-semibold">Ani Ödənişlər</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-black/40 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20">
              <img 
                src="https://images.pexels.com/photos/4193099/pexels-photo-4193099.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Kazino oyunları"
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">500,000+ Oyunçuya Qoşul</h3>
                <p className="text-gray-300">Qazanc səyahətinə bu gün başla</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold animate-bounce">
              🎰 İSTİ!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-black px-4 py-2 rounded-full font-bold animate-pulse">
              💰 +200% Bonus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;