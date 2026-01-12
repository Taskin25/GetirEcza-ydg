// src/context/SepetContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api";

const SepetContext = createContext(null);

export const SepetProvider = ({ children }) => {
  const [sepet, setSepet] = useState([]);
  const [toplamAdet, setToplamAdet] = useState(0);

  const tokenVarMi = () => !!localStorage.getItem("token");

  const fetchSepet = useCallback(async () => {
    if (!tokenVarMi()) {
      setSepet([]);
      setToplamAdet(0);
      return;
    }

    try {
      const res = await api.get("/sepet"); // interceptor token ekler
      const sepetUrunleri = res.data || [];

      // Her sepet kaydı için ürün detayını çek
      const detayli = await Promise.all(
          sepetUrunleri.map(async (su) => {
            const urunRes = await api.get(`/urunler/${su.urunId}`);
            const urun = urunRes.data;

            return {
              id: su.id,              // sepet satır id
              sepetUrunId: su.id,     // açık isim
              urunId: su.urunId,

              ad: urun?.ad || "",
              fiyat: urun?.fiyat ?? 0,
              aciklama: urun?.aciklama || "",
              resim: urun?.gorselUrl || "",

              miktar: su.adet ?? 1,
            };
          })
      );

      setSepet(detayli);

      const adetToplam = detayli.reduce((sum, u) => sum + (u.miktar || 0), 0);
      setToplamAdet(adetToplam);
    } catch (err) {
      console.error("Sepet verisi alınamadı:", err);
      setSepet([]);
      setToplamAdet(0);
    }
  }, []);

  const sepeteEkle = async (urun) => {
    try {
      if (!tokenVarMi()) return;

      const urunId = urun?.id;
      if (!urunId) return;

      const adet = urun?.adet || urun?.miktar || 1;

      await api.post(`/sepet/ekle?urunId=${urunId}&adet=${adet}`, null);
      await fetchSepet();
    } catch (err) {
      console.error("Ürün sepete eklenemedi:", err);
    }
  };

  const miktarDegistir = async (sepetUrunId, yeniMiktar) => {
    try {
      if (!tokenVarMi()) return;
      if (!sepetUrunId) return;
      if (yeniMiktar < 1) return;

      await api.put(`/sepet/guncelle/${sepetUrunId}?adet=${yeniMiktar}`, null);
      await fetchSepet();
    } catch (err) {
      console.error("Miktar güncellenemedi:", err);
    }
  };

  const sepettenCikar = async (sepetUrunId) => {
    try {
      if (!tokenVarMi()) return;
      if (!sepetUrunId) return;

      await api.delete(`/sepet/sil/${sepetUrunId}`);
      await fetchSepet();
    } catch (err) {
      console.error("Ürün silinemedi:", err);
    }
  };

  const sepetiTemizle = async () => {
    try {
      if (!tokenVarMi()) return;

      await api.delete("/sepet/temizle");
      await fetchSepet();
    } catch (err) {
      console.error("Sepet temizlenemedi:", err);
    }
  };

  // token değişince de sepeti yenile (login/logout sonrası)
  useEffect(() => {
    fetchSepet();
  }, [fetchSepet]);

  return (
      <SepetContext.Provider
          value={{
            sepet,
            toplamAdet,
            fetchSepet,
            sepeteEkle,
            miktarDegistir,
            sepettenCikar,
            sepetiTemizle,
          }}
      >
        {children}
      </SepetContext.Provider>
  );
};

export const useSepet = () => {
  const ctx = useContext(SepetContext);
  if (!ctx) throw new Error("useSepet, SepetProvider içinde kullanılmalı");
  return ctx;
};
