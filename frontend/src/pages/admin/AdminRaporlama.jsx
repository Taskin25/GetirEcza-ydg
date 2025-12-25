import { useEffect, useState } from 'react';
import {
  FaChartBar, FaShoppingCart, FaUsers, FaBox,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import api from '../../api';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminRaporlama() {
  const [istatistik, setIstatistik] = useState({
    toplamSatis: 0,
    toplamSiparis: 0,
    toplamKullanici: 0,
    bugunKayit: 0,
    toplamUrun: 0,
    toplamStok: 0
  });

  const [ekKartlar, setEkKartlar] = useState({
    bugunkuSiparisSayisi: 0,
    iptalEdilenSayisi: 0,
    stokYokSayisi: 0
  });

  const [gunlukSatısData, setGunlukSatisData] = useState({ labels: [], data: [] });
  const [kritikStok, setKritikStok] = useState([]);

  useEffect(() => {
    const fetchVeriler = async () => {
      const token = localStorage.getItem('token');

      const [sipRes, usrRes, urunRes] = await Promise.all([
        api.get('/siparisler', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/kullanicilar', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/urunler', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const siparisler = sipRes.data;
      const kullanicilar = usrRes.data;
      const urunler = urunRes.data;

      const bugun = new Date().toISOString().split('T')[0];
      const bugunKayit = kullanicilar.filter(u => u.kayitTarihi?.startsWith(bugun)).length;
      const toplamSatis = siparisler.reduce((sum, s) => sum + parseFloat(s.toplamTutar || 0), 0);
      const toplamStok = urunler.reduce((sum, u) => sum + (u.stokDurumu || 0), 0);

      setIstatistik({
        toplamSatis,
        toplamSiparis: siparisler.length,
        toplamKullanici: kullanicilar.length,
        bugunKayit,
        toplamUrun: urunler.length,
        toplamStok
      });

      // ✅ Yeni Kartlar
      const bugunkuSiparisSayisi = siparisler.filter(s => s.siparisTarihi?.startsWith(bugun)).length;
      const iptalEdilenSayisi = siparisler.filter(s => s.durum === 'IPTAL_EDILDI').length;
      const stokYokSayisi = urunler.filter(u => u.stokDurumu === 0).length;

      setEkKartlar({ bugunkuSiparisSayisi, iptalEdilenSayisi, stokYokSayisi });

      // 📊 Günlük satış grafiği
      const tarihMap = {};
      siparisler.forEach(s => {
        const tarih = s.siparisTarihi?.split('T')[0];
        if (tarih) {
          tarihMap[tarih] = (tarihMap[tarih] || 0) + 1;
        }
      });
      const labels = Object.keys(tarihMap).sort();
      const data = labels.map(lbl => tarihMap[lbl]);
      setGunlukSatisData({ labels, data });

      // ⚠ Kritik stok
      setKritikStok(urunler.filter(u => u.stokDurumu <= 5));
    };

    fetchVeriler();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">📊 Raporlama Paneli</h1>

      {/* Ana Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FaChartBar />} baslik="Toplam Satış" deger={`₺${istatistik.toplamSatis.toFixed(2)}`} />
        <StatCard icon={<FaShoppingCart />} baslik="Toplam Sipariş" deger={istatistik.toplamSiparis} />
        <StatCard icon={<FaUsers />} baslik="Toplam Kullanıcı" deger={istatistik.toplamKullanici} />
        <StatCard icon={<FaUsers />} baslik="Bugün Kayıt Olan" deger={istatistik.bugunKayit} />
        <StatCard icon={<FaBox />} baslik="Toplam Ürün" deger={istatistik.toplamUrun} />
        <StatCard icon={<FaBox />} baslik="Toplam Stok" deger={`${istatistik.toplamStok} adet`} />

        {/* 🆕 Yeni Kartlar */}
        <StatCard icon={<FaShoppingCart />} baslik="Bugünkü Sipariş" deger={`${ekKartlar.bugunkuSiparisSayisi} adet`} />
        <StatCard icon={<FaExclamationTriangle />} baslik="İptal Edilen Sipariş" deger={`${ekKartlar.iptalEdilenSayisi} adet`} />
        <StatCard icon={<FaBox />} baslik="Stokta Olmayan Ürün" deger={`${ekKartlar.stokYokSayisi} ürün`} />
      </div>

      {/* Grafik */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Günlük Sipariş Sayısı</h2>
        <Line
          data={{
            labels: gunlukSatısData.labels,
            datasets: [{
              label: 'Sipariş Adedi',
              data: gunlukSatısData.data,
              fill: false,
              borderColor: 'rgb(239, 68, 68)',
              tension: 0.4
            }]
          }}
          options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }}
        />
      </div>

      {/* Kritik Stok Listesi */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-600" /> Kritik Stokta Olan Ürünler
        </h2>
        {kritikStok.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {kritikStok.map(u => (
              <li key={u.id} className="flex justify-between">
                <span>{u.ad}</span>
                <span className="font-semibold">{u.stokDurumu} adet</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tüm ürünlerin stoğu yeterli.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, baslik, deger }) {
  return (
    <div className="bg-white p-6 shadow rounded flex flex-col items-center text-center">
      <div className="text-red-600 mb-2 text-2xl">{icon}</div>
      <p className="text-sm text-gray-500">{baslik}</p>
      <h2 className="text-2xl font-bold text-gray-800">{deger}</h2>
    </div>
  );
}
