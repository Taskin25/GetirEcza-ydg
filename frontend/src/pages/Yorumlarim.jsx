import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots, FaCalendarAlt } from 'react-icons/fa';
import api from '../api';

export default function Yorumlarim() {
  const [yorumlar, setYorumlar] = useState([]);
  const [yeniYorum, setYeniYorum] = useState('');
  const [aktifYorum, setAktifYorum] = useState(null);
  const kullaniciId = localStorage.getItem('kullaniciId');

  useEffect(() => {
    const fetchYorumlar = async () => {
      try {
        const res = await api.get(`/yorumlar/kullanici/${kullaniciId}`);

        // Her yorum için ürün adını getir
        const enriched = await Promise.all(
          res.data.map(async (yorum) => {
            try {
              const urunRes = await api.get(`/urunler/${yorum.urunId}`);
              return {
                ...yorum,
                urunAd: urunRes.data.ad
              };
            } catch (err) {
              return {
                ...yorum,
                urunAd: 'Ürün Adı Belirtilmemiş'
              };
            }
          })
        );

        setYorumlar(enriched);
      } catch (err) {
        console.error('Yorumlar alınamadı:', err);
      }
    };

    fetchYorumlar();
  }, [kullaniciId]);

  const yorumGuncelle = async () => {
    if (!yeniYorum.trim() || !aktifYorum) return;

    const yeniYorumVerisi = {
      id: aktifYorum.id,
      urunId: aktifYorum.urunId,
      kullaniciId: aktifYorum.kullaniciId,
      icerik: yeniYorum,
      puan: aktifYorum.puan || 5,
      tarih: aktifYorum.tarih
    };

    try {
      const res = await api.put(`/yorumlar/${aktifYorum.id}`, yeniYorumVerisi);
      setYorumlar(
        yorumlar.map((y) => (y.id === aktifYorum.id ? { ...y, icerik: yeniYorum } : y))
      );
      setYeniYorum('');
      setAktifYorum(null);
    } catch (err) {
      console.error('Yorum güncellenemedi:', err);
    }
  };

  const yorumSil = async (yorumId) => {
    try {
      await api.delete(`/yorumlar/${yorumId}`);
      setYorumlar(yorumlar.filter((y) => y.id !== yorumId));
    } catch (err) {
      console.error('Yorum silinemedi:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <FaCommentDots className="text-red-600 text-4xl" /> Yorumlarım
      </h1>

      <div className="max-w-5xl mx-auto grid gap-6 mb-20">
        {yorumlar.map((yorum) => (
          <div
            key={yorum.id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-6 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">🛍️ {yorum.urunAd}</h3>
              <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                <FaCalendarAlt /> {new Date(yorum.tarih).toLocaleDateString('tr-TR')}
              </div>
              <p className="text-sm text-gray-700 mb-2">{yorum.icerik}</p>
              <Link
                to={`/urun/${yorum.urunId}`}
                className="inline-block mt-2 bg-blue-100 text-blue-700 font-medium text-sm px-4 py-2 rounded hover:bg-blue-200 transition"
              >
                Ürün Detayına Git
              </Link>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  setAktifYorum(yorum);
                  setYeniYorum(yorum.icerik);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded w-full"
              >
                Yorumu Düzenle
              </button>
              <button
                onClick={() => yorumSil(yorum.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded w-full"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {aktifYorum && (
        <div className="max-w-3xl mx-auto bg-white border shadow-lg rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Yorumu Düzenle - {aktifYorum.urunAd}
          </h2>
          <textarea
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-4 text-sm mb-4 resize-none"
            placeholder="Yorumunuzu buraya yazın..."
            value={yeniYorum}
            onChange={(e) => setYeniYorum(e.target.value)}
          />
          <button
            onClick={yorumGuncelle}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition w-full"
          >
            Yorumu Güncelle
          </button>
        </div>
      )}
    </div>
  );
}
