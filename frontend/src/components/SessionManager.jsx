import { useEffect } from 'react';
import { useAuth } from "../context/AuthContext";

export default function SessionManager() {
  const { cikisYap } = useAuth();

  useEffect(() => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 dakika

    const updateLastActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const checkSessionTimeout = () => {
      const last = localStorage.getItem('lastActivity');
      const now = Date.now();
      if (last && now - parseInt(last) > SESSION_TIMEOUT) {
        console.log('🕒 Oturum süresi doldu. Otomatik çıkış yapılıyor.');
        cikisYap();
      }
    };

    // İlk etkinlik zamanı kaydı
    updateLastActivity();

    // Her 1 dakikada kontrol et
    const interval = setInterval(checkSessionTimeout, 60 * 1000);

    // Her etkileşimde son zamanı güncelle
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, updateLastActivity));

    return () => {
      clearInterval(interval);
      events.forEach(event => window.removeEventListener(event, updateLastActivity));
    };
  }, [cikisYap]);

  return null; // Bu component sadece arka planda çalışır
}
