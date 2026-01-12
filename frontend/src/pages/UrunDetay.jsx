// src/pages/UrunDetay.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../api";
import { useSepet } from "../context/SepetContext";

export default function UrunDetay() {
  const { id } = useParams();

  const [urun, setUrun] = useState(null);
  const [favori, setFavori] = useState(false);
  const [adet, setAdet] = useState(1);

  const [yorumlar, setYorumlar] = useState([]);
  const [yorum, setYorum] = useState("");

  const [aktifSekme, setAktifSekme] = useState("ozellikler");
  const [benzerUrunler, setBenzerUrunler] = useState([]);

  const { sepeteEkle } = useSepet();

  const token = localStorage.getItem("token");
  const kullaniciId = Number(localStorage.getItem("kullaniciId"));

  const fetchData = useCallback(async () => {
    try {
      const urunRes = await api.get(`/urunler/${id}`);
      const urunData = urunRes.data;
      setUrun(urunData);

      const yorumRes = await api.get(`/yorumlar/urun/${id}`);
      setYorumlar(yorumRes.data || []);

      const benzerRes = await api.get(
          `/urunler/kategori/${urunData.kategoriId}/benzer`,
          { params: { haricUrunId: urunData.id } }
      );
      setBenzerUrunler(benzerRes.data || []);

      if (token) {
        const favRes = await api.get(`/favoriler`);
        const favList = favRes.data || [];
        setFavori(favList.some((f) => f.urunId === Number(id)));
      } else {
        setFavori(false);
      }
    } catch (err) {
      console.error("Veri çekilemedi:", err);
    }
  }, [id, token]);

  useEffect(() => {
    if (id) fetchData();
    window.scrollTo(0, 0);
  }, [id, fetchData]);

  const toggleFavori = async () => {
    try {
      if (!token) return;
      if (!Number.isFinite(kullaniciId) || kullaniciId <= 0) {
        console.warn("kullaniciId bulunamadı. Favori işlemi yapılamaz.");
        return;
      }

      if (favori) {
        await api.delete(`/favoriler/kaldir`, {
          params: { kullaniciId, urunId: Number(id) },
        });
      } else {
        await api.post("/favoriler", {
          kullaniciId,
          urunId: Number(id),
        });
      }

      // ✅ En sağlam: tekrar oku
      const favRes = await api.get(`/favoriler`);
      const favList = favRes.data || [];
      setFavori(favList.some((f) => f.urunId === Number(id)));
    } catch (err) {
      console.error("Favori işlemi başarısız:", err);
    }
  };

  const yorumEkle = async () => {
    if (!yorum.trim()) return;
    try {
      if (!token) return;
      if (!Number.isFinite(kullaniciId) || kullaniciId <= 0) {
        console.warn("kullaniciId bulunamadı. Yorum eklenemez.");
        return;
      }

      await api.post("/yorumlar", {
        urunId: urun.id,
        kullaniciId,
        icerik: yorum,
      });

      setYorum("");

      const guncel = await api.get(`/yorumlar/urun/${id}`);
      setYorumlar(guncel.data || []);
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
    }
  };

  const urunuSepeteEkle = () => {
    if (!urun || urun.stokDurumu === 0) return;

    if (adet > urun.stokDurumu) {
      alert(`Stokta sadece ${urun.stokDurumu} adet ürün kaldı!`);
      return;
    }

    sepeteEkle({
      id: urun.id,
      ad: urun.ad,
      fiyat: urun.fiyat,
      resim: urun.gorselUrl,
      aciklama: urun.aciklama,
      adet,
      miktar: adet,
    });
  };

  if (!urun) return <div className="p-10 text-gray-600">Yükleniyor...</div>;

  const fiyat = Number(urun.fiyat || 0);

  return (
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <img
              src={urun.gorselUrl}
              alt={urun.ad}
              className="w-full h-[400px] object-contain rounded"
          />

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2"  data-testid="urun-baslik"
                >{urun.ad}</h1>
                <p className="text-red-600 text-xl font-bold">₺{fiyat.toFixed(2)}</p>
              </div>

              <button
                  onClick={toggleFavori}
                  className="text-2xl"
                  data-testid={`urun-${urun.id}-favori`}
              >
                {favori ? (
                    <FaHeart className="text-red-500" />
                ) : (
                    <FaRegHeart className="text-gray-400" />
                )}
              </button>
            </div>

            {urun.stokDurumu === 0 ? (
                <p className="text-red-600 text-sm font-semibold mb-2">
                  Bu ürün şu anda <strong>stokta yok</strong>.
                </p>
            ) : urun.stokDurumu <= 5 ? (
                <p className="text-yellow-600 text-sm font-semibold mb-2">
                  Son {urun.stokDurumu} ürün!
                </p>
            ) : null}

            <div className="flex items-center mb-6">
              <button
                  onClick={() => setAdet(adet > 1 ? adet - 1 : 1)}
                  className="px-3 py-1 bg-gray-200 rounded-l"
                  data-testid="urun-adet-azalt"
              >
                -
              </button>

              <span className="px-4" data-testid="urun-adet">
              {adet}
            </span>

              <button
                  onClick={() => {
                    if (adet < urun.stokDurumu) setAdet(adet + 1);
                    else alert(`Stokta sadece ${urun.stokDurumu} adet kaldı.`);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-r"
                  data-testid="urun-adet-arttir"
              >
                +
              </button>
            </div>

            <button
                onClick={urunuSepeteEkle}
                disabled={urun.stokDurumu === 0}
                data-testid={`urun-${urun.id}-sepete-ekle`}
                className={`px-6 py-3 rounded text-white font-semibold ${
                    urun.stokDurumu === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {urun.stokDurumu === 0 ? "Stokta Yok" : "Sepete Ekle"}
            </button>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <div className="flex gap-4 text-sm font-semibold text-gray-600 border-b pb-2 mb-4">
            <button
                onClick={() => setAktifSekme("ozellikler")}
                data-testid="tab-ozellikler"
                className={
                  aktifSekme === "ozellikler"
                      ? "text-red-600 border-b-2 border-red-600"
                      : ""
                }
            >
              Ürün Özellikleri
            </button>

            <button
                onClick={() => setAktifSekme("yorumlar")}
                data-testid="tab-yorumlar"
                className={
                  aktifSekme === "yorumlar"
                      ? "text-red-600 border-b-2 border-red-600"
                      : ""
                }
            >
              Yorumlar ({yorumlar.length})
            </button>
          </div>

          {aktifSekme === "ozellikler" && (
              <p className="text-sm text-gray-700 whitespace-pre-line">{urun.aciklama}</p>
          )}

          {aktifSekme === "yorumlar" && (
              <div>
                <ul className="mb-4 space-y-4" data-testid="yorum-list">
                  {yorumlar.map((y) => (
                      <li key={y.id} className="bg-gray-50 p-3 rounded shadow">
                        <div className="text-sm text-gray-600 font-medium">
                          {y.kullaniciAdSoyad}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(y.tarih).toLocaleDateString("tr-TR")}
                        </div>
                        <div className="text-sm text-gray-800 mt-1">- {y.icerik}</div>
                      </li>
                  ))}
                </ul>

                <textarea
                    data-testid="yorum-input"
                    className="w-full border rounded px-3 py-2 text-sm mb-2"
                    rows="3"
                    value={yorum}
                    onChange={(e) => setYorum(e.target.value)}
                    placeholder="Yorum yaz..."
                />

                <button
                    data-testid="yorum-gonder"
                    onClick={yorumEkle}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yorumu Gönder
                </button>
              </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4">Benzer Ürünler</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {benzerUrunler.map((b) => (
                <div
                    key={b.id}
                    className="border rounded p-3 shadow-sm hover:shadow-md transition"
                    data-testid={`benzer-urun-${b.id}`}
                >
                  <img
                      src={b.gorselUrl}
                      className="h-40 w-full object-cover mb-2 rounded"
                      alt={b.ad}
                  />
                  <h4 className="text-sm font-semibold">{b.ad}</h4>
                  <p className="text-red-500 text-sm mb-2">
                    ₺{Number(b.fiyat || 0).toFixed(2)}
                  </p>
                  <Link
                      to={`/urun/${b.id}`}
                      className="inline-block text-sm font-semibold text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    İncele
                  </Link>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}
