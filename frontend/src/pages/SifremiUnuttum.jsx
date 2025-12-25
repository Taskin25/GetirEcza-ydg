import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';

export default function SifremiUnuttum() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate('/kod-onay'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-10">
        <div className="text-center mb-8">
          <FaLock className="text-red-500 text-4xl mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Şifremi Unuttum</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Hesabınızı kurtarmak için e-posta adresinizi girin. Size bir doğrulama kodu göndereceğiz.
          </p>
        </div>

        <form onSubmit={handleSendCode} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta adresiniz</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none text-sm"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
          >
            Kodu Gönder
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          E-posta adresinizle eşleşen bir hesap varsa, kısa sürede size doğrulama kodu gönderilecektir.
        </p>
      </div>
    </div>
  );
}
