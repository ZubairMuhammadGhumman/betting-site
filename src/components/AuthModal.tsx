import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Zap, Info, AlertCircle } from 'lucide-react';
import ApiService, { TokenManager } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState<'quick' | 'full'>('quick');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'E-mail formatı düzgün deyil'
        }));
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Şifrələr uyğun gəlmir'
        }));
      }
    }

    if (name === 'password' && value) {
      if (value.length < 6) {
        setErrors(prev => ({
          ...prev,
          password: 'Şifrə minimum 6 simvol olmalıdır'
        }));
      }
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Şifrələr uyğun gəlmir'
        }));
      }
    }
  };

  const handleQuickRegister = async () => {
    try {
      setLoading(true);
      setErrors({});

      const response = await ApiService.quickRegister({
        agreeTerms: true
      });

      // Save tokens and user data
      TokenManager.setTokens(response.token, response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');

      onClose();
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleFullRegister = async () => {
    try {
      setLoading(true);
      setErrors({});

      // Validate all fields
      const newErrors: {[key: string]: string} = {};
      
      if (!formData.email) {
        newErrors.email = 'E-mail tələb olunur';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'E-mail formatı düzgün deyil';
      }

      if (!formData.nickname) {
        newErrors.nickname = 'Nickname tələb olunur';
      }

      if (!formData.password) {
        newErrors.password = 'Şifrə tələb olunur';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Şifrə minimum 6 simvol olmalıdır';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifrə təsdiqi tələb olunur';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifrələr uyğun gəlmir';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Şərtləri qəbul etməlisiniz';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const response = await ApiService.register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        agreeTerms: formData.agreeTerms,
        agreeMarketing: formData.agreeMarketing
      });

      // Save tokens and user data
      TokenManager.setTokens(response.token, response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');

      onClose();
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi';
      if (error.response?.data?.error?.details) {
        setErrors(error.response.data.error.details);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrors({});

      if (!formData.email || !formData.password) {
        setErrors({ general: 'E-mail və şifrə tələb olunur' });
        return;
      }

      const response = await ApiService.login({
        email: formData.email,
        password: formData.password
      });

      // Save tokens and user data
      TokenManager.setTokens(response.token, response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');

      onClose();
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Giriş zamanı xəta baş verdi';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/98 backdrop-blur-sm rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">
            {mode === 'login' ? 'Giriş' : 'Qeydiyyat'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          {mode === 'login' ? (
            // Login Form
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700"
                    placeholder="E-mail ünvanınız"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Şifrə
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700"
                    placeholder="Şifrəniz"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? 'Giriş edilir...' : 'Giriş Et'}
              </button>

              <div className="text-center">
                <button
                  onClick={() => onModeChange('register')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  disabled={loading}
                >
                  Hesabınız yoxdur? Qeydiyyatdan keçin
                </button>
              </div>
            </div>
          ) : (
            // Registration Form
            <div className="space-y-5">
              {/* Registration Type Selection */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setRegistrationType('quick')}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    registrationType === 'quick'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>1-Klik</span>
                  </div>
                </button>
                <button
                  onClick={() => setRegistrationType('full')}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    registrationType === 'full'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tam Qeydiyyat
                </button>
              </div>

              {registrationType === 'quick' ? (
                // 1-Click Registration
                <div className="text-center space-y-4">
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                    <Zap className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      1-Klik Qeydiyyat
                    </h3>
                    <div className="flex items-start space-x-2 text-sm text-gray-600 mb-4">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-left">
                        Bu sürətli qeydiyyatdır. Bonus qazanmaq üçün tam qeydiyyatdan keçin.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleQuickRegister}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>{loading ? 'Qeydiyyat edilir...' : 'Dərhal Başla'}</span>
                    </div>
                  </button>
                </div>
              ) : (
                // Full Registration Form
                <>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      E-mail *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="E-mail ünvanınız"
                        required
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{errors.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Nickname *
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 ${
                        errors.nickname ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Oyun adınız"
                      required
                      disabled={loading}
                    />
                    {errors.nickname && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{errors.nickname}</p>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Şifrə *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Şifrəniz (min 6 simvol)"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{errors.password}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Şifrəni Təsdiqlə *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 ${
                          errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Şifrəni təkrarlayın"
                        required
                        disabled={loading}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                      </div>
                    )}
                  </div>

                  {/* Bonus Info */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">200 AZN Bonus qazanma şansı!</p>
                        <p>Bonus çarxı 200 AZN-ə qədər qazanma şansı verir</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-600">
                        <a href="#" className="text-blue-600 hover:text-blue-700">İstifadə Şərtləri</a> və{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Məxfilik Siyasəti</a> ilə razıyam *
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{errors.agreeTerms}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleFullRegister}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed"
                  >
                    {loading ? 'Qeydiyyat edilir...' : 'Tam Qeydiyyat'}
                  </button>
                </>
              )}

              <div className="text-center">
                <button
                  onClick={() => onModeChange('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  disabled={loading}
                >
                  Artıq hesabınız var? Giriş edin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;