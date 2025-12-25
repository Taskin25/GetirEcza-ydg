import { useEffect, useState } from 'react';
import { FaCreditCard, FaTrash, FaPlus, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../api';

export default function OdemeYontemleri() {
  const [kartlar, setKartlar] = useState([]);
  const [duzenleIndex, setDuzenleIndex] = useState(null);
  const [duzenleKart, setDuzenleKart] = useState({ isim: '', no: '', sonKullanma: '', kartTipi: '' });

  const [yeniKart, setYeniKart] = useState({ isim: '', no: '', sonKullanma: '', kartTipi: 'Visa' });
  const token = localStorage.getItem('token');
  const kullaniciId = localStorage.getItem('kullaniciId');

  useEffect(() => {
    fetchKartlar();
  }, []);

  const fetchKartlar = async () => {
    try {
      const res = await api.get(`/odemekartlari/kullanici/${kullaniciId}`);
      setKartlar(res.data);
    } catch (err) {
      console.error('Kartlar alınamadı:', err);
    }
  };

  const kartEkle = async () => {
    if (yeniKart.isim && yeniKart.no && yeniKart.sonKullanma && yeniKart.kartTipi) {
      try {
        await api.post('/odemekartlari', { ...yeniKart, kullaniciId });
        setYeniKart({ isim: '', no: '', sonKullanma: '', kartTipi: 'Visa' });
        fetchKartlar();
      } catch (err) {
        console.error('Kart ekleme hatası:', err);
      }
    }
  };

  const kartSil = async (id) => {
    try {
      await api.delete(`/odemekartlari/${id}`);
      fetchKartlar();
    } catch (err) {
      console.error('Kart silme hatası:', err);
    }
  };

  const kartGuncelle = async () => {
    try {
      await api.put(`/odemekartlari/${duzenleKart.id}`, duzenleKart);
      setDuzenleIndex(null);
      fetchKartlar();
    } catch (err) {
      console.error('Kart güncelleme hatası:', err);
    }
  };

  const handleSonKullanmaChange = (e, setFunc) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5);
    setFunc(prev => ({ ...prev, sonKullanma: val }));
  };

  const handleKartNoChange = (e, setFunc) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setFunc(prev => ({ ...prev, no: val }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <FaCreditCard className="text-red-600 text-4xl" /> Ödeme Yöntemlerim
      </h1>

      <div className="grid gap-6 mb-10 max-w-5xl mx-auto">
        {kartlar.map((kart, index) => (
          <div key={kart.id} className="bg-white p-5 rounded-xl shadow-md border space-y-2">
            {duzenleIndex === index ? (
              <>
                <input
                  value={duzenleKart.isim}
                  onChange={(e) => setDuzenleKart({ ...duzenleKart, isim: e.target.value })}
                  className="border rounded p-2 w-full"
                  placeholder="Kart Sahibi"
                />
                <input
                  value={duzenleKart.no}
                  onChange={(e) => handleKartNoChange(e, setDuzenleKart)}
                  className="border rounded p-2 w-full"
                  placeholder="Kart No"
                />
                <input
                  value={duzenleKart.sonKullanma}
                  onChange={(e) => handleSonKullanmaChange(e, setDuzenleKart)}
                  className="border rounded p-2 w-full"
                  placeholder="AA/YY"
                />
                <select
                  value={duzenleKart.kartTipi}
                  onChange={(e) => setDuzenleKart({ ...duzenleKart, kartTipi: e.target.value })}
                  className="border rounded p-2 w-full"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">Amex</option>
                </select>
                <div className="flex gap-3 mt-2">
                  <button onClick={kartGuncelle} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center gap-2">
                    <FaCheck /> Kartı Güncelle
                  </button>
                  <button onClick={() => setDuzenleIndex(null)} className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded flex items-center gap-2">
                    <FaTimes /> Vazgeç
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 font-semibold">{kart.kartTipi} - {kart.no}</p>
                <p className="text-sm text-gray-500">Kart Sahibi: {kart.isim}</p>
                <p className="text-sm text-gray-500">Son Kullanma: {kart.sonKullanma}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => { setDuzenleIndex(index); setDuzenleKart(kart); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                    <FaPen /> Düzenle
                  </button>
                  <button onClick={() => kartSil(kart.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2">
                    <FaTrash /> Sil
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Yeni Kart Ekle */}
      <div className="bg-white max-w-3xl mx-auto border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Yeni Kart Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Kart Sahibi Adı"
            className="border border-gray-300 rounded-lg p-3 text-sm"
            value={yeniKart.isim}
            onChange={(e) => setYeniKart({ ...yeniKart, isim: e.target.value })}
          />
          <input
            type="text"
            placeholder="Kart Numarası (**** **** **** 1234)"
            className="border border-gray-300 rounded-lg p-3 text-sm"
            value={yeniKart.no}
            onChange={(e) => handleKartNoChange(e, setYeniKart)}
          />
          <input
            type="text"
            placeholder="Son Kullanma Tarihi (AA/YY)"
            className="border border-gray-300 rounded-lg p-3 text-sm"
            value={yeniKart.sonKullanma}
            onChange={(e) => handleSonKullanmaChange(e, setYeniKart)}
          />
          <select
            className="border border-gray-300 rounded-lg p-3 text-sm"
            value={yeniKart.kartTipi}
            onChange={(e) => setYeniKart({ ...yeniKart, kartTipi: e.target.value })}
          >
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Amex">American Express</option>
          </select>
        </div>
        <button
          onClick={kartEkle}
          className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <FaPlus /> Kart Ekle
        </button>
      </div>
    </div>
  );
}
