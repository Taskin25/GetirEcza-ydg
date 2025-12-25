import { useEffect, useState } from 'react';
import { FaEdit, FaCheck } from 'react-icons/fa';
import api from '../../api';

export default function AdminStokTakip() {
  const [urunler, setUrunler] = useState([]);
  const [arama, setArama] = useState('');
  const [kritikGoster, setKritikGoster] = useState(false);
  const [duzenlenenStok, setDuzenlenenStok] = useState({});
  const [duzenleModu, setDuzenleModu] = useState({});
  const [mevcutSayfa, setMevcutSayfa] = useState(1);
  const sayfaBoyutu = 10;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUrunler();
  }, []);

  useEffect(() => {
    setMevcutSayfa(1); // Arama veya filtre değişince başa dön
  }, [arama, kritikGoster]);

  const fetchUrunler = async () => {
    try {
      const res = await api.get('/urunler');
      setUrunler(res.data);
    } catch (err) {
      console.error('Ürünler alınamadı:', err);
    }
  };

  const handleStokGuncelle = async (id) => {
    const guncelStok = Number(duzenlenenStok[id]);
    try {
      const urun = urunler.find((u) => u.id === id);
      const guncelUrun = { ...urun, stokDurumu: guncelStok };

      await api.put(`/urunler/${id}`, guncelUrun, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const guncellenmis = urunler.map((u) =>
        u.id === id ? { ...u, stokDurumu: guncelStok } : u
      );
      setUrunler(guncellenmis);
      setDuzenleModu({ ...duzenleModu, [id]: false });
    } catch (err) {
      console.error('Stok güncelleme hatası:', err);
    }
  };

  const filtreliUrunler = urunler.filter((u) => {
    const aramaEslesme = u.ad.toLowerCase().includes(arama.toLowerCase());
    const kritikFiltre = !kritikGoster || u.stokDurumu <= 5;
    return aramaEslesme && kritikFiltre;
  });

  const toplamSayfa = Math.ceil(filtreliUrunler.length / sayfaBoyutu);
  const baslangicIndex = (mevcutSayfa - 1) * sayfaBoyutu;
  const bitisIndex = baslangicIndex + sayfaBoyutu;
  const sayfalanmisUrunler = filtreliUrunler.slice(baslangicIndex, bitisIndex);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Stok Takibi</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün Ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/3"
        />
        <button
          onClick={() => setKritikGoster(!kritikGoster)}
          className="text-base font-medium bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
        >
          {kritikGoster ? 'Tüm Ürünleri Göster' : 'Kritik Stokları Göster'}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-6 py-3">Ürün Adı</th>
              <th className="px-6 py-3">Stok</th>
              <th className="px-6 py-3 text-center">Güncelle</th>
            </tr>
          </thead>
          <tbody>
            {sayfalanmisUrunler.length > 0 ? (
              sayfalanmisUrunler.map((urun) => (
                <tr key={urun.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{urun.ad}</td>
                  <td className="px-6 py-4">
                    {duzenleModu[urun.id] ? (
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 w-20"
                        value={duzenlenenStok[urun.id] ?? urun.stokDurumu}
                        onChange={(e) =>
                          setDuzenlenenStok({ ...duzenlenenStok, [urun.id]: e.target.value })
                        }
                      />
                    ) : (
                      <span
                        className={urun.stokDurumu <= 5 ? 'text-red-600 font-bold' : 'text-gray-700'}
                      >
                        {urun.stokDurumu}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {duzenleModu[urun.id] ? (
                      <button
                        onClick={() => handleStokGuncelle(urun.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold text-sm"
                        title="Kaydet"
                      >
                        <FaCheck className="inline mr-2" /> Kaydet
                      </button>
                    ) : (
                      <button
                        onClick={() => setDuzenleModu({ ...duzenleModu, [urun.id]: true })}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold text-sm"
                        title="Stok Güncelle"
                      >
                        <FaEdit className="inline mr-2" /> Güncelle
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  Uygun ürün bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Sayfalama */}
        {toplamSayfa > 1 && (
          <div className="flex justify-center mt-4 space-x-2 p-4">
            <button
              onClick={() => setMevcutSayfa(prev => Math.max(prev - 1, 1))}
              disabled={mevcutSayfa === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              ←
            </button>
            {Array.from({ length: toplamSayfa }, (_, i) => (
              <button
                key={i}
                onClick={() => setMevcutSayfa(i + 1)}
                className={`px-3 py-1 border rounded ${mevcutSayfa === i + 1 ? 'bg-red-100 font-semibold' : 'hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setMevcutSayfa(prev => Math.min(prev + 1, toplamSayfa))}
              disabled={mevcutSayfa === toplamSayfa}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
