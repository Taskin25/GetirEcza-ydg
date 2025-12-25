import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';

export default function Anasayfa() {
  const navigate = useNavigate();

  const resimListesi = [
    'https://static.ticimax.cloud/cdn-cgi/image/width=1815,quality=99/63199/uploads/sayfatasarim/sayfa4/title-66dfed36-5.jpg',
    'https://static.ticimax.cloud/cdn-cgi/image/width=1815,quality=99/63199/uploads/sayfatasarim/sayfa4/title-6eacf5bc-d.jpg',
    'https://static.ticimax.cloud/cdn-cgi/image/width=1815,quality=99/63199/uploads/sayfatasarim/sayfa4/title-ed9eceb8-f.jpg'
  ];

  const [sliderIndex, setSliderIndex] = useState(0);
  const [kategoriler, setKategoriler] = useState([]);
  const [urunler, setUrunler] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % resimListesi.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchKategoriler = async () => {
      try {
        const res = await api.get('/kategoriler');
        setKategoriler(res.data);
      } catch (err) {
        console.error('Kategoriler alınamadı', err);
      }
    };
    fetchKategoriler();
  }, []);

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const res = await api.get('/urunler');
        setUrunler(res.data);
      } catch (err) {
        console.error('Ürünler alınamadı', err);
      }
    };
    fetchUrunler();
  }, []);

  return (
    <div className="bg-white">
      <div className="w-full h-[400px] md:h-[700px] overflow-hidden">
        <img src={resimListesi[sliderIndex]} alt="Slider" className="w-full h-full object-cover transition duration-500" />
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
              <img src={kategori.gorselUrl} alt={kategori.ad} className="w-full h-[200px] object-cover" />
              <div className="p-4 text-center font-medium text-gray-800 text-lg">{kategori.ad}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 pb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ürünler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {urunler.map((urun) => (
            <div key={urun.id} className="border rounded-lg shadow hover:shadow-lg overflow-hidden">
              <img src={urun.gorselUrl} alt={urun.ad} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{urun.ad}</h3>
                <p className="text-red-600 font-bold mt-2">{urun.fiyat} TL</p>
                <Link
                  to={`/urun/${urun.id}`}
                  className="mt-3 inline-block text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
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
