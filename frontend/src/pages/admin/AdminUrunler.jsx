import { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaEdit, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import api from '../../api';

export default function AdminUrunler() {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [arama, setArama] = useState('');
  const [yeniUrun, setYeniUrun] = useState({
    ad: '',
    fiyat: '',
    kategoriId: '',
    stokDurumu: '',
    gorselUrl: '',
    aciklama: ''
  });
  const [duzenleId, setDuzenleId] = useState(null);
  const [mevcutSayfa, setMevcutSayfa] = useState(1);
  const urunlerSayfaBasi = 10;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUrunler();
    fetchKategoriler();
  }, []);

  useEffect(() => {
    setMevcutSayfa(1);
  }, [arama]);

  const fetchUrunler = async () => {
    try {
      const res = await api.get('/urunler');
      setUrunler(res.data);
    } catch (err) {
      console.error('Ürünler alınamadı:', err);
    }
  };

  const fetchKategoriler = async () => {
    try {
      const res = await api.get('/kategoriler', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKategoriler(res.data);
    } catch (err) {
      console.error('Kategoriler alınamadı:', err);
    }
  };

  const urunEkle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/urunler', yeniUrun, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUrunler([...urunler, res.data]);
      setYeniUrun({ ad: '', fiyat: '', kategoriId: '', stokDurumu: '', gorselUrl: '', aciklama: '' });
    } catch (err) {
      console.error('Ürün ekleme hatası:', err);
    }
  };

  const urunGuncelle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/urunler/${duzenleId}`, yeniUrun, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUrunler(urunler.map(u => (u.id === duzenleId ? res.data : u)));
      setDuzenleId(null);
      setYeniUrun({ ad: '', fiyat: '', kategoriId: '', stokDurumu: '', gorselUrl: '', aciklama: '' });
    } catch (err) {
      console.error('Güncelleme hatası:', err);
    }
  };

  const urunSil = async (id) => {
    if (window.confirm('Ürün silinsin mi?')) {
      try {
        await api.delete(`/urunler/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUrunler(urunler.filter(u => u.id !== id));
      } catch (err) {
        console.error('Silme hatası:', err);
      }
    }
  };

  const duzenlemeyeBasla = (urun) => {
    setYeniUrun({
      ad: urun.ad,
      fiyat: urun.fiyat,
      kategoriId: urun.kategoriId,
      stokDurumu: urun.stokDurumu,
      gorselUrl: urun.gorselUrl,
      aciklama: urun.aciklama
    });
    setDuzenleId(urun.id);
  };

  const filtreliUrunler = urunler.filter(
    u =>
      u.ad.toLowerCase().includes(arama.toLowerCase()) ||
      kategoriler.find(k => k.id === u.kategoriId)?.ad?.toLowerCase().includes(arama.toLowerCase())
  );

  const baslangicIndex = (mevcutSayfa - 1) * urunlerSayfaBasi;
  const bitisIndex = baslangicIndex + urunlerSayfaBasi;
  const sayfalanmisUrunler = filtreliUrunler.slice(baslangicIndex, bitisIndex);
  const toplamSayfa = Math.ceil(filtreliUrunler.length / urunlerSayfaBasi);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ürün Yönetimi</h1>

      {/* Ürün Ekleme / Güncelleme Formu */}
      <form onSubmit={duzenleId ? urunGuncelle : urunEkle} className="bg-white p-6 rounded shadow mb-10 space-y-4 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {duzenleId ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Ürün Adı" value={yeniUrun.ad} onChange={(e) => setYeniUrun({ ...yeniUrun, ad: e.target.value })} className="border px-4 py-2 rounded" required />
<input
  type="number"
  placeholder="Fiyat"
  min="0"
  step="0.01"
  value={yeniUrun.fiyat}
  onChange={(e) => {
    const deger = parseFloat(e.target.value);
    if (deger >= 0 || isNaN(deger)) {
      setYeniUrun({ ...yeniUrun, fiyat: e.target.value });
    }
  }}
  className="border px-4 py-2 rounded"
  required
/>
          <select value={yeniUrun.kategoriId} onChange={(e) => setYeniUrun({ ...yeniUrun, kategoriId: e.target.value })} className="border px-4 py-2 rounded" required>
            <option value="">Kategori Seçin</option>
            {kategoriler.map(kat => (
              <option key={kat.id} value={kat.id}>{kat.ad}</option>
            ))}
          </select>
          <input type="number" placeholder="Stok" value={yeniUrun.stokDurumu} onChange={(e) => setYeniUrun({ ...yeniUrun, stokDurumu: e.target.value })} className="border px-4 py-2 rounded" required />
          <input type="text" placeholder="Görsel URL" value={yeniUrun.gorselUrl} onChange={(e) => setYeniUrun({ ...yeniUrun, gorselUrl: e.target.value })} className="border px-4 py-2 rounded col-span-2" required />
          <textarea placeholder="Açıklama" value={yeniUrun.aciklama} onChange={(e) => setYeniUrun({ ...yeniUrun, aciklama: e.target.value })} className="border px-4 py-2 rounded col-span-2" rows={3} />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-red-600 text-white font-semibold py-2 px-6 rounded flex items-center gap-2 text-lg">
            {duzenleId ? <FaSave /> : <FaPlus />} {duzenleId ? 'Güncelle' : 'Ekle'}
          </button>
          {duzenleId && (
            <button type="button" onClick={() => {
              setDuzenleId(null);
              setYeniUrun({ ad: '', fiyat: '', kategoriId: '', stokDurumu: '', gorselUrl: '', aciklama: '' });
            }} className="text-gray-600 hover:text-black font-medium flex items-center gap-2 text-lg">
              <FaTimes /> İptal
            </button>
          )}
        </div>
      </form>

      {/* Arama ve Listeleme */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-4 mb-4">
          <FaSearch />
          <input
            type="text"
            placeholder="Ürün Ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>

        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Görsel</th>
              <th className="p-2">Ad</th>
              <th className="p-2">Fiyat</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Stok</th>
              <th className="p-2">Açıklama</th>
              <th className="p-2 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sayfalanmisUrunler.map((urun) => (
              <tr key={urun.id} className="border-b">
                <td className="p-2">
                  <img src={urun.gorselUrl} alt={urun.ad} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-2">{urun.ad}</td>
                <td className="p-2">{urun.fiyat} ₺</td>
                <td className="p-2">{kategoriler.find(k => k.id === urun.kategoriId)?.ad || '-'}</td>
                <td className="p-2">{urun.stokDurumu}</td>
                <td className="p-2">{urun.aciklama}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button onClick={() => duzenlemeyeBasla(urun)} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2 text-sm hover:bg-blue-700">
                    <FaEdit /> Güncelle
                  </button>
                  <button onClick={() => urunSil(urun.id)} className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2 text-sm hover:bg-red-700">
                    <FaTrash /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sayfalama */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setMevcutSayfa(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-200"
            disabled={mevcutSayfa === 1}
          >
            ←
          </button>
          {Array.from({ length: toplamSayfa }, (_, i) => (
            <button
              key={i}
              onClick={() => setMevcutSayfa(i + 1)}
              className={`px-3 py-1 border rounded ${mevcutSayfa === i + 1 ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setMevcutSayfa(prev => Math.min(prev + 1, toplamSayfa))}
            className="px-3 py-1 border rounded hover:bg-gray-200"
            disabled={mevcutSayfa === toplamSayfa}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
