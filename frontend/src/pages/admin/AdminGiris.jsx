import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminGiris() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const { girisYap } = useAuth(); //  sadece girisYap kullan

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    try {
      await girisYap({ email, sifre }); // token kaydı ve role kontrolü context içinde yapılıyor
      navigate('/admin/panel'); // giriş başarılıysa admin paneline yönlendir
    } catch (err) {
      console.error('❌ Admin giriş hatası:', err);
      setHata('E-posta veya şifre hatalı!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Admin Girişi</h2>

        {hata && <p className="text-red-500 text-sm mb-4">{hata}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-1">Şifre</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
