import { Game } from '../types/Game';

// Yeni kazino şəkli - bütün oyunlar üçün eyni şəkil
const GAME_IMAGE = "/image copy.png";

export const games: Game[] = [
  // Champion Casino CHC Games
  { id: 1, name: "Book of Ra Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", featured: true, rtp: 95.1 },
  { id: 2, name: "Lucky Lady's Charm", category: "slots", image: GAME_IMAGE, provider: "Novomatic", featured: true, rtp: 95.1 },
  { id: 3, name: "Sizzling Hot Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", featured: true, rtp: 95.7 },
  { id: 4, name: "Columbus Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", featured: true, rtp: 95.0 },
  { id: 5, name: "Dolphin's Pearl Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", featured: true, rtp: 95.1 },

  // More Champion Casino Games
  { id: 6, name: "Lord of the Ocean", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.1 },
  { id: 7, name: "Banana Splash", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 8, name: "Gryphon's Gold Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.1 },
  { id: 9, name: "Pharaoh's Gold III", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 10, name: "Roaring Forties", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.5 },
  
  { id: 11, name: "Ultra Hot Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.2 },
  { id: 12, name: "Faust", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.1 },
  { id: 13, name: "Katana", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 14, name: "Sharky", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 15, name: "Power Stars", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.5 },

  { id: 16, name: "Mega Joker", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 17, name: "Beetle Mania Deluxe", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 18, name: "Xtra Hot", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.7 },
  { id: 19, name: "Fruits 'n Sevens", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },
  { id: 20, name: "Golden Sevens", category: "slots", image: GAME_IMAGE, provider: "Novomatic", rtp: 95.0 },

  // Table Games
  { id: 21, name: "European Roulette", category: "table", image: GAME_IMAGE, provider: "Evolution", rtp: 97.3 },
  { id: 22, name: "American Roulette", category: "table", image: GAME_IMAGE, provider: "Evolution", rtp: 94.7 },
  { id: 23, name: "Blackjack Classic", category: "table", image: GAME_IMAGE, provider: "Evolution", rtp: 99.5 },
  { id: 24, name: "Baccarat Pro", category: "table", image: GAME_IMAGE, provider: "Evolution", rtp: 98.9 },
  { id: 25, name: "Poker Three Card", category: "table", image: GAME_IMAGE, provider: "Evolution", rtp: 96.6 },

  // Live Games
  { id: 26, name: "Live Blackjack", category: "live", image: GAME_IMAGE, provider: "Evolution", rtp: 99.5 },
  { id: 27, name: "Live Roulette", category: "live", image: GAME_IMAGE, provider: "Evolution", rtp: 97.3 },
  { id: 28, name: "Live Baccarat", category: "live", image: GAME_IMAGE, provider: "Evolution", rtp: 98.9 },
  { id: 29, name: "Dream Catcher", category: "live", image: GAME_IMAGE, provider: "Evolution", rtp: 96.6 },
  { id: 30, name: "Lightning Roulette", category: "live", image: GAME_IMAGE, provider: "Evolution", rtp: 97.3 },

  // Jackpot Games
  { id: 31, name: "Mega Moolah", category: "jackpot", image: GAME_IMAGE, provider: "Microgaming", jackpot: 12500000, rtp: 96.5 },
  { id: 32, name: "Divine Fortune", category: "jackpot", image: GAME_IMAGE, provider: "NetEnt", jackpot: 250000, rtp: 96.6 },
  { id: 33, name: "Hall of Gods", category: "jackpot", image: GAME_IMAGE, provider: "NetEnt", jackpot: 180000, rtp: 95.7 },
  { id: 34, name: "Arabian Nights", category: "jackpot", image: GAME_IMAGE, provider: "NetEnt", jackpot: 95000, rtp: 95.6 },
  { id: 35, name: "Major Millions", category: "jackpot", image: GAME_IMAGE, provider: "Microgaming", jackpot: 450000, rtp: 89.4 },

  // New Games
  { id: 36, name: "Sweet Bonanza", category: "new", image: GAME_IMAGE, provider: "Pragmatic Play", rtp: 96.5 },
  { id: 37, name: "Gates of Olympus", category: "new", image: GAME_IMAGE, provider: "Pragmatic Play", rtp: 96.5 },
  { id: 38, name: "Wolf Gold", category: "new", image: GAME_IMAGE, provider: "Pragmatic Play", rtp: 96.0 },
  { id: 39, name: "Big Bass Bonanza", category: "new", image: GAME_IMAGE, provider: "Pragmatic Play", rtp: 96.7 },
  { id: 40, name: "The Dog House", category: "new", image: GAME_IMAGE, provider: "Pragmatic Play", rtp: 96.5 },

  // Additional Popular Slots
  { id: 41, name: "Starburst", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.1 },
  { id: 42, name: "Gonzo's Quest", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 95.9 },
  { id: 43, name: "Book of Dead", category: "slots", image: GAME_IMAGE, provider: "Play'n GO", rtp: 94.2 },
  { id: 44, name: "Reactoonz", category: "slots", image: GAME_IMAGE, provider: "Play'n GO", rtp: 96.5 },
  { id: 45, name: "Dead or Alive 2", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.8 },

  { id: 46, name: "Jammin' Jars", category: "slots", image: GAME_IMAGE, provider: "Push Gaming", rtp: 96.8 },
  { id: 47, name: "Fire Joker", category: "slots", image: GAME_IMAGE, provider: "Play'n GO", rtp: 96.2 },
  { id: 48, name: "Immortal Romance", category: "slots", image: GAME_IMAGE, provider: "Microgaming", rtp: 96.9 },
  { id: 49, name: "Thunderstruck II", category: "slots", image: GAME_IMAGE, provider: "Microgaming", rtp: 96.6 },
  { id: 50, name: "Twin Spin", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.6 },

  { id: 51, name: "Jack and the Beanstalk", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.3 },
  { id: 52, name: "Bloodsuckers", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 98.0 },
  { id: 53, name: "Fruit Shop", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.7 },
  { id: 54, name: "Steam Tower", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 97.0 },
  { id: 55, name: "Space Wars", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.8 },

  { id: 56, name: "Aliens", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.4 },
  { id: 57, name: "Planet of the Apes", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.3 },
  { id: 58, name: "Vikings Go Berzerk", category: "slots", image: GAME_IMAGE, provider: "Yggdrasil", rtp: 96.1 },
  { id: 59, name: "Valley of the Gods", category: "slots", image: GAME_IMAGE, provider: "Yggdrasil", rtp: 96.2 },
  { id: 60, name: "Joker Pro", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.8 },

  { id: 61, name: "Butterfly Staxx", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.8 },
  { id: 62, name: "Neon Staxx", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.9 },
  { id: 63, name: "Dazzle Me", category: "slots", image: GAME_IMAGE, provider: "NetEnt", rtp: 96.9 }
];