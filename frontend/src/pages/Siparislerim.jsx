import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import api from '../api';

export default function Siparislerim() {
  const [aktifDurum, setAktifDurum] = useState('Tümü');
  const [detaySiparis, setDetaySiparis] = useState(null);
  const [siparisler, setSiparisler] = useState([]);
  const kullaniciId = Number(localStorage.getItem('kullaniciId'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSiparisler = async () => {
      try {
        const res = await api.get(`/siparisler/kullanici/${kullaniciId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSiparisler(res.data);
      } catch (err) {
        console.error('Siparişler alınamadı:', err);
      }
    };
    fetchSiparisler();
  }, [kullaniciId, token]);

  const durumMap = {
    'Teslim Edildi': 'TESLIM_EDILDI',
    'Kargoya Verildi': 'KARGOLANDI',
    'İptal Edildi': 'IPTAL_EDILDI',
  };

  const filtrelenmisSiparisler =
    aktifDurum === 'Tümü'
      ? siparisler
      : siparisler.filter((s) => s.durum === durumMap[aktifDurum]);

  const durumBadge = (durum) => {
    switch (durum) {
      case 'TESLIM_EDILDI': return 'bg-green-100 text-green-700';
      case 'KARGOLANDI': return 'bg-yellow-100 text-yellow-700';
      case 'IPTAL_EDILDI': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Siparişlerim</h1>

      <div className="flex flex-wrap gap-4 mb-6 text-sm md:text-base">
        {['Tümü', 'Teslim Edildi', 'Kargoya Verildi', 'İptal Edildi'].map((durum) => (
          <button
            key={durum}
            onClick={() => setAktifDurum(durum)}
            className={`px-4 py-2 rounded-full transition ${
              aktifDurum === durum ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-red-100'
            }`}
          >
            {durum}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtrelenmisSiparisler.map((s) => (
          <div key={s.id} className="bg-white rounded-lg shadow-sm border p-4 md:p-6 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-sm md:text-base">
                Sipariş no: {s.id.toString().padStart(6, '0')}
              </h2>
              <span className="text-xs text-gray-500">
                {new Date(s.siparisTarihi).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Toplam Tutar: ₺{typeof s.toplamTutar === 'number' ? s.toplamTutar.toFixed(2) : '0.00'}
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setDetaySiparis(s)}
                className="px-4 py-1 border rounded-full text-xs text-gray-700 hover:bg-gray-100"
              >
                Detaylar
              </button>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${durumBadge(s.durum)}`}>
                {s.durum.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {detaySiparis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-[90%] max-w-md relative border-2 border-red-100">
            <button
              onClick={() => setDetaySiparis(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-6 text-red-600 border-b pb-2">📦 Sipariş Detayları</h2>
            <div className="space-y-3 text-sm text-gray-800">
              <div><strong>Sipariş No:</strong> {detaySiparis.id}</div>
              <div><strong>Tarih:</strong> {new Date(detaySiparis.siparisTarihi).toLocaleString()}</div>
              <div><strong>Tutar:</strong> ₺{typeof detaySiparis.toplamTutar === 'number' ? detaySiparis.toplamTutar.toFixed(2) : '0.00'}</div>
              <div><strong>Durum:</strong> {detaySiparis.durum.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
