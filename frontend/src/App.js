import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SessionManager from './components/SessionManager';

import Anasayfa from './pages/Anasayfa';
import Navbar from './components/Navbar';
import UrunDetay from './pages/UrunDetay';
import Sepet from './pages/Sepet';
import Odeme from './pages/Odeme';
import SiparisOnay from './pages/SiparisOnay';
import Profil from './pages/Profil';
import HesapAyarlari from './pages/HesapAyarlari';
import Siparislerim from './pages/Siparislerim';
import Adreslerim from './pages/Adreslerim';
import Yorumlarim from './pages/Yorumlarim';
import OdemeYontemleri from './pages/OdemeYontemleri';
import Favorilerim from './pages/Favorilerim';
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import SifremiUnuttum from './pages/SifremiUnuttum';
import SifreKodDogrula from './pages/SifreKodDogrula';
import YeniSifre from './pages/YeniSifre';
import KategoriListe from './pages/KategoriListe';

import AdminGiris from './pages/admin/AdminGiris';
import AdminPanel from './pages/admin/AdminPanel';
import AdminKullanicilar from './pages/admin/AdminKullanicilar';
import AdminUrunler from './pages/admin/AdminUrunler';
import AdminSiparisler from './pages/admin/AdminSiparisler';
import AdminStokTakip from './pages/admin/AdminStokTakip';
import AdminRaporlama from './pages/admin/AdminRaporlama';
import AdminSiteAyarlar from './pages/admin/AdminSiteAyarlar';
import AdminKategoriler from './pages/admin/AdminKategoriler';

import { useAuth } from './context/AuthContext';

export default function App() {
    const { kullaniciGirisi, adminGirisi, sonGirisTipi } = useAuth();

    return (
        <Router>
            {(kullaniciGirisi || adminGirisi) && <SessionManager />}

            {/* Navbar sadece kullanıcı giriş yaptıysa görünür */}
            {kullaniciGirisi && sonGirisTipi === 'kullanici' && <Navbar />}

            <Routes>
                {/* ================= ADMIN ================= */}
                {adminGirisi && sonGirisTipi === 'admin' ? (
                    <>
                        <Route path="/admin" element={<Navigate to="/admin/panel" />} />
                        <Route path="/admin/panel" element={<AdminPanel />} />
                        <Route path="/admin/kullanicilar" element={<AdminKullanicilar />} />
                        <Route path="/admin/urunler" element={<AdminUrunler />} />
                        <Route path="/admin/siparisler" element={<AdminSiparisler />} />
                        <Route path="/admin/stok" element={<AdminStokTakip />} />
                        <Route path="/admin/raporlama" element={<AdminRaporlama />} />
                        <Route path="/admin/ayarlar" element={<AdminSiteAyarlar />} />
                        <Route path="/admin/kategoriler" element={<AdminKategoriler />} />
                        <Route path="*" element={<Navigate to="/admin/panel" />} />
                    </>
                ) : kullaniciGirisi && sonGirisTipi === 'kullanici' ? (
                    /* ================= USER ================= */
                    <>
                        {/* Selenium için: / ve /urunler ürün listesine götürebilir */}
                        <Route path="/" element={<Navigate to="/anasayfa" />} />
                        <Route path="/anasayfa" element={<Anasayfa />} />
                        <Route path="/urunler" element={<Anasayfa />} />

                        <Route path="/urun/:id" element={<UrunDetay />} />
                        <Route path="/sepet" element={<Sepet />} />
                        <Route path="/odeme" element={<Odeme />} />
                        <Route path="/siparis-onay" element={<SiparisOnay />} />

                        <Route path="/profil" element={<Profil />} />
                        <Route path="/profil/ayarlar" element={<HesapAyarlari />} />
                        <Route path="/profil/siparislerim" element={<Siparislerim />} />
                        <Route path="/profil/adreslerim" element={<Adreslerim />} />
                        <Route path="/profil/yorumlarim" element={<Yorumlarim />} />
                        <Route path="/profil/odeme-yontemleri" element={<OdemeYontemleri />} />

                        <Route path="/favoriler" element={<Favorilerim />} />
                        <Route path="/kategori/:kategori" element={<KategoriListe />} />

                        {/* en sona */}
                        <Route path="*" element={<Navigate to="/anasayfa" />} />
                    </>
                ) : (
                    /* ================= GUEST ================= */
                    <>
                        <Route path="/giris" element={<Giris />} />
                        <Route path="/kayit" element={<Kayit />} />
                        <Route path="/sifre-sifirla" element={<SifremiUnuttum />} />
                        <Route path="/kod-onay" element={<SifreKodDogrula />} />
                        <Route path="/yeni-sifre" element={<YeniSifre />} />

                        <Route path="/admin" element={<AdminGiris />} />
                        <Route path="*" element={<Navigate to="/giris" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}
