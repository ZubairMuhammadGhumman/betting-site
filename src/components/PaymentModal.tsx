import React, { useState } from 'react';
import { X, CreditCard, Wallet, ArrowUpCircle, ArrowDownCircle, Check, AlertCircle } from 'lucide-react';
import ApiService from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, type }) => {
  const [selectedMethod, setSelectedMethod] = useState<'visa' | 'mastercard' | 'c2c' | null>(null);
  const [selectedSavedCard, setSelectedSavedCard] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'success'>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');

  const handleMethodSelect = (method: 'visa' | 'mastercard' | 'c2c') => {
    setSelectedMethod(method);
    setSelectedSavedCard(null);
    setStep('details');
    setError(null);
  };

  const handleSavedCardSelect = (card: any) => {
    setSelectedMethod(card.type);
    setSelectedSavedCard(card);
    setCardNumber(`•••• •••• •••• ${card.lastFour}`);
    setExpiryDate(card.expiryDate);
    setStep('details');
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const amountNum = parseFloat(amount);
      if (!amountNum || amountNum <= 0) {
        setError('Düzgün məbləğ daxil edin');
        return;
      }

      const paymentData: any = {
        amount: amountNum,
        paymentMethod: selectedMethod,
        wallet: 'chcblack' // Default wallet
      };

      if (selectedMethod !== 'c2c') {
        if (!cardNumber || !expiryDate || !cvv) {
          setError('Bütün kart məlumatlarını daxil edin');
          return;
        }
        
        paymentData.cardNumber = cardNumber.replace(/\s/g, '');
        paymentData.expiryDate = expiryDate;
        paymentData.cvv = cvv;
        paymentData.saveCard = saveCard;
      }

      let result;
      if (type === 'deposit') {
        result = await ApiService.createDeposit(paymentData);
      } else {
        paymentData.accountHolder = 'User Name'; // You might want to get this from user profile
        result = await ApiService.createWithdrawal(paymentData);
      }

      setTransactionResult(result);

      // Save card if requested and not already saved
      if (saveCard && cardNumber && !selectedSavedCard && selectedMethod !== 'c2c') {
        const newCard = {
          id: Date.now(),
          type: selectedMethod,
          lastFour: cardNumber.slice(-4),
          expiryDate
        };
        const updatedCards = [...savedCards, newCard];
        localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      }

      // If payment URL is provided, redirect to payment gateway
      if (result.paymentUrl) {
        window.open(result.paymentUrl, '_blank');
      }

      setStep('success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ödəniş zamanı xəta baş verdi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('method');
    setSelectedMethod(null);
    setSelectedSavedCard(null);
    setAmount('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setSaveCard(false);
    setError(null);
    setTransactionResult(null);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    window.location.reload(); // Refresh to update balance
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return (
          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-8 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">MC</span>
          </div>
        );
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {type === 'deposit' ? (
              <ArrowUpCircle className="h-6 w-6 text-green-500" />
            ) : (
              <ArrowDownCircle className="h-6 w-6 text-orange-500" />
            )}
            <h2 className="text-2xl font-bold text-gray-800">
              {type === 'deposit' ? 'Depozit' : 'Çıxarış'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Ödəniş üsulunu seçin
              </h3>

              {/* Saved Cards - Enhanced Display */}
              {savedCards.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Saxlanmış Kartlar</span>
                  </h4>
                  {savedCards.map((card: any) => (
                    <button
                      key={card.id}
                      onClick={() => handleSavedCardSelect(card)}
                      className="w-full flex items-center space-x-4 p-4 border-2 border-blue-200 bg-blue-50 rounded-xl hover:border-blue-400 hover:bg-blue-100 transition-all group"
                    >
                      <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        {getCardIcon(card.type)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">
                          {card.type.toUpperCase()} •••• {card.lastFour}
                        </p>
                        <p className="text-sm text-gray-600">{card.expiryDate}</p>
                        <p className="text-xs text-green-600 font-medium">Hazır istifadə üçün</p>
                      </div>
                      <div className="text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <p className="text-sm text-gray-500 text-center mb-3">və ya yeni kart əlavə edin</p>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-3">
                <button
                  onClick={() => handleMethodSelect('visa')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors group"
                >
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    {getCardIcon('visa')}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-800">Visa</h4>
                    <p className="text-sm text-gray-500">Kredit/Debit Kart</p>
                    <p className="text-xs text-green-600 font-medium">Min: 10 AZN</p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect('mastercard')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors group"
                >
                  <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                    {getCardIcon('mastercard')}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-800">Mastercard</h4>
                    <p className="text-sm text-gray-500">Kredit/Debit Kart</p>
                    <p className="text-xs text-green-600 font-medium">Min: 10 AZN</p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect('c2c')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors group"
                >
                  <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                    <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-800">C2C Transfer</h4>
                    <p className="text-sm text-gray-500">Kart-Karta Köçürmə</p>
                    <p className="text-xs text-green-600 font-medium">Min: 5 AZN</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`p-2 rounded-lg ${
                  selectedMethod === 'visa' ? 'bg-blue-100' :
                  selectedMethod === 'mastercard' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {selectedMethod === 'c2c' ? (
                    <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    getCardIcon(selectedMethod!)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedMethod?.toUpperCase()} {type === 'deposit' ? 'Depozit' : 'Çıxarış'}
                  </h3>
                  {selectedSavedCard && (
                    <p className="text-sm text-blue-600">Saxlanmış kart istifadə edilir</p>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Məbləğ (AZN)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min={selectedMethod === 'c2c' ? "5" : "10"}
                  max={type === 'withdraw' ? "10000" : "50000"}
                  disabled={loading}
                />
                {type === 'deposit' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: {selectedMethod === 'c2c' ? '5' : '10'} AZN, Maksimum: 50,000 AZN
                  </p>
                )}
                {type === 'withdraw' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: {selectedMethod === 'c2c' ? '5' : '10'} AZN, Maksimum: 10,000 AZN
                  </p>
                )}
              </div>

              {selectedMethod !== 'c2c' && (
                <>
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kart Nömrəsi
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => !selectedSavedCard && setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        selectedSavedCard ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      readOnly={!!selectedSavedCard}
                      disabled={loading}
                    />
                    {selectedSavedCard && (
                      <p className="text-xs text-blue-600 mt-1">Saxlanmış kart məlumatları istifadə edilir</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Son İstifadə
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          if (!selectedSavedCard) {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            setExpiryDate(value);
                          }
                        }}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          selectedSavedCard ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="MM/YY"
                        maxLength={5}
                        readOnly={!!selectedSavedCard}
                        disabled={loading}
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        maxLength={3}
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">Təhlükəsizlik üçün CVV həmişə tələb olunur</p>
                    </div>
                  </div>

                  {/* Save Card - Only for new cards */}
                  {!selectedSavedCard && (
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">
                        Kartı gələcək istifadə üçün saxla
                      </span>
                    </label>
                  )}
                </>
              )}

              {selectedMethod === 'c2c' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">C2C Transfer Təlimatları</p>
                      <p>Məbləği təsdiqləyəndən sonra transfer təlimatları göstəriləcək.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                  disabled={loading}
                >
                  Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !amount || (selectedMethod !== 'c2c' && (!cardNumber || !expiryDate || !cvv))}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
                >
                  {loading ? 'Emal edilir...' : 'Təsdiqlə'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="bg-green-100 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {type === 'deposit' ? 'Depozit Uğurlu!' : 'Çıxarış Uğurlu!'}
              </h3>
              <p className="text-gray-600">
                {amount} AZN məbləğində {type === 'deposit' ? 'depozit' : 'çıxarış'} uğurla yaradıldı.
              </p>
              {transactionResult?.transactionId && (
                <p className="text-sm text-gray-500">
                  Əməliyyat ID: {transactionResult.transactionId}
                </p>
              )}
              <button
                onClick={handleSuccess}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Bağla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;