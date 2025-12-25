import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Giris() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const navigate = useNavigate();
  const { girisYap } = useAuth(); // ✅ sadece girisYap çağır

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await girisYap({ email, sifre }); // ✅ tek fonksiyon, role kontrolünü içinde yapıyor
      navigate('/anasayfa');
    } catch (err) {
      alert('Giriş başarısız. Email veya şifre hatalı olabilir.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:flex md:w-[45%] items-center justify-center bg-gray-100 p-6">
          <img
            src="https://i.hizliresim.com/mca91sb.png"
            alt="Giriş Görseli"
            className="object-cover w-full h-[400px] rounded-md"
          />
        </div>
        <div className="w-full md:w-[55%] p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Eczane dünyasına hoş geldiniz 👋</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input
                type="password"
                required
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex justify-between text-sm">
              <Link to="/sifre-sifirla" className="text-red-600 hover:underline font-medium">
                Şifremi unuttum?
              </Link>
              <Link to="/kayit" className="text-red-700 hover:text-red-600 font-medium">
                Kayıt Ol
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
