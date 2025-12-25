export default function YeniSifre() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4 text-red-600">Yeni Şifre Oluştur</h1>
  
          <input
            type="password"
            placeholder="Yeni Şifre"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Yeni Şifre (Tekrar)"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          />
  
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
            onClick={() => alert('Şifreniz başarıyla değiştirildi.')}
          >
            Kaydet
          </button>
        </div>
      </div>
    );
  }
  