export interface Game {
  id: number;
  name: string;
  category: 'slots' | 'table' | 'live' | 'jackpot' | 'new';
  image: string;
  provider: string;
  featured?: boolean;
  jackpot?: number;
  rtp?: number;
}

export interface Winner {
  id: number;
  username: string;
  game: string;
  amount: number;
  timestamp: Date;
}