// src/pages/Adreslerim.jsx
import { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../api';

export default function Adreslerim() {
  const [adresler, setAdresler] = useState([]);
  const [duzenlenenAdresIndex, setDuzenlenenAdresIndex] = useState(null);
  const [duzenlenenAdres, setDuzenlenenAdres] = useState('');

  const [il, setIl] = useState('');
  const [ilce, setIlce] = useState('');
  const [adresDetay, setAdresDetay] = useState('');

  const token = localStorage.getItem('token');
  const kullaniciId = localStorage.getItem('kullaniciId');

  useEffect(() => {
    fetchAdresler();
  }, []);

  const fetchAdresler = async () => {
    try {
      const res = await api.get(`/adresler/kullanici/${kullaniciId}`);
      setAdresler(res.data);
    } catch (err) {
      console.error('Adresler alınamadı:', err);
    }
  };

  const adresEkle = async () => {
    if (il && ilce && adresDetay.trim() !== '') {
      try {
        await api.post('/adresler', {
          adresDetay: `${il} / ${ilce} - ${adresDetay}`,
          kullaniciId,
        });
        setIl('');
        setIlce('');
        setAdresDetay('');
        fetchAdresler();
      } catch (err) {
        console.error('Adres eklenemedi:', err);
      }
    }
  };

  const adresSil = async (id) => {
    try {
      await api.delete(`/adresler/${id}`);
      fetchAdresler();
    } catch (err) {
      console.error('Adres silinemedi:', err);
    }
  };

  const adresGuncelle = async (id) => {
    try {
      await api.put(`/adresler/${id}`, {
        adresDetay: duzenlenenAdres,
        kullaniciId,
      });
      setDuzenlenenAdresIndex(null);
      setDuzenlenenAdres('');
      fetchAdresler();
    } catch (err) {
      console.error('Adres güncellenemedi:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <FaMapMarkedAlt className="text-red-600 text-4xl" /> Gönderim Adreslerim
      </h1>

      <div className="grid gap-6 mb-16 max-w-5xl mx-auto">
        {adresler.map((adres, index) => (
          <div
            key={adres.id}
            className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center border hover:shadow-lg transition"
          >
            {duzenlenenAdresIndex === index ? (
              <textarea
                className="w-4/5 border border-gray-300 rounded-lg p-3 text-sm resize-none"
                value={duzenlenenAdres}
                onChange={(e) => setDuzenlenenAdres(e.target.value)}
              />
            ) : (
              <p className="text-sm text-gray-800 w-4/5 leading-relaxed border-b pb-2 border-gray-200">
                {adres.adresDetay}
              </p>
            )}
            <div className="flex gap-4">
              {duzenlenenAdresIndex === index ? (
                <button
                  onClick={() => adresGuncelle(adres.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Güncelle
                </button>
              ) : (
                <button
                  onClick={() => {
                    setDuzenlenenAdresIndex(index);
                    setDuzenlenenAdres(adres.adresDetay);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Düzenle
                </button>
              )}
              <button
                onClick={() => adresSil(adres.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-lg border max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">Yeni Adres Ekle</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İl</label>
            <select
              value={il}
              onChange={(e) => setIl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            >
              <option value="">İl Seçiniz</option>
              <option value="Malatya">Malatya</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
            <input
              type="text"
              placeholder="İlçe"
              value={ilce}
              onChange={(e) => setIlce(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adres Detayı</label>
          <textarea
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-4 text-sm resize-none"
            placeholder="Adres detaylarını yazın..."
            value={adresDetay}
            onChange={(e) => setAdresDetay(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={adresEkle}
          className="flex items-center justify-center gap-3 w-full py-5 text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          <FaPlus className="text-xl" /> Adres Ekle
        </button>
      </div>
    </div>
  );
}
