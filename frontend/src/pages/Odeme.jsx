import { useEffect, useState } from 'react';
import { FaMapMarkedAlt, FaTruck } from 'react-icons/fa';
import { useSepet } from '../context/SepetContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Odeme() {
  const [adresler, setAdresler] = useState([]);
  const [secilenAdresId, setSecilenAdresId] = useState(null);
  const [adresSecimAcik, setAdresSecimAcik] = useState(false);
  const [kargo, setKargo] = useState('DHL');

  const { sepet, sepetiTemizle } = useSepet();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const kullaniciId = Number(localStorage.getItem('kullaniciId'));

  useEffect(() => {
    const fetchAdresler = async () => {
      try {
        const res = await api.get(`/adresler/kullanici/${kullaniciId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdresler(res.data);
        if (res.data.length > 0) setSecilenAdresId(res.data[0].id);
      } catch (err) {
        console.error('Adresler alınamadı:', err);
      }
    };
    fetchAdresler();
  }, [kullaniciId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const siparisTarihi = new Date().toISOString();

    try {
      const siparisDetaylar = sepet.map((item) => ({
        urunId: item.urunId,
        adet: item.miktar,
        birimFiyat: item.fiyat
      }));

      const toplamTutar = siparisDetaylar.reduce(
        (toplam, item) => toplam + item.adet * item.birimFiyat,
        0
      );

      const siparisRes = await api.post('/siparisler/tam', {
        kullaniciId,
        siparisTarihi,
        toplamTutar,
        detaylar: siparisDetaylar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const siparisId = siparisRes.data.id;

      await api.post('/odemeler', {
        siparisId,
        odemeTutari: toplamTutar,
        odemeTarihi: new Date().toISOString(),
        odemeYontemi: 'KREDIKARTI',
        odemeDurumu: 'ODEME_ALINDI'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await sepetiTemizle();
      navigate('/siparis-onay');

    } catch (err) {
      console.error('Sipariş veya ödeme işlemi başarısız:', err);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-red-600 text-center">📦 Sipariş Özeti</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-lg p-8 rounded-xl border">
        {/* Teslimat Adresi */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaMapMarkedAlt className="text-red-600" /> Teslimat Adresi
            </h2>
            <button
              type="button"
              onClick={() => setAdresSecimAcik(!adresSecimAcik)}
              className="text-sm text-blue-600 hover:underline"
            >
              değiştir
            </button>
          </div>
          {adresSecimAcik ? (
            <select
              value={secilenAdresId || ''}
              onChange={(e) => setSecilenAdresId(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm mt-2"
            >
              {adresler.map((adres) => (
                <option key={adres.id} value={adres.id}>{adres.adresDetay}</option>
              ))}
            </select>
          ) : (
            <div className="bg-gray-100 p-3 rounded border text-sm text-gray-700">
              {adresler.find(a => a.id === Number(secilenAdresId))?.adresDetay || 'Adres bulunamadı'}
            </div>
          )}
        </div>

        {/* Kargo Seçimi */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaTruck className="text-red-600" /> Teslimat Yöntemi
          </h2>
          <div className="flex justify-between gap-4 text-sm">
            {['FedEx', 'UPS', 'DHL'].map((firma) => (
              <button
                key={firma}
                type="button"
                onClick={() => setKargo(firma)}
                className={`border px-3 py-2 rounded flex-1 text-center hover:bg-gray-100 transition ${
                  kargo === firma ? 'border-red-500 text-red-600 font-semibold bg-red-50' : ''
                }`}
              >
                {firma} <br /> <span className="text-xs text-gray-500">2-3 gün</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fiyat Özeti */}
        <div className="space-y-2 text-sm text-gray-700 border-t pt-4">
          <div className="flex justify-between">
            <span>Sipariş Fiyatı:</span>
            <span>₺{sepet.reduce((t, u) => t + u.fiyat * u.miktar, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kargo Ücreti:</span>
            <span>₺25</span>
          </div>
          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Toplam:</span>
            <span>₺{(sepet.reduce((t, u) => t + u.fiyat * u.miktar, 0) + 25).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl mt-4"
        >
          SİPARİŞ VER
        </button>
      </form>
    </div>
  );
}
