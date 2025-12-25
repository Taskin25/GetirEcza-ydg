// src/pages/SifreKodDogrula.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';

export default function SifreKodDogrula() {
  const [kod, setKod] = useState('');
  const [kodDogru, setKodDogru] = useState(false);
  const [yeniSifre, setYeniSifre] = useState('');
  const [tekrarSifre, setTekrarSifre] = useState('');
  const [bildirim, setBildirim] = useState('');
  const navigate = useNavigate();

  const handleKodOnayla = (e) => {
    e.preventDefault();
    if (kod === '123456') {
      setKodDogru(true);
    } else {
      setBildirim('Kod yanlış. Lütfen tekrar deneyin.');
    }
  };

  const handleSifreKaydet = (e) => {
    e.preventDefault();
    if (yeniSifre !== tekrarSifre) {
      setBildirim('Şifreler uyuşmuyor.');
      return;
    }
    setBildirim('Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...');
    setTimeout(() => navigate('/giris'), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-10">
        <div className="text-center mb-6">
          <FaKey className="text-red-500 text-4xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Şifre Sıfırlama</h2>
          <p className="text-gray-600 text-sm">
            E-posta adresinize gönderilen 6 haneli kodu girin ve şifrenizi sıfırlayın.
          </p>
        </div>

        {bildirim && (
          <div className="mb-4 text-sm text-center text-red-500 font-medium">{bildirim}</div>
        )}

        {!kodDogru ? (
          <form onSubmit={handleKodOnayla} className="space-y-4">
            <input
              type="text"
              placeholder="6 haneli kod"
              className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
              value={kod}
              onChange={(e) => setKod(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold"
            >
              Kodu Onayla
            </button>
          </form>
        ) : (
          <form onSubmit={handleSifreKaydet} className="space-y-4">
            <input
              type="password"
              placeholder="Yeni şifre"
              className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
              value={yeniSifre}
              onChange={(e) => setYeniSifre(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
              value={tekrarSifre}
              onChange={(e) => setTekrarSifre(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold"
            >
              Şifreyi Kaydet
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
