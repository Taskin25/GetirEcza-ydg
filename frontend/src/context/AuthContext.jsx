import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [kullaniciGirisi, setKullaniciGirisi] = useState(false);
  const [adminGirisi, setAdminGirisi] = useState(false);
  const [sonGirisTipi, setSonGirisTipi] = useState(null); // 'kullanici' | 'admin'

  useEffect(() => {
    const admin = localStorage.getItem('adminGirisi') === 'true';
    const kullanici = localStorage.getItem('kullaniciGirisi') === 'true';
    const tip = localStorage.getItem('sonGirisTipi');
    setAdminGirisi(admin);
    setKullaniciGirisi(kullanici);
    setSonGirisTipi(tip);
  }, []);

  const girisYap = async ({ email, sifre }) => {
    try {
      const response = await api.post('/auth/login', { email, sifre });

      const token = response.data.token;
      const role = response.data.role || response.data.rol;
      const { kullaniciId, email: kullaniciEmail } = response.data;

      if (!token || !role) throw new Error('Token veya rol eksik');

      //  Token ve kullanıcı bilgilerini kaydet
      localStorage.setItem('token', token);
      localStorage.setItem('kullaniciId', kullaniciId);
      localStorage.setItem('email', kullaniciEmail);
      console.log('🔐 Token kaydedildi:', token);

      if (role === 'ROLE_ADMIN') {
        localStorage.setItem('adminGirisi', 'true');
        setAdminGirisi(true);
        setSonGirisTipi('admin');
        localStorage.setItem('sonGirisTipi', 'admin');
        console.log('🛡️ Admin girişi yapıldı');
      } else {
        localStorage.setItem('kullaniciGirisi', 'true');
        setKullaniciGirisi(true);
        setSonGirisTipi('kullanici');
        localStorage.setItem('sonGirisTipi', 'kullanici');
        console.log('🙋 Kullanıcı girişi yapıldı');
      }
    } catch (error) {
      console.error('❌ Giriş hatası:', error);
      throw error;
    }
  };

  const cikisYap = () => {
    const tip = localStorage.getItem('sonGirisTipi');

    //  Çıkış yaparken tüm localStorage verilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('kullaniciId');
    localStorage.removeItem('email');
    localStorage.removeItem('kullaniciGirisi');
    localStorage.removeItem('adminGirisi');
    localStorage.removeItem('sonGirisTipi');

    setKullaniciGirisi(false);
    setAdminGirisi(false);
    setSonGirisTipi(null);

    // Yönlendirme
    if (tip === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/giris';
    }
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
