import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../api';

export default function AdminKategoriler() {
  const [kategoriler, setKategoriler] = useState([]);
  const [yeniKategori, setYeniKategori] = useState({ ad: '', aciklama: '', gorselUrl: '' });
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    kategorileriGetir();
  }, []);

  const kategorileriGetir = async () => {
    try {
      const res = await api.get('/kategoriler');
      setKategoriler(res.data);
    } catch (err) {
      console.error('Kategori çekme hatası:', err);
    }
  };

  const kategoriEkle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/kategoriler', yeniKategori);
      setMesaj('✅ Kategori eklendi');
      setYeniKategori({ ad: '', aciklama: '', gorselUrl: '' });
      kategorileriGetir();
    } catch (err) {
      setMesaj('❌ Ekleme başarısız');
    }
  };

  const kategoriSil = async (id) => {
    if (!window.confirm('Silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/kategoriler/${id}`);
      setMesaj('🗑️ Kategori silindi');
      kategorileriGetir();
    } catch {
      setMesaj('❌ Silme başarısız');
    }
  };

  const kategoriGuncelle = async () => {
    try {
      await api.put(`/kategoriler/${duzenlenen.id}`, duzenlenen);
      setMesaj('✅ Güncellendi');
      setDuzenlenen(null);
      kategorileriGetir();
    } catch {
      setMesaj('❌ Güncelleme başarısız');
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kategori Yönetimi</h1>

      {mesaj && <div className="mb-4 text-sm text-blue-600">{mesaj}</div>}

      {/* Yeni kategori ekleme formu */}
      <form onSubmit={kategoriEkle} className="bg-white p-6 rounded shadow mb-10">
        <div className="grid md:grid-cols-3 gap-4">
          <input name="ad" value={yeniKategori.ad} onChange={(e) => setYeniKategori({ ...yeniKategori, ad: e.target.value })} placeholder="Ad" className="border p-2 rounded" required />
          <input name="aciklama" value={yeniKategori.aciklama} onChange={(e) => setYeniKategori({ ...yeniKategori, aciklama: e.target.value })} placeholder="Açıklama" className="border p-2 rounded" required />
          <input name="gorselUrl" value={yeniKategori.gorselUrl} onChange={(e) => setYeniKategori({ ...yeniKategori, gorselUrl: e.target.value })} placeholder="Görsel URL" className="border p-2 rounded" required />
        </div>
        <button type="submit" className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
          <FaPlus className="inline-block mr-2" /> Kategori Ekle
        </button>
      </form>

      {/* Kategori listesi */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-2">Ad</th>
              <th className="px-4 py-2">Açıklama</th>
              <th className="px-4 py-2">Görsel</th>
              <th className="px-4 py-2 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {kategoriler.map((k) => (
              <tr key={k.id} className="border-b">
                <td className="px-4 py-2">
                  {duzenlenen?.id === k.id ? (
                    <input className="border p-1 rounded w-full" value={duzenlenen.ad} onChange={(e) => setDuzenlenen({ ...duzenlenen, ad: e.target.value })} />
                  ) : (
                    k.ad
                  )}
                </td>
                <td className="px-4 py-2">
                  {duzenlenen?.id === k.id ? (
                    <input className="border p-1 rounded w-full" value={duzenlenen.aciklama} onChange={(e) => setDuzenlenen({ ...duzenlenen, aciklama: e.target.value })} />
                  ) : (
                    k.aciklama
                  )}
                </td>
                <td className="px-4 py-2">
                  {duzenlenen?.id === k.id ? (
                    <input className="border p-1 rounded w-full" value={duzenlenen.gorselUrl} onChange={(e) => setDuzenlenen({ ...duzenlenen, gorselUrl: e.target.value })} />
                  ) : (
                    <img src={k.gorselUrl} alt={k.ad} className="h-10" />
                  )}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2 text-lg">
                  {duzenlenen?.id === k.id ? (
                    <>
                      <button onClick={kategoriGuncelle} className="text-green-600"><FaCheck /></button>
                      <button onClick={() => setDuzenlenen(null)} className="text-gray-600"><FaTimes /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setDuzenlenen(k)} className="text-blue-600"><FaEdit /></button>
                      <button onClick={() => kategoriSil(k.id)} className="text-red-600"><FaTrash /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {kategoriler.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">Kategori bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
