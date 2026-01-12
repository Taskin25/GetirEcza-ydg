import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../api';

export default function Favorilerim() {
  const [favoriler, setFavoriler] = useState([]);

  const fetchFavoriler = async () => {
    try {
      const res = await api.get('/favoriler'); // Giriş yapan kullanıcının favorileri
      const favoriUrunler = await Promise.all(
          (res.data || []).map(async (favori) => {
            const urunRes = await api.get(`/urunler/${favori.urunId}`);
            return { ...urunRes.data, favoriId: favori.id, urunId: favori.urunId };
          })
      );
      setFavoriler(favoriUrunler);
    } catch (err) {
      console.error('Favoriler alınamadı:', err);
      setFavoriler([]);
    }
  };

  useEffect(() => {
    fetchFavoriler();
  }, []);

  const favoridenCikar = async (urunId) => {
    try {
      const kullaniciId = Number(localStorage.getItem('kullaniciId'));
      await api.delete(`/favoriler/kaldir`, {
        params: { kullaniciId, urunId }
      });
      setFavoriler((prev) => prev.filter((f) => f.urunId !== urunId));
    } catch (err) {
      console.error("Favoriden çıkarılamadı:", err);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1
              className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3"
              data-testid="favoriler-title"
          >
            <FaHeart className="text-red-500" /> Favori Ürünlerim
          </h1>

          {favoriler.length === 0 ? (
              <div
                  className="text-center text-gray-500 text-lg mt-20"
                  data-testid="favori-empty"
              >
                Henüz favori ürününüz bulunmamaktadır.
              </div>
          ) : (
              // ✅ Selenium S3 burada içerik bekliyor
              <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-12"
                  data-testid="favori-list"
              >
                {favoriler.map((urun) => (
                    <div
                        key={urun.urunId}
                        className="bg-white rounded-lg shadow-md flex flex-col"
                        data-testid={`favori-urun-${urun.urunId}`}
                    >
                      <img
                          src={urun.gorselUrl}
                          alt={urun.ad}
                          className="h-48 object-cover w-full"
                          data-testid={`favori-urun-${urun.urunId}-gorsel`}
                      />

                      <div className="p-4 flex-grow">
                        <h3
                            className="font-medium text-gray-800"
                            data-testid={`favori-urun-${urun.urunId}-ad`}
                        >
                          {urun.ad}
                        </h3>
                        <p
                            className="text-red-600 font-bold"
                            data-testid={`favori-urun-${urun.urunId}-fiyat`}
                        >
                          ₺{urun.fiyat.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 px-4 pb-4">
                        <Link
                            to={`/urun/${urun.urunId}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded text-center"
                            data-testid={`favori-urun-${urun.urunId}-incele`}
                        >
                          <FaSearch className="inline mr-1" />
                          İncele
                        </Link>

                        <button
                            onClick={() => favoridenCikar(urun.urunId)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 text-sm py-2 rounded text-center"
                            data-testid={`favori-urun-${urun.urunId}-kaldir`}
                        >
                          <FaTrash className="inline mr-1" />
                          Favorilerden Kaldır
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
