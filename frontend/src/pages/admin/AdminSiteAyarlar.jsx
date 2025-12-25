import { useEffect, useState } from 'react';
import {
  FaSave, FaGlobe, FaUserPlus, FaUserEdit, FaLock
} from 'react-icons/fa';
import api from '../../api';

export default function AdminSiteAyarlar() {
  const [siteAyar, setSiteAyar] = useState({
    baslik: 'Eczane Uygulaması',
    logo: 'https://i.hizliresim.com/mca91sb.png'
  });

  const [yeniAdmin, setYeniAdmin] = useState({
    ad: '', soyad: '', email: '', sifre: '', telefon: ''
  });

  const [adminBilgi, setAdminBilgi] = useState(null);
  const [guncelAdminBilgi, setGuncelAdminBilgi] = useState({
    ad: '', soyad: '', email: '', sifre: '', telefon: ''
  });

  const [mesaj, setMesaj] = useState('');
  const [emailHata, setEmailHata] = useState('');
  const token = localStorage.getItem('token');
  const adminId = localStorage.getItem('kullaniciId');

  useEffect(() => {
    fetchAdminBilgi();
  }, []);

const fetchAdminBilgi = async () => {
  try {
    const res = await api.get(`/kullanicilar/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAdminBilgi(res.data);
    setGuncelAdminBilgi({
      ad: res.data.ad || '',
      soyad: res.data.soyad || '',
      email: res.data.email || '',
      telefon: res.data.telefon || '',
      sifre: '' // burası boş gelsin
    });
  } catch (err) {
    console.error('Admin bilgisi alınamadı:', err);
  }
};


  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSiteAyarChange = (e) => {
    setSiteAyar({ ...siteAyar, [e.target.name]: e.target.value });
  };

  const handleYeniAdminChange = (e) => {
    setYeniAdmin({ ...yeniAdmin, [e.target.name]: e.target.value });
  };

  const handleAdminBilgiChange = (e) => {
    setGuncelAdminBilgi({ ...guncelAdminBilgi, [e.target.name]: e.target.value });
  };

  const handleSiteSubmit = (e) => {
    e.preventDefault();
    setMesaj('✅ Site ayarları başarıyla güncellendi.');
  };

  const handleYeniAdminSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(yeniAdmin.email)) {
      setEmailHata('Geçerli bir e-posta giriniz.');
      return;
    }
    try {
      await api.post('/kullanicilar', { ...yeniAdmin, rol: 'ROLE_ADMIN' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMesaj(`✅ Yeni admin eklendi: ${yeniAdmin.email}`);
      setEmailHata('');
      setYeniAdmin({ ad: '', soyad: '', email: '', sifre: '', telefon: '' });
    } catch (err) {
      console.error('Admin ekleme hatası:', err);
      setMesaj('❌ Admin eklenemedi.');
    }
  };

 const handleAdminGuncelle = async (e) => {
  e.preventDefault();

  if (guncelAdminBilgi.email && !validateEmail(guncelAdminBilgi.email)) {
    setEmailHata('Geçerli bir e-posta giriniz.');
    return;
  }

  // Şifre boşsa backend'e gönderme

// ✅ Yeni
const { sifre, ...geriKalanlar } = guncelAdminBilgi;
const guncellenecekVeri = sifre && sifre.trim() !== '' ? { ...guncelAdminBilgi } : geriKalanlar;



  try {
    await api.put(`/kullanicilar/${adminId}`, guncellenecekVeri, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMesaj('✅ Bilgiler başarıyla güncellendi.');
    setEmailHata('');
    // Şifreyi temizle (güvenlik açısından tekrar doldurulmasın)
    setGuncelAdminBilgi(prev => ({ ...prev, sifre: '' }));

  } catch (err) {
    console.error('Bilgi güncelleme hatası:', err);
    setMesaj('❌ Bilgiler güncellenemedi.');
  }
};


  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Site Ayarları</h1>

      {mesaj && <p className="text-green-600 font-medium bg-green-100 border border-green-300 px-4 py-2 rounded">{mesaj}</p>}
      {emailHata && <p className="text-red-600 font-medium bg-red-100 border border-red-300 px-4 py-2 rounded">{emailHata}</p>}

      {/* Site Logo ve Başlık */}
      <form onSubmit={handleSiteSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FaGlobe /> Site Logo & Başlık
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Site Başlığı</label>
            <input
              type="text"
              name="baslik"
              value={siteAyar.baslik}
              onChange={handleSiteAyarChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Logo URL</label>
            <input
              type="text"
              name="logo"
              value={siteAyar.logo}
              onChange={handleSiteAyarChange}
              className="w-full border px-4 py-2 rounded"
            />
            <img src={siteAyar.logo} alt="Logo" className="mt-2 h-12" />
          </div>
        </div>
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center gap-2 mt-2">
          <FaSave /> Kaydet
        </button>
      </form>

     
      {/* Admin Bilgilerini Güncelle */}
      <form onSubmit={handleAdminGuncelle} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FaUserEdit /> Giriş Bilgilerimi Güncelle
        </h2>
        {adminBilgi && (
          <p className="text-gray-500 text-sm">Güncel hesabınız: <span className="font-medium">{adminBilgi.email}</span></p>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <input name="ad" value={guncelAdminBilgi.ad} onChange={handleAdminBilgiChange} placeholder="Ad" className="border px-4 py-2 rounded" />
          <input name="soyad" value={guncelAdminBilgi.soyad} onChange={handleAdminBilgiChange} placeholder="Soyad" className="border px-4 py-2 rounded" />
          <input name="telefon" value={guncelAdminBilgi.telefon} onChange={handleAdminBilgiChange} placeholder="Telefon" className="border px-4 py-2 rounded" />
          <input type="email" name="email" value={guncelAdminBilgi.email} onChange={handleAdminBilgiChange} placeholder="Yeni E-posta" className="border px-4 py-2 rounded" />
          <input type="password" name="sifre" value={guncelAdminBilgi.sifre} onChange={handleAdminBilgiChange} placeholder="Yeni Şifre" className="border px-4 py-2 rounded" />
        </div>
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center gap-2">
          <FaLock /> Güncelle
        </button>
      </form>
    </div>
  );
}
