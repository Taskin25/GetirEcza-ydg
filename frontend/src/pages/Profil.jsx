import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCog,
  FaBoxOpen,
  FaMapMarkedAlt,
  FaCommentDots,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Profil() {
  const { cikisYap } = useAuth();
  const [kullaniciAd, setKullaniciAd] = useState('');
  const kullaniciId = localStorage.getItem('kullaniciId');

  useEffect(() => {
    const fetchKullanici = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/kullanicilar/${kullaniciId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setKullaniciAd(`${res.data.ad} ${res.data.soyad}`);
      } catch (err) {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      }
    };

    if (kullaniciId) {
      fetchKullanici();
    }
  }, [kullaniciId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Sol Menü */}
        <aside className="md:col-span-1 w-full h-[calc(100vh-64px)] bg-white px-8 py-10 text-lg flex flex-col justify-between">
          <div>
            <div className="text-3xl font-extrabold text-gray-900 mb-10 leading-tight">
              Merhaba {kullaniciAd || 'Kullanıcı'} <span className="inline-block">👋</span>
            </div>
            <ul className="space-y-6 text-gray-800 font-medium text-base">
              <Link to="/profil/ayarlar" className="flex items-center gap-4 hover:text-red-600 cursor-pointer">
                <FaUserCog className="text-xl" /> Hesap Ayarları
              </Link>
              <Link to="/profil/siparislerim" className="flex items-center gap-4 hover:text-red-600 cursor-pointer">
                <FaBoxOpen className="text-xl" /> Siparişlerim
              </Link>
              <Link to="/profil/adreslerim" className="flex items-center gap-4 hover:text-red-600 cursor-pointer">
                <FaMapMarkedAlt className="text-xl" /> Gönderim Adreslerim
              </Link>
              <Link to="/profil/yorumlarim" className="flex items-center gap-4 hover:text-red-600 cursor-pointer">
                <FaCommentDots className="text-xl" /> Yorumlarım
              </Link>
            </ul>
          </div>
          <div className="pt-6 border-t">
            <button
              onClick={cikisYap}
              className="flex items-center gap-4 text-gray-800 hover:text-red-600 cursor-pointer"
            >
              <FaSignOutAlt className="text-xl" /> Güvenli Çıkış
            </button>
          </div>
        </aside>

        {/* Sağ İçerik Kutuları */}
        <main className="md:col-span-3 hidden md:grid grid-cols-3 gap-4 p-4 place-items-center">
          {[
            { icon: <FaBoxOpen className="text-4xl" />, label: 'Siparişlerim', to: '/profil/siparislerim' },
            { icon: <FaUserCog className="text-4xl" />, label: 'Hesap Ayarları', to: '/profil/ayarlar' },
            { icon: <FaMapMarkedAlt className="text-4xl" />, label: 'Gönderim Adreslerim', to: '/profil/adreslerim' },
            { icon: <FaCommentDots className="text-4xl" />, label: 'Yorumlarım', to: '/profil/yorumlarim' },
          ].map((item, i) => (
            <Link
              to={item.to}
              key={i}
              className="bg-white hover:shadow-md transition p-8 rounded-lg flex flex-col items-center justify-center text-center gap-6 border h-72 w-full max-w-xs"
            >
              <div className="text-red-600">{item.icon}</div>
              <p className="font-medium text-lg text-gray-800">{item.label}</p>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}
