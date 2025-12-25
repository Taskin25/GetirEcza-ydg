import { useEffect, useState } from 'react';
import { FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../api';

export default function AdminKullanicilar() {
  const [arama, setArama] = useState('');
  const [kullanicilar, setKullanicilar] = useState([]);
  const [mevcutSayfa, setMevcutSayfa] = useState(1);
  const sayfaBoyutu = 10;

  useEffect(() => {
    const fetchKullanicilar = async () => {
      try {
        const response = await api.get('/kullanicilar');
        setKullanicilar(response.data);
      } catch (error) {
        console.error('Kullanıcıları çekerken hata:', error);
        if (error.response?.status === 403) {
          window.location.href = '/admin';
        }
      }
    };

    fetchKullanicilar();
  }, []);

  useEffect(() => {
    setMevcutSayfa(1); // Arama değiştiğinde sayfayı başa al
  }, [arama]);

  const handleSil = async (id) => {
    const onay = window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?");
    if (onay) {
      try {
        await api.delete(`/kullanicilar/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setKullanicilar(kullanicilar.filter(k => k.id !== id));
      } catch (error) {
        console.error('Silme hatası:', error);
        alert('Kullanıcı silinemedi.');
      }
    }
  };

  const filtreliListe = kullanicilar.filter(k =>
    (`${k.ad} ${k.soyad}`).toLowerCase().includes(arama.toLowerCase()) ||
    k.email.toLowerCase().includes(arama.toLowerCase())
  );

  const toplamSayfa = Math.ceil(filtreliListe.length / sayfaBoyutu);
  const baslangicIndex = (mevcutSayfa - 1) * sayfaBoyutu;
  const bitisIndex = baslangicIndex + sayfaBoyutu;
  const sayfalanmisListe = filtreliListe.slice(baslangicIndex, bitisIndex);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kullanıcı Yönetimi</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="İsim veya e-posta ile ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <span className="text-sm text-gray-500 ml-4">{filtreliListe.length} kullanıcı bulundu</span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-6 py-3 font-semibold">Ad Soyad</th>
              <th className="px-6 py-3 font-semibold">E-posta</th>
              <th className="px-6 py-3 font-semibold">Telefon</th>
              <th className="px-6 py-3 font-semibold text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {sayfalanmisListe.map((kullanici) => (
              <tr key={kullanici.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{kullanici.ad} {kullanici.soyad}</td>
                <td className="px-6 py-4">{kullanici.email}</td>
                <td className="px-6 py-4">{kullanici.telefon}</td>
                <td className="px-6 py-4 flex justify-center gap-5 text-2xl">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleSil(kullanici.id)}
                    title="Sil"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {sayfalanmisListe.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Sonuç bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Butonları */}
        {toplamSayfa > 1 && (
          <div className="flex justify-center mt-4 space-x-2 p-2">
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
