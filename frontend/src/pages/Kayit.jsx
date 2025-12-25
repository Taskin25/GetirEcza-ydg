import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Kayit() {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sifre !== sifreTekrar) {
      alert('Şifreler uyuşmuyor!');
      return;
    }

    try {
      const yeniKullanici = {
        ad,
        soyad,
        email,
        telefon, // ✅ telefon backend'e gönderiliyor
        sifre,
        rol: 'ROLE_USER',
      };

      const response = await api.post('/auth/register', yeniKullanici);
      alert('✅ Kayıt başarılı!');
      navigate('/giris');
    } catch (err) {
      console.error('❌ Kayıt hatası:', err);
      alert('Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:flex md:w-[45%] items-center justify-center bg-gray-100 p-6">
          <img
            src="https://i.hizliresim.com/mca91sb.png"
            alt="Kayıt Görseli"
            className="object-cover w-full h-[400px] rounded-md"
          />
        </div>

        <div className="w-full md:w-[55%] p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Kayıt Ol</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Hemen kaydol, eczane dünyasına katıl 🧴</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                required
                placeholder="Adınız"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                className="w-1/2 border border-gray-300 px-4 py-2 rounded-md text-sm"
              />
              <input
                type="text"
                required
                placeholder="Soyadınız"
                value={soyad}
                onChange={(e) => setSoyad(e.target.value)}
                className="w-1/2 border border-gray-300 px-4 py-2 rounded-md text-sm"
              />
            </div>

            <input
              type="email"
              required
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
            />

            <input
              type="tel"
              required
              placeholder="Telefon Numarası"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
            />

            <input
              type="password"
              required
              placeholder="Şifre"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
            />

            <input
              type="password"
              required
              placeholder="Şifre Tekrar"
              value={sifreTekrar}
              onChange={(e) => setSifreTekrar(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
            >
              Kayıt Ol
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Zaten bir hesabın var mı?{' '}
            <Link to="/giris" className="text-red-600 hover:underline font-semibold">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
