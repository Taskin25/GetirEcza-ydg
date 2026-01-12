// src/pages/admin/AdminPanel.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaUsers,
  FaBoxOpen,
  FaChartBar,
  FaCog,
  FaDatabase,
  FaClipboardCheck,
  FaTags
} from 'react-icons/fa';

export default function AdminPanel() {
  const { cikisYap } = useAuth();
  const navigate = useNavigate();

  const handleCikis = () => {
    cikisYap();
    navigate('/admin');
  };

  const kartlar = [
    {
      baslik: "Kullanıcı Yönetimi",
      ikon: <FaUsers size={24} className="text-red-600" />,
      aciklama: "Kayıtlı kullanıcıları görüntüleyin ve yönetin.",
      link: "/admin/kullanicilar",
      testId: "nav-admin-kullanicilar"
    },
    {
      baslik: "Ürün Yönetimi",
      ikon: <FaBoxOpen size={24} className="text-red-600" />,
      aciklama: "Ürünleri düzenleyin, ekleyin veya silin.",
      link: "/admin/urunler",
      testId: "nav-admin-urunler" // ✅ kritik
    },
    {
      baslik: "Sipariş Yönetimi",
      ikon: <FaClipboardCheck size={24} className="text-red-600" />,
      aciklama: "Kullanıcı siparişlerini yönetin ve durumlarını değiştirin.",
      link: "/admin/siparisler",
      testId: "nav-admin-siparisler"
    },
    {
      baslik: "Stok Takibi",
      ikon: <FaDatabase size={24} className="text-red-600" />,
      aciklama: "Düşük stokları kontrol edin, uyarı alın.",
      link: "/admin/stok",
      testId: "nav-admin-stok"
    },
    {
      baslik: "Raporlama",
      ikon: <FaChartBar size={24} className="text-red-600" />,
      aciklama: "Satış, favori ve görüntüleme analizleri.",
      link: "/admin/raporlama",
      testId: "nav-admin-raporlama"
    },
    {
      baslik: "Site Ayarları",
      ikon: <FaCog size={24} className="text-red-600" />,
      aciklama: "Logo, iletişim bilgileri ve site başlığı gibi ayarları yönetin.",
      link: "/admin/ayarlar",
      testId: "nav-admin-ayarlar"
    },
    {
      baslik: "Kategori Yönetimi",
      ikon: <FaTags size={24} className="text-red-600" />,
      aciklama: "Ürün kategorilerini düzenleyin veya silin.",
      link: "/admin/kategoriler",
      testId: "nav-admin-kategoriler"
    }
  ];

  return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-8">
          Hoş geldiniz 👋 Tüm yönetim araçlarını buradan kontrol edebilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kartlar.map((kart, index) => (
              <div
                  key={index}
                  data-testid={kart.testId} // ✅ eklendi
                  onClick={() => navigate(kart.link)}
                  className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-3">
                  {kart.ikon}
                  <h2 className="text-lg font-semibold text-gray-800">{kart.baslik}</h2>
                </div>
                <p className="text-sm text-gray-600">{kart.aciklama}</p>
              </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
              onClick={handleCikis}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded shadow"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
  );
}
