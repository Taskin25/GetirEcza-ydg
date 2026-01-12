// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSepet } from "../context/SepetContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toplamAdet } = useSepet();

  const scrollToKategori = () => {
    // Zaten anasayfadaysak direkt scroll
    if (location.pathname === "/anasayfa") {
      const kategoriElement = document.getElementById('kategoriler');
      if (kategoriElement) {
        kategoriElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // SPA şekilde anasayfaya git, render olunca scroll yap
    navigate("/anasayfa");
    setTimeout(() => {
      const kategoriElement = document.getElementById('kategoriler');
      if (kategoriElement) {
        kategoriElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  return (
      <div>
        {/* Desktop Navbar */}
        <nav className="hidden md:flex bg-red-600 text-white p-4 shadow-md sticky top-0 z-50 justify-between items-center">
          <Link to="/anasayfa" className="text-xl font-bold" data-testid="nav-logo">Eczane</Link>

          <div className="flex space-x-6">
            <Link to="/anasayfa" className="hover:underline" data-testid="nav-anasayfa">🏠 Anasayfa</Link>

            <button onClick={scrollToKategori} className="hover:underline" data-testid="nav-kategoriler">
              📂 Kategoriler
            </button>

            <Link to="/favoriler" className="hover:underline" data-testid="nav-favoriler">❤️ Favoriler</Link>

            <Link to="/sepet" className="hover:underline relative" data-testid="nav-sepet">
              🛒 Sepet
              {toplamAdet > 0 && (
                  <span className="absolute -top-2 -right-3 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {toplamAdet}
              </span>
              )}
            </Link>

            <Link to="/profil" className="hover:underline" data-testid="nav-profil">👤 Profil</Link>
          </div>
        </nav>

        {/* Mobil Navbar */}
        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-300 p-2 flex justify-around items-center md:hidden z-50">
          <Link to="/anasayfa" className="flex flex-col items-center text-red-600 text-xs" data-testid="mnav-anasayfa">
            <span className="text-xl">🏠</span> Anasayfa
          </Link>

          <button onClick={scrollToKategori} className="flex flex-col items-center text-gray-700 text-xs" data-testid="mnav-kategoriler">
            <span className="text-xl">📂</span> Kategoriler
          </button>

          <Link to="/sepet" className="flex flex-col items-center text-gray-700 text-xs relative" data-testid="mnav-sepet">
            <span className="text-xl">🛒</span> Sepet
            {toplamAdet > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {toplamAdet}
            </span>
            )}
          </Link>

          <Link to="/favoriler" className="flex flex-col items-center text-gray-700 text-xs" data-testid="mnav-favoriler">
            <span className="text-xl">❤️</span> Favoriler
          </Link>

          <Link to="/profil" className="flex flex-col items-center text-gray-700 text-xs" data-testid="mnav-profil">
            <span className="text-xl">👤</span> Profil
          </Link>
        </nav>
      </div>
  );
}
