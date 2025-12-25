import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export default function SiparisOnay() {
  const location = useLocation();
  const siparisId = location.state?.siparisId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Siparişiniz Alındı!</h1>
        {siparisId && (
          <p className="text-gray-600 text-sm mb-2">Sipariş numaranız: #{siparisId.toString().padStart(6, '0')}</p>
        )}
        <p className="text-gray-600 text-sm mb-6">Siparişiniz başarıyla alınmıştır. Takip için sipariş geçmişinize göz atabilirsiniz.</p>
        <Link
          to="/anasayfa"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
