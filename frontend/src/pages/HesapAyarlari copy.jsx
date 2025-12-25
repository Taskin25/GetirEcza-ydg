import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaTrash } from 'react-icons/fa';
import api from '../api';

export default function HesapAyarları() {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [sifreGizli, setSifreGizli] = useState(true);
  const [yeniSifreGizli, setYeniSifreGizli] = useState(true);
  const [bildirimTercihi, setBildirimTercihi] = useState({ email: true, sms: false, push: false });
  const [guncellemeMesaji, setGuncellemeMesaji] = useState('');
  const [silmeMesaji, setSilmeMesaji] = useState('');

  const token = localStorage.getItem('token');
  const kullaniciId = localStorage.getItem('kullaniciId');

  // ✅ Bilgileri getir
  useEffect(() => {
    const fetchBilgi = async () => {
      try {
        const res = await api.get(`/kullanicilar/${kullaniciId}`);
        setAd(res.data.ad || '');
        setSoyad(res.data.soyad || '');
        setEmail(res.data.email || '');
        setTelefon(res.data.telefon || '');
      } catch (err) {
        console.error('Kullanıcı bilgisi alınamadı', err);
      }
    };
    fetchBilgi();
  }, [kullaniciId]);

  // ✅ Güncelleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const guncelVeri = {
        ad,
        soyad,
        email,
        telefon,
      };
      if (yeniSifre && yeniSifre.trim() !== '') {
        guncelVeri.sifre = yeniSifre;
      }

      await api.put(`/kullanicilar/${kullaniciId}`, guncelVeri);
      setGuncellemeMesaji('Bilgiler başarıyla güncellendi.');
      setTimeout(() => setGuncellemeMesaji(''), 4000);
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setGuncellemeMesaji('❌ Güncelleme başarısız.');
    }
  };

const handleHesapSil = async () => {
  if (window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
    try {
      await api.delete(`/kullanicilar/${kullaniciId}`);
      setSilmeMesaji('Hesabınız başarıyla silindi.');
      // Oturumu kapat
      localStorage.clear();
      setTimeout(() => {
        window.location.href = '/giris'; // veya anasayfa
      }, 2000);
    } catch (err) {
      console.error('Hesap silinirken hata:', err);
      setSilmeMesaji('❌ Hesap silinemedi.');
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:mb-10">Hesap Ayarları</h1>

      {guncellemeMesaji && (
        <div className="max-w-4xl mx-auto mb-4 p-4 text-green-800 bg-green-100 border border-green-300 rounded-lg text-center shadow">
          {guncellemeMesaji}
        </div>
      )}
      {silmeMesaji && (
        <div className="max-w-4xl mx-auto mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded-lg text-center shadow">
          {silmeMesaji}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">Ad</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser /></span>
              <input type="text" value={ad} onChange={(e) => setAd(e.target.value)} className="pl-10 w-full border rounded-lg px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Soyad</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser /></span>
              <input type="text" value={soyad} onChange={(e) => setSoyad(e.target.value)} className="pl-10 w-full border rounded-lg px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">E-posta</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope /></span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 w-full border rounded-lg px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Telefon</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone /></span>
              <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className="pl-10 w-full border rounded-lg px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Yeni Şifre</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaLock /></span>
              <input type={yeniSifreGizli ? 'password' : 'text'} value={yeniSifre} onChange={(e) => setYeniSifre(e.target.value)} className="pl-10 w-full border rounded-lg px-4 py-2" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500" onClick={() => setYeniSifreGizli(!yeniSifreGizli)}>
                {yeniSifreGizli ? 'Göster' : 'Gizle'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border rounded-lg shadow p-4">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Bildirim Tercihleri</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bildirimTercihi.email} onChange={() => setBildirimTercihi(prev => ({ ...prev, email: !prev.email }))} />
                E-posta Bildirimi
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bildirimTercihi.sms} onChange={() => setBildirimTercihi(prev => ({ ...prev, sms: !prev.sms }))} />
                SMS Bildirimi
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bildirimTercihi.push} onChange={() => setBildirimTercihi(prev => ({ ...prev, push: !prev.push }))} />
                Mobil Uygulama Bildirimi
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-sm font-semibold shadow-md">Kaydet</button>
            <button type="button" onClick={handleHesapSil} className="flex items-center justify-center gap-2 text-red-600 hover:text-red-800 border border-red-500 px-4 py-3 rounded-lg text-sm font-medium">
              <FaTrash /> Hesabımı Sil
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
