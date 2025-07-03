import React from 'react';
import { Trophy, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-black/90 to-gray-900/90 backdrop-blur-sm text-white relative">
      {/* Casino ornaments in footer */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-4 left-4 text-yellow-400/30 text-4xl animate-pulse">🎰</div>
        <div className="absolute top-4 right-4 text-red-400/30 text-4xl animate-bounce">🎲</div>
        <div className="absolute bottom-4 left-1/4 text-green-400/30 text-3xl animate-spin-slow">♠</div>
        <div className="absolute bottom-4 right-1/4 text-purple-400/30 text-3xl animate-pulse delay-500">♥</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400/20 text-5xl animate-pulse delay-700">👑</div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Company Info - Compact */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-lg">
              <Trophy className="h-5 w-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                QIZIL KAZİNO
              </h3>
              <p className="text-xs text-gray-400">Premium Oyun Təcrübəsi</p>
            </div>
          </div>

          {/* Social Links - Compact (Twitter və Facebook yığışdırıldı) */}
          <div className="flex space-x-2">
            <a href="#" className="bg-gray-800 hover:bg-yellow-500 p-2 rounded-lg transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="bg-gray-800 hover:bg-yellow-500 p-2 rounded-lg transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>

          {/* Quick Links - Compact */}
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              'Oyunlar', 'Canlı', 'Bonus', 'VIP', 
              'Yardım', 'Əlaqə', 'Şərtlər', 'Məxfilik'
            ].map(link => (
              <a key={link} href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-4 pt-3">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs">
            <div className="text-gray-400">
              © 2024 Qızıl Kazino. Malta Oyun Təşkilatı lisenziyalı.
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0 text-gray-400">
              <span>18+</span>
              <span>•</span>
              <span>Məsul Oyna</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;