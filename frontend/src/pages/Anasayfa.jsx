import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../api';
import { useSepet } from '../context/SepetContext';
export default function Anasayfa() {
  const navigate = useNavigate();
  const { sepeteEkle } = useSepet();

  const resimListesi = useMemo(() => ([
    'https://static.ticimax.cloud/cdn-cgi/image/width=1815,quality=99/63199/uploads/sayfatasarim/sayfa4/title-66dfed36-5.jpg',
    'https://static.ticimax.cloud/cdn-cgi/image/width=1815,quality=99/63199/uploads/sayfatasarim/sayfa4/title-6eacf5bc-d.jpg',
    'https://static.ticimax.cloud/cdn-cgi/image/width=1815,quality=99/63199/uploads/sayfatasarim/sayfa4/title-ed9eceb8-f.jpg'
  ]), []);

  const [sliderIndex, setSliderIndex] = useState(0);
  const [kategoriler, setKategoriler] = useState([]);
  const [urunler, setUrunler] = useState([]);

  // ✅ Favori map backend’e bağlı: { [urunId]: true/false }
  const [favMap, setFavMap] = useState({});

  const token = localStorage.getItem('token');
  const kullaniciId = Number(localStorage.getItem('kullaniciId'));

  // Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % resimListesi.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [resimListesi.length]);

  // Kategoriler + Ürünler
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [katRes, urunRes] = await Promise.all([
          api.get('/kategoriler'),
          api.get('/urunler')
        ]);

        setKategoriler(katRes.data || []);
        setUrunler(urunRes.data || []);
      } catch (err) {
        console.error('Veri alınamadı:', err);
        setKategoriler([]);
        setUrunler([]);
      }
    };

    fetchAll();
  }, []);

  // ✅ Favorileri çek (login varsa)
  useEffect(() => {
    const fetchFavoriler = async () => {
      try {
        if (!token) {
          setFavMap({});
          return;
        }

        const favRes = await api.get('/favoriler');
        const favList = favRes.data || [];

        // {urunId: true} map
        const map = {};
        favList.forEach(f => {
          if (f?.urunId != null) map[Number(f.urunId)] = true;
        });

        setFavMap(map);
      } catch (err) {
        console.error('Favoriler alınamadı:', err);
        setFavMap({});
      }
    };

    fetchFavoriler();
  }, [token]);

  const handleSepeteEkle = (urun) => {
    const stok = (urun.stokDurumu ?? urun.stok ?? 999);
    if (stok === 0) return;

    sepeteEkle({
      id: urun.id,               // UI ürün id
      ad: urun.ad,
      fiyat: urun.fiyat,
      resim: urun.gorselUrl,
      aciklama: urun.aciklama,
      adet: 1,
      miktar: 1
    });
  };

  // ✅ Favoriyi backend’e ekle/sil
  const toggleFavori = async (urunId) => {
    try {
      if (!token) {
        navigate('/giris');
        return;
      }

      const uid = Number(urunId);
      const zatenFavori = !!favMap[uid];

      // UI’ı hızlı güncelle (optimistic)
      setFavMap(prev => ({ ...prev, [uid]: !zatenFavori }));

      if (zatenFavori) {
        await api.delete('/favoriler/kaldir', {
          params: { kullaniciId, urunId: uid }
        });
      } else {
        await api.post('/favoriler', {
          kullaniciId,
          urunId: uid
        });
      }
    } catch (err) {
      console.error('Favori işlemi başarısız:', err);
      // Hata olursa geri al
      setFavMap(prev => ({ ...prev, [Number(urunId)]: !prev[Number(urunId)] }));
    }
  };

  return (
      <div className="bg-white">
        <div className="w-full h-[400px] md:h-[700px] overflow-hidden">
          <img
              src={resimListesi[sliderIndex]}
              alt="Slider"
              className="w-full h-full object-cover transition duration-500"
          />
        </div>

        <div id="kategoriler" className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {kategoriler.map((kategori) => (
                <div
                    key={kategori.id}
                    onClick={() => navigate(`/kategori/${kategori.ad}`)}
                    className="border rounded-lg overflow-hidden shadow hover:shadow-md cursor-pointer transition"
                >
                  <img
                      src={kategori.gorselUrl}
                      alt={kategori.ad}
                      className="w-full h-[200px] object-cover"
                  />
                  <div className="p-4 text-center font-medium text-gray-800 text-lg">
                    {kategori.ad}
                  </div>
                </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ürünler</h2>

          {/* Selenium buradan ürünleri bulacak */}
          <div
              data-testid="urunler-grid"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {urunler.map((urun) => (
                <div
                    key={urun.id}
                    className="border rounded-lg shadow hover:shadow-lg overflow-hidden"
                    data-testid="urun-karti"
                    data-urun-id={urun.id}
                >
                  <img
                      src={urun.gorselUrl}
                      alt={urun.ad}
                      className="w-full h-48 object-cover"
                      data-testid={`urun-${urun.id}-gorsel`}
                  />

                  <div className="p-4">
                    <h3
                        className="text-lg font-bold text-gray-800"
                        data-testid={`urun-${urun.id}-ad`}
                    >
                      {urun.ad}
                    </h3>

                    <p
                        className="text-red-600 font-bold mt-2"
                        data-testid={`urun-${urun.id}-fiyat`}
                    >
                      {urun.fiyat} TL
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                          data-testid={`urun-${urun.id}-sepete-ekle`}
                          onClick={() => {
                            handleSepeteEkle(urun);
                            navigate('/sepet');   // ✅ TESTİN BEKLEDİĞİ ŞEY
                          }}
                          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
                      >
                        Sepete Ekle
                      </button>

                      <button
                          data-testid={`urun-${urun.id}-favori`}
                          onClick={() => toggleFavori(urun.id)}
                          className="text-xl"
                          aria-pressed={favMap[urun.id] ? 'true' : 'false'}
                          title="Favori"
                      >
                        {favMap[urun.id]
                            ? <FaHeart className="text-red-500" />
                            : <FaRegHeart className="text-gray-400" />
                        }
                      </button>
                    </div>

                    <Link
                        to={`/urun/${urun.id}`}
                        className="mt-3 inline-block text-sm text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
                        data-testid={`urun-${urun.id}-incele`}
                    >
                      İncele
                    </Link>
                  </div>
                </div>
            ))}
          </div>
        </div>

        <footer className="bg-red-600 text-white text-center py-4 mt-8">
          <p>&copy; {new Date().getFullYear()} Eczane. Tüm hakları saklıdır.</p>
        </footer>
      </div>
  );
}
