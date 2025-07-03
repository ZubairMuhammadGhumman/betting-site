import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'az' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  az: {
    // Header
    'header.search.placeholder': 'Oyun axtarın...',
    'header.login': 'Giriş',
    'header.register': 'Qeydiyyat',
    'header.profile': 'Profil',
    'header.balance': 'Balans',
    
    // Auth Modal
    'auth.login.title': 'Giriş',
    'auth.register.title': 'Qeydiyyat',
    'auth.email': 'E-mail',
    'auth.password': 'Şifrə',
    'auth.nickname': 'Nickname',
    'auth.confirmPassword': 'Şifrəni Təsdiqlə',
    'auth.agreeTerms': 'İstifadə Şərtləri və Məxfilik Siyasəti ilə razıyam',
    'auth.loginButton': 'Giriş Et',
    'auth.registerButton': 'Qeydiyyat',
    'auth.quickRegister': '1-Klik Qeydiyyat',
    'auth.fullRegister': 'Tam Qeydiyyat',
    'auth.quickRegisterDesc': 'Bu sürətli qeydiyyatdır. Bonus qazanmaq üçün tam qeydiyyatdan keçin.',
    'auth.startNow': 'Dərhal Başla',
    'auth.bonusInfo': '200 AZN Bonus qazanma şansı!',
    'auth.bonusDesc': 'Bonus çarxı 200 AZN-ə qədər qazanma şansı verir',
    'auth.hasAccount': 'Artıq hesabınız var? Giriş edin',
    'auth.noAccount': 'Hesabınız yoxdur? Qeydiyyatdan keçin',
    'auth.emailPlaceholder': 'E-mail ünvanınız',
    'auth.passwordPlaceholder': 'Şifrəniz',
    'auth.nicknamePlaceholder': 'Oyun adınız',
    'auth.confirmPasswordPlaceholder': 'Şifrəni təkrarlayın',
    
    // Game of the Day
    'gameOfDay.title': 'GÜNÜN OYUNU',
    'gameOfDay.playNow': 'İndi Oyna',
    'gameOfDay.jackpot': 'Cekpot',
    'gameOfDay.rtp': 'RTP',
    'gameOfDay.hot': '🎰 İSTİ!',
    
    // Featured Games
    'featuredGames.title': 'Seçilmiş Oyunlar',
    
    // Games Grid
    'gamesGrid.title': 'Oyunlar',
    'gamesGrid.play': 'Oyna',
    'gamesGrid.inactive': 'Aktiv Deyil',
    
    // Categories
    'category.slots': 'SLOT',
    'category.table': 'MASA',
    'category.live': 'CANLI',
    'category.jackpot': 'JP',
    'category.new': 'YENİ',
    
    // Winner Ticker
    'winners.live': 'CANLI',
    'winners.won': 'qazandı',
    'winners.in': 'oyununda',
    'winners.ago': 'əvvəl',
    'winners.loading': 'Qaliblər yüklənir... 🎊 Böyük qazanclar yolda! 🏆 Siz də qazana bilərsiniz!',
    
    // Payment Modal
    'payment.deposit': 'Depozit',
    'payment.withdraw': 'Çıxarış',
    'payment.selectMethod': 'Ödəniş üsulunu seçin',
    'payment.amount': 'Məbləğ (AZN)',
    'payment.cardNumber': 'Kart Nömrəsi',
    'payment.expiryDate': 'Son İstifadə',
    'payment.cvv': 'CVV',
    'payment.saveCard': 'Kartı gələcək istifadə üçün saxla',
    'payment.confirm': 'Təsdiqlə',
    'payment.back': 'Geri',
    'payment.processing': 'Emal edilir...',
    'payment.success': 'Uğurlu!',
    'payment.close': 'Bağla',
    'payment.savedCards': 'Saxlanmış Kartlar',
    'payment.addNewCard': 'və ya yeni kart əlavə edin',
    'payment.readyToUse': 'Hazır istifadə üçün',
    'payment.minimum': 'Minimum',
    'payment.maximum': 'Maksimum',
    'payment.c2cInstructions': 'C2C Transfer Təlimatları',
    'payment.c2cDesc': 'Məbləği təsdiqləyəndən sonra transfer təlimatları göstəriləcək.',
    'payment.depositSuccess': 'Depozit Uğurlu!',
    'payment.withdrawSuccess': 'Çıxarış Uğurlu!',
    'payment.transactionId': 'Əməliyyat ID',
    
    // User Profile
    'profile.title': 'Profil',
    'profile.history': 'Tarixçə',
    'profile.level': 'Səviyyə',
    'profile.balance': 'Balans',
    'profile.levelProgress': 'Səviyyə İrəliləyişi',
    'profile.totalDeposits': 'Ümumi Depozit',
    'profile.totalWithdrawals': 'Ümumi Çıxarış',
    'profile.settings': 'Tənzimləmələr',
    'profile.logout': 'Çıxış',
    'profile.close': 'Bağla',
    'profile.emptyHistory': 'Tarixçə Boşdur',
    'profile.noTransactions': 'Hələ heç bir əməliyyat yoxdur',
    'profile.completed': 'Tamamlandı',
    'profile.pending': 'Gözləyir',
    'profile.failed': 'Uğursuz',
    'profile.loggingOut': 'Çıxış edilir...',
    
    // Levels
    'level.beginner': 'Yeni Başlayan',
    'level.bronze': 'Bronz',
    'level.silver': 'Gümüş',
    'level.gold': 'Qızıl',
    'level.platinum': 'Platin',
    'level.diamond': 'Almaz',
    'level.vip': 'VIP',
    
    // Chat Widget
    'chat.liveSupport': 'Canlı Dəstək',
    'chat.online': 'Onlayn',
    'chat.whatsapp': 'WhatsApp ilə yazın',
    'chat.placeholder': 'Mesajınızı yazın...',
    'chat.greeting': 'Salam! Sizə necə kömək edə bilərəm?',
    'chat.response': 'Təşəkkür edirəm! Dəstək komandamız tezliklə sizinlə əlaqə saxlayacaq.',
    'chat.whatsappAlt': 'və ya WhatsApp ilə yazın',
    
    // Footer
    'footer.company': 'QIZIL KAZİNO',
    'footer.tagline': 'Premium Oyun Təcrübəsi',
    'footer.games': 'Oyunlar',
    'footer.live': 'Canlı',
    'footer.bonus': 'Bonus',
    'footer.vip': 'VIP',
    'footer.help': 'Yardım',
    'footer.contact': 'Əlaqə',
    'footer.terms': 'Şərtlər',
    'footer.privacy': 'Məxfilik',
    'footer.copyright': '© 2024 Qızıl Kazino. Malta Oyun Təşkilatı lisenziyalı.',
    'footer.ageRestriction': '18+',
    'footer.responsibleGaming': 'Məsul Oyna',
    
    // Search Modal
    'search.title': 'Oyun Axtarışı',
    'search.placeholder': 'Oyun adı və ya provayder axtarın...',
    'search.searchGames': 'Oyun Axtarın',
    'search.searchDesc': 'Oyun adı və ya provayder adı yazın',
    'search.noResults': 'Oyun tapılmadı',
    'search.noResultsDesc': 'üçün nəticə yoxdur',
    'search.clearSearch': 'Axtarışı Təmizlə',
    
    // Banner
    'banner.title': 'Böyük Qazanc',
    'banner.subtitle': 'Qızıl Kazino',
    'banner.description': '1000+ oyun, canlı dilerlərlə və böyük cekpotlarla premium oyun həyəcanını yaşayın.',
    'banner.getBonus': '100% Bonus Al',
    'banner.playNow': 'İndi Oyna',
    'banner.jackpot': '50M+ Cekpot',
    'banner.dailyBonus': 'Gündəlik Bonuslar',
    'banner.instantPayouts': 'Ani Ödənişlər',
    'banner.joinPlayers': '500,000+ Oyunçuya Qoşul',
    'banner.startJourney': 'Qazanc səyahətinə bu gün başla',
    'banner.bonus200': '+200% Bonus',
    
    // Common
    'common.loading': 'Yüklənir...',
    'common.error': 'Xəta baş verdi',
    'common.retry': 'Yenidən cəhd et',
    'common.cancel': 'Ləğv et',
    'common.save': 'Saxla',
    'common.delete': 'Sil',
    'common.edit': 'Redaktə et',
    'common.view': 'Bax',
    'common.yes': 'Bəli',
    'common.no': 'Xeyr',
    'common.ok': 'Tamam',
    'common.required': 'Tələb olunur',
    'common.optional': 'İstəyə bağlı',
    
    // Time
    'time.now': 'İndi',
    'time.minutesAgo': 'dəq əvvəl',
    'time.hoursAgo': 'saat əvvəl',
    'time.daysAgo': 'gün əvvəl',
    
    // Errors
    'error.emailRequired': 'E-mail tələb olunur',
    'error.emailInvalid': 'E-mail formatı düzgün deyil',
    'error.passwordRequired': 'Şifrə tələb olunur',
    'error.passwordMinLength': 'Şifrə minimum 6 simvol olmalıdır',
    'error.passwordMismatch': 'Şifrələr uyğun gəlmir',
    'error.nicknameRequired': 'Nickname tələb olunur',
    'error.termsRequired': 'Şərtləri qəbul etməlisiniz',
    'error.amountRequired': 'Düzgün məbləğ daxil edin',
    'error.cardDetailsRequired': 'Bütün kart məlumatlarını daxil edin',
    'error.loginRequired': 'Oyunu oynamaq üçün giriş etməlisiniz',
    'error.gameLoadFailed': 'Oyun açılarkən xəta baş verdi',
    'error.paymentFailed': 'Ödəniş zamanı xəta baş verdi',
    'error.registrationFailed': 'Qeydiyyat zamanı xəta baş verdi',
    'error.loginFailed': 'Giriş zamanı xəta baş verdi',
    'error.featuredGamesFailed': 'Seçilmiş oyunlar yüklənərkən xəta baş verdi',
    'error.gamesFailed': 'Oyunlar yüklənərkən xəta baş verdi',
    'error.profileLoading': 'Profil yüklənir...',
  },
  en: {
    // Header
    'header.search.placeholder': 'Search games...',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.profile': 'Profile',
    'header.balance': 'Balance',
    
    // Auth Modal
    'auth.login.title': 'Login',
    'auth.register.title': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.nickname': 'Nickname',
    'auth.confirmPassword': 'Confirm Password',
    'auth.agreeTerms': 'I agree to Terms of Service and Privacy Policy',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.quickRegister': '1-Click Register',
    'auth.fullRegister': 'Full Registration',
    'auth.quickRegisterDesc': 'This is quick registration. Complete full registration to earn bonuses.',
    'auth.startNow': 'Start Now',
    'auth.bonusInfo': 'Chance to win 200 AZN Bonus!',
    'auth.bonusDesc': 'Bonus wheel gives you a chance to win up to 200 AZN',
    'auth.hasAccount': 'Already have an account? Login',
    'auth.noAccount': 'Don\'t have an account? Register',
    'auth.emailPlaceholder': 'Your email address',
    'auth.passwordPlaceholder': 'Your password',
    'auth.nicknamePlaceholder': 'Your gaming name',
    'auth.confirmPasswordPlaceholder': 'Repeat password',
    
    // Game of the Day
    'gameOfDay.title': 'GAME OF THE DAY',
    'gameOfDay.playNow': 'Play Now',
    'gameOfDay.jackpot': 'Jackpot',
    'gameOfDay.rtp': 'RTP',
    'gameOfDay.hot': '🎰 HOT!',
    
    // Featured Games
    'featuredGames.title': 'Featured Games',
    
    // Games Grid
    'gamesGrid.title': 'Games',
    'gamesGrid.play': 'Play',
    'gamesGrid.inactive': 'Inactive',
    
    // Categories
    'category.slots': 'SLOTS',
    'category.table': 'TABLE',
    'category.live': 'LIVE',
    'category.jackpot': 'JP',
    'category.new': 'NEW',
    
    // Winner Ticker
    'winners.live': 'LIVE',
    'winners.won': 'won',
    'winners.in': 'in',
    'winners.ago': 'ago',
    'winners.loading': 'Loading winners... 🎊 Big wins coming! 🏆 You can win too!',
    
    // Payment Modal
    'payment.deposit': 'Deposit',
    'payment.withdraw': 'Withdraw',
    'payment.selectMethod': 'Select payment method',
    'payment.amount': 'Amount (AZN)',
    'payment.cardNumber': 'Card Number',
    'payment.expiryDate': 'Expiry Date',
    'payment.cvv': 'CVV',
    'payment.saveCard': 'Save card for future use',
    'payment.confirm': 'Confirm',
    'payment.back': 'Back',
    'payment.processing': 'Processing...',
    'payment.success': 'Success!',
    'payment.close': 'Close',
    'payment.savedCards': 'Saved Cards',
    'payment.addNewCard': 'or add new card',
    'payment.readyToUse': 'Ready to use',
    'payment.minimum': 'Minimum',
    'payment.maximum': 'Maximum',
    'payment.c2cInstructions': 'C2C Transfer Instructions',
    'payment.c2cDesc': 'Transfer instructions will be shown after confirming the amount.',
    'payment.depositSuccess': 'Deposit Successful!',
    'payment.withdrawSuccess': 'Withdrawal Successful!',
    'payment.transactionId': 'Transaction ID',
    
    // User Profile
    'profile.title': 'Profile',
    'profile.history': 'History',
    'profile.level': 'Level',
    'profile.balance': 'Balance',
    'profile.levelProgress': 'Level Progress',
    'profile.totalDeposits': 'Total Deposits',
    'profile.totalWithdrawals': 'Total Withdrawals',
    'profile.settings': 'Settings',
    'profile.logout': 'Logout',
    'profile.close': 'Close',
    'profile.emptyHistory': 'History Empty',
    'profile.noTransactions': 'No transactions yet',
    'profile.completed': 'Completed',
    'profile.pending': 'Pending',
    'profile.failed': 'Failed',
    'profile.loggingOut': 'Logging out...',
    
    // Levels
    'level.beginner': 'Beginner',
    'level.bronze': 'Bronze',
    'level.silver': 'Silver',
    'level.gold': 'Gold',
    'level.platinum': 'Platinum',
    'level.diamond': 'Diamond',
    'level.vip': 'VIP',
    
    // Chat Widget
    'chat.liveSupport': 'Live Support',
    'chat.online': 'Online',
    'chat.whatsapp': 'Write on WhatsApp',
    'chat.placeholder': 'Type your message...',
    'chat.greeting': 'Hello! How can I help you?',
    'chat.response': 'Thank you! Our support team will contact you soon.',
    'chat.whatsappAlt': 'or write on WhatsApp',
    
    // Footer
    'footer.company': 'GOLDEN CASINO',
    'footer.tagline': 'Premium Gaming Experience',
    'footer.games': 'Games',
    'footer.live': 'Live',
    'footer.bonus': 'Bonus',
    'footer.vip': 'VIP',
    'footer.help': 'Help',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.copyright': '© 2024 Golden Casino. Licensed by Malta Gaming Authority.',
    'footer.ageRestriction': '18+',
    'footer.responsibleGaming': 'Play Responsibly',
    
    // Search Modal
    'search.title': 'Game Search',
    'search.placeholder': 'Search game name or provider...',
    'search.searchGames': 'Search Games',
    'search.searchDesc': 'Enter game name or provider name',
    'search.noResults': 'No games found',
    'search.noResultsDesc': 'for',
    'search.clearSearch': 'Clear Search',
    
    // Banner
    'banner.title': 'Big Wins',
    'banner.subtitle': 'Golden Casino',
    'banner.description': 'Experience premium gaming excitement with 1000+ games, live dealers and huge jackpots.',
    'banner.getBonus': 'Get 100% Bonus',
    'banner.playNow': 'Play Now',
    'banner.jackpot': '50M+ Jackpot',
    'banner.dailyBonus': 'Daily Bonuses',
    'banner.instantPayouts': 'Instant Payouts',
    'banner.joinPlayers': 'Join 500,000+ Players',
    'banner.startJourney': 'Start your winning journey today',
    'banner.bonus200': '+200% Bonus',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.required': 'Required',
    'common.optional': 'Optional',
    
    // Time
    'time.now': 'Now',
    'time.minutesAgo': 'min ago',
    'time.hoursAgo': 'hours ago',
    'time.daysAgo': 'days ago',
    
    // Errors
    'error.emailRequired': 'Email is required',
    'error.emailInvalid': 'Email format is invalid',
    'error.passwordRequired': 'Password is required',
    'error.passwordMinLength': 'Password must be at least 6 characters',
    'error.passwordMismatch': 'Passwords do not match',
    'error.nicknameRequired': 'Nickname is required',
    'error.termsRequired': 'You must accept the terms',
    'error.amountRequired': 'Enter valid amount',
    'error.cardDetailsRequired': 'Enter all card details',
    'error.loginRequired': 'You must login to play the game',
    'error.gameLoadFailed': 'Error occurred while loading game',
    'error.paymentFailed': 'Error occurred during payment',
    'error.registrationFailed': 'Error occurred during registration',
    'error.loginFailed': 'Error occurred during login',
    'error.featuredGamesFailed': 'Error loading featured games',
    'error.gamesFailed': 'Error loading games',
    'error.profileLoading': 'Loading profile...',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'az';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};