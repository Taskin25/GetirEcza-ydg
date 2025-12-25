// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useSepet } from "../context/SepetContext";

export default function Navbar() {
  const location = useLocation();
  const { toplamAdet } = useSepet();

  const scrollToKategori = () => {
    if (location.pathname === "/anasayfa") {
      const kategoriElement = document.getElementById('kategoriler');
      if (kategoriElement) {
        kategoriElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = "/anasayfa#kategoriler";
    }
  };

  return (
    <div>
      <nav className="hidden md:flex bg-red-600 text-white p-4 shadow-md sticky top-0 z-50 justify-between items-center">
        <Link to="/anasayfa" className="text-xl font-bold">Eczane</Link>
        <div className="flex space-x-6">
          <Link to="/anasayfa" className="hover:underline">🏠 Anasayfa</Link>
          <button onClick={scrollToKategori} className="hover:underline">📂 Kategoriler</button>
          <Link to="/favoriler" className="hover:underline">❤️ Favoriler</Link>
          <Link to="/sepet" className="hover:underline relative">
            🛒 Sepet
            {toplamAdet > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {toplamAdet}
              </span>
            )}
          </Link>
          <Link to="/profil" className="hover:underline">👤 Profil</Link>
        </div>
      </nav>

      {/* Mobil Navbar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-300 p-2 flex justify-around items-center md:hidden z-50">
        <Link to="/anasayfa" className="flex flex-col items-center text-red-600 text-xs">
          <span className="text-xl">🏠</span> Anasayfa
        </Link>
        <button onClick={scrollToKategori} className="flex flex-col items-center text-gray-700 text-xs">
          <span className="text-xl">📂</span> Kategoriler
        </button>
        <Link to="/sepet" className="flex flex-col items-center text-gray-700 text-xs relative">
          <span className="text-xl">🛒</span> Sepet
          {toplamAdet > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {toplamAdet}
            </span>
          )}
        </Link>
        <Link to="/favoriler" className="flex flex-col items-center text-gray-700 text-xs">
          <span className="text-xl">❤️</span> Favoriler
        </Link>
        <Link to="/profil" className="flex flex-col items-center text-gray-700 text-xs">
          <span className="text-xl">👤</span> Profil
        </Link>
      </nav>
    </div>
  );
}
