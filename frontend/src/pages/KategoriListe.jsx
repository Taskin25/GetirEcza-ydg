import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function KategoriListe() {
  const { kategori } = useParams();
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);
  const [siralama, setSiralama] = useState('artan');

  // Türkçe karakterleri normalize et (ç,ş,ı gibi)
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/\s+/g, ''); // boşlukları kaldır

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const res = await api.get('/urunler');
        const filtreli = res.data.filter(
          (urun) =>
            urun.kategoriAd && normalize(urun.kategoriAd) === normalize(kategori)
        );

        const sirali = [...filtreli].sort((a, b) =>
          siralama === 'artan' ? a.fiyat - b.fiyat : b.fiyat - a.fiyat
        );

        setUrunler(sirali);
      } catch (err) {
        console.error('Ürünler alınamadı:', err);
      }
    };

    fetchUrunler();
  }, [kategori, siralama]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {kategori} Ürünleri
          </h1>
          <select
            value={siralama}
            onChange={(e) => setSiralama(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm w-48"
          >
            <option value="artan">Fiyat: Artan</option>
            <option value="azalan">Fiyat: Azalan</option>
          </select>
        </div>

        {urunler.length === 0 ? (
          <p className="text-gray-600 text-center mt-20">Bu kategoride ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {urunler.map((urun) => (
              <div
                key={urun.id}
                className="border rounded-lg shadow hover:shadow-lg overflow-hidden"
              >
                <img
                  src={urun.gorselUrl}
                  alt={urun.ad}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{urun.ad}</h3>
                  <p className="text-red-600 font-bold">{urun.fiyat} TL</p>
                  <button
                    onClick={() => navigate(`/urun/${urun.id}`)}
                    className="mt-3 inline-block text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  >
                    İncele
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
