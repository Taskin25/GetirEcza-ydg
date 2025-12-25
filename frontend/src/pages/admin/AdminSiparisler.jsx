import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import api from '../../api';

export default function AdminSiparisler() {
  const [arama, setArama] = useState('');
  const [siparisler, setSiparisler] = useState([]);
  const [mevcutSayfa, setMevcutSayfa] = useState(1);
  const sayfaBoyutu = 10;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSiparisler();
  }, []);

  useEffect(() => {
    setMevcutSayfa(1); // Arama değiştiğinde başa dön
  }, [arama]);

  const fetchSiparisler = async () => {
    try {
      const res = await api.get('/siparisler', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSiparisler(res.data);
    } catch (err) {
      console.error('Siparişler alınamadı:', err);
    }
  };

  const durumGuncelle = async (id, yeniDurum) => {
    try {
      const detayRes = await api.get(`/siparisler/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const guncellenmisSiparis = {
        ...detayRes.data,
        durum: yeniDurum
      };

      await api.put(`/siparisler/${id}`, guncellenmisSiparis, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchSiparisler();
    } catch (err) {
      console.error('Durum güncellenemedi:', err);
    }
  };

  const durumBadge = (durum) => {
    switch (durum) {
      case 'HAZIRLANIYOR': return 'bg-yellow-100 text-yellow-700';
      case 'KARGOLANDI': return 'bg-blue-100 text-blue-700';
      case 'TESLIM_EDILDI': return 'bg-green-100 text-green-700';
      case 'IPTAL_EDILDI': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filtreliListe = siparisler.filter(
    s => s.kullaniciId?.toString().includes(arama) || s.id.toString().includes(arama)
  );

  const toplamSayfa = Math.ceil(filtreliListe.length / sayfaBoyutu);
  const baslangicIndex = (mevcutSayfa - 1) * sayfaBoyutu;
  const bitisIndex = baslangicIndex + sayfaBoyutu;
  const sayfalanmisListe = filtreliListe.slice(baslangicIndex, bitisIndex);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sipariş Yönetimi</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Kullanıcı ID veya Sipariş ID..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <span className="text-sm text-gray-500 ml-4">
          {filtreliListe.length} sipariş bulundu
        </span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-6 py-3">Sipariş ID</th>
              <th className="px-6 py-3">Kullanıcı ID</th>
              <th className="px-6 py-3">Tarih</th>
              <th className="px-6 py-3">Toplam Tutar</th>
              <th className="px-6 py-3">Durum</th>
              <th className="px-6 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {sayfalanmisListe.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{s.id}</td>
                <td className="px-6 py-4">{s.kullaniciId}</td>
                <td className="px-6 py-4">{s.siparisTarihi?.split('T')[0]}</td>
                <td className="px-6 py-4">₺{parseFloat(s.toplamTutar).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${durumBadge(s.durum)}`}>
                    {s.durum.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {s.durum === 'HAZIRLANIYOR' && (
                    <button onClick={() => durumGuncelle(s.id, 'KARGOLANDI')} className="text-blue-600 hover:underline">Kargoya Ver</button>
                  )}
                  {s.durum === 'KARGOLANDI' && (
                    <button onClick={() => durumGuncelle(s.id, 'TESLIM_EDILDI')} className="text-green-600 hover:underline">Teslim Et</button>
                  )}
                  {s.durum !== 'TESLIM_EDILDI' && (
                    <button onClick={() => durumGuncelle(s.id, 'IPTAL_EDILDI')} className="text-red-600 hover:underline">İptal Et</button>
                  )}
                </td>
              </tr>
            ))}
            {sayfalanmisListe.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Eşleşen sipariş bulunamadı.
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
