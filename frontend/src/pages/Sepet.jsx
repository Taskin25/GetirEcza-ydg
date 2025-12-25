// src/pages/Sepet.jsx
import { useSepet } from '../context/SepetContext';
import { FaTruck, FaShieldAlt, FaRegSmile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sepet() {
  const { sepet, miktarDegistir, sepettenCikar } = useSepet();
  const navigate = useNavigate();

  const toplamFiyat = sepet.reduce(
    (toplam, urun) => toplam + urun.fiyat * urun.miktar,
    0
  );

  return (
    <div className="max-w-screen-md mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Sepetim</h1>

      {sepet.length === 0 ? (
        <p className="text-gray-600 text-center mt-20">Sepetiniz boş.</p>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {sepet.map((urun) => (
              <div key={urun.id} className="flex items-center bg-white shadow rounded p-4 relative">
                <img
                  src={urun.resim}
                  alt={urun.ad}
                  className="w-20 h-20 object-cover rounded mr-4 border"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 text-sm mb-1">{urun.ad}</h2>
                  <p className="text-xs text-gray-500 mb-2">{urun.aciklama}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => miktarDegistir(urun.id, urun.miktar - 1)}
                      className="bg-gray-200 px-2 rounded"
                    >
                      -
                    </button>
                    <span>{urun.miktar}</span>
                    <button
                      onClick={() => miktarDegistir(urun.id, urun.miktar + 1)}
                      className="bg-gray-200 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-sm text-red-600 mb-1">
                    ₺{(urun.fiyat * urun.miktar).toFixed(2)}
                  </p>
                  <button
                    onClick={() => sepettenCikar(urun.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    ❌ Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <p className="text-lg font-bold">Toplam:</p>
            <p className="text-lg font-bold text-red-600">₺{toplamFiyat.toFixed(2)}</p>
          </div>

          <button
            onClick={() => navigate('/odeme')}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold"
          >
            Ödemeye Geç
          </button>

          {/* Ek Bilgilendirme Kartları */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-5 border rounded shadow-sm bg-gray-50">
              <FaTruck className="text-red-600 text-3xl mb-3" />
              <p className="text-base font-medium">Ücretsiz Kargo</p>
              <p className="text-xs text-gray-500 mt-1">150₺ ve üzeri siparişlerde geçerli</p>
            </div>
            <div className="flex flex-col items-center p-5 border rounded shadow-sm bg-gray-50">
              <FaShieldAlt className="text-red-600 text-3xl mb-3" />
              <p className="text-base font-medium">Güvenli Ödeme</p>
              <p className="text-xs text-gray-500 mt-1">256-bit SSL sertifikalı sistem</p>
            </div>
            <div className="flex flex-col items-center p-5 border rounded shadow-sm bg-gray-50">
              <FaRegSmile className="text-red-600 text-3xl mb-3" />
              <p className="text-base font-medium">Memnuniyet Garantisi</p>
              <p className="text-xs text-gray-500 mt-1">Koşulsuz iade hakkı 7 gün</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
