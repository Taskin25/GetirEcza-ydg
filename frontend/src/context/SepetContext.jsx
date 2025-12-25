// src/context/SepetContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const SepetContext = createContext();

export const SepetProvider = ({ children }) => {
  const [sepet, setSepet] = useState([]);
  const [toplamAdet, setToplamAdet] = useState(0);
  const token = localStorage.getItem('token');

  // 🔹 Sepeti backend'den getir
  const fetchSepet = async () => {
    try {
      const res = await api.get('/sepet', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const detayliUrunler = await Promise.all(
        res.data.map(async (su) => {
          const urunRes = await api.get(`/urunler/${su.urunId}`);
          const urun = urunRes.data;
          return {
            id: su.id, // sepetUrunId
            urunId: su.urunId,
            ad: urun.ad,
            fiyat: urun.fiyat,
            aciklama: urun.aciklama,
            resim: urun.gorselUrl,
            miktar: su.adet
          };
        })
      );

      setSepet(detayliUrunler);

      // 🔸 Toplam adet güncelle
      const adetToplam = detayliUrunler.reduce((sum, u) => sum + u.miktar, 0);
      setToplamAdet(adetToplam);
    } catch (err) {
      console.error('Sepet verisi alınamadı:', err);
    }
  };

  // 🔹 Sepete ürün ekle (urun.id = urunId)
  const sepeteEkle = async (urun) => {
    try {
      await api.post(
        `/sepet/ekle?urunId=${urun.id}&adet=${urun.adet || 1}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSepet();
    } catch (err) {
      console.error('Ürün sepete eklenemedi:', err);
    }
  };

  // 🔹 Miktarı değiştir (sepetUrunId üzerinden)
  const miktarDegistir = async (sepetUrunId, yeniMiktar) => {
    try {
      if (yeniMiktar < 1) return;
      await api.put(
        `/sepet/guncelle/${sepetUrunId}?adet=${yeniMiktar}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSepet();
    } catch (err) {
      console.error('Miktar güncellenemedi:', err);
    }
  };

  // 🔹 Sepetten ürün çıkar
  const sepettenCikar = async (sepetUrunId) => {
    try {
      await api.delete(`/sepet/sil/${sepetUrunId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSepet();
    } catch (err) {
      console.error('Ürün silinemedi:', err);
    }
  };

  // 🔹 Tüm sepeti temizle (isteğe bağlı)
  const sepetiTemizle = async () => {
    try {
      await api.delete('/sepet/temizle', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSepet();
    } catch (err) {
      console.error('Sepet temizlenemedi:', err);
    }
  };

  useEffect(() => {
    if (token) fetchSepet();
  }, [token]);

  return (
    <SepetContext.Provider
      value={{ sepet, toplamAdet, sepeteEkle, miktarDegistir, sepettenCikar, sepetiTemizle }}
    >
      {children}
    </SepetContext.Provider>
  );
};

export const useSepet = () => useContext(SepetContext);
