import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [kullaniciGirisi, setKullaniciGirisi] = useState(false);
  const [adminGirisi, setAdminGirisi] = useState(false);
  const [sonGirisTipi, setSonGirisTipi] = useState(null); // 'kullanici' | 'admin'

  const syncFromStorage = () => {
    const admin = localStorage.getItem('adminGirisi') === 'true';
    const kullanici = localStorage.getItem('kullaniciGirisi') === 'true';
    const tip = localStorage.getItem('sonGirisTipi');
    setAdminGirisi(admin);
    setKullaniciGirisi(kullanici);
    setSonGirisTipi(tip);
  };

  useEffect(() => {
    syncFromStorage();

    // (Opsiyonel ama stabil) başka sekmede login/logout olursa state güncellensin
    const onStorage = (e) => {
      if (!e.key) return;
      const keys = ['adminGirisi', 'kullaniciGirisi', 'sonGirisTipi', 'token', 'kullaniciId'];
      if (keys.includes(e.key)) syncFromStorage();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const girisYap = async ({ email, sifre }) => {
    try {
      // ✅ önce eski flag’leri temizle (admin->user / user->admin geçişi sorunsuz)
      localStorage.removeItem('adminGirisi');
      localStorage.removeItem('kullaniciGirisi');
      localStorage.removeItem('sonGirisTipi');
      setAdminGirisi(false);
      setKullaniciGirisi(false);
      setSonGirisTipi(null);

      const response = await api.post('/auth/login', { email, sifre });

      const token = response?.data?.token;
      const role = response?.data?.role || response?.data?.rol;

      const kullaniciId =
          response?.data?.kullaniciId ??
          response?.data?.userId ??
          response?.data?.id;

      const kullaniciEmail = response?.data?.email ?? email;

      if (!token || !role) throw new Error('Token veya rol eksik');

      // ✅ Token ve kullanıcı bilgilerini kaydet
      localStorage.setItem('token', token);
      if (kullaniciId !== undefined && kullaniciId !== null) {
        localStorage.setItem('kullaniciId', String(kullaniciId));
      }
      localStorage.setItem('email', kullaniciEmail);

      if (role === 'ROLE_ADMIN') {
        localStorage.setItem('adminGirisi', 'true');
        localStorage.setItem('sonGirisTipi', 'admin');
        setAdminGirisi(true);
        setSonGirisTipi('admin');
      } else {
        localStorage.setItem('kullaniciGirisi', 'true');
        localStorage.setItem('sonGirisTipi', 'kullanici');
        setKullaniciGirisi(true);
        setSonGirisTipi('kullanici');
      }
    } catch (error) {
      console.error('❌ Giriş hatası:', error);
      throw error;
    }
  };

  const cikisYap = () => {
    const tip = localStorage.getItem('sonGirisTipi');

    localStorage.removeItem('token');
    localStorage.removeItem('kullaniciId');
    localStorage.removeItem('email');
    localStorage.removeItem('kullaniciGirisi');
    localStorage.removeItem('adminGirisi');
    localStorage.removeItem('sonGirisTipi');

    setKullaniciGirisi(false);
    setAdminGirisi(false);
    setSonGirisTipi(null);

    window.location.href = tip === 'admin' ? '/admin' : '/giris';
  };

  return (
      <AuthContext.Provider
          value={{
            kullaniciGirisi,
            adminGirisi,
            sonGirisTipi,
            girisYap,
            cikisYap,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
