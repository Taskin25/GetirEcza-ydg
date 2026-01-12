// src/pages/Sepet.jsx
import { useSepet } from "../context/SepetContext";
import { FaTruck, FaShieldAlt, FaRegSmile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sepet() {
    const { sepet, miktarDegistir, sepettenCikar } = useSepet();
    const navigate = useNavigate();

    const toplamFiyat = sepet.reduce(
        (toplam, urun) => toplam + (urun.fiyat || 0) * (urun.miktar || 0),
        0
    );

    return (
        <div className="max-w-screen-md mx-auto p-4 pt-6">
            <h1 className="text-2xl font-bold mb-6 text-red-600">Sepetim</h1>

            {/* ✅ Selenium için: sepet-list her zaman DOM'da */}
            <div className="space-y-4" data-testid="sepet-list">
                {sepet.length === 0 ? (
                    <div className="text-gray-600 text-center mt-20">Sepetiniz boş.</div>
                ) : (
                    sepet.map((urun) => {
                        const sepetUrunId = urun.sepetUrunId ?? urun.id;
                        const miktar = urun.miktar ?? 0;
                        const fiyat = urun.fiyat ?? 0;

                        return (
                            <div
                                key={sepetUrunId}
                                className="flex items-center bg-white shadow rounded p-4 relative"
                                data-testid="sepet-item"
                            >
                                <img
                                    src={urun.resim || urun.gorselUrl}
                                    alt={urun.ad}
                                    className="w-20 h-20 object-cover rounded mr-4 border"
                                />

                                <div className="flex-1">
                                    <h2 className="font-semibold text-gray-800 text-sm mb-1">
                                        {urun.ad}
                                    </h2>

                                    <p className="text-xs text-gray-500 mb-2">{urun.aciklama}</p>

                                    <div className="flex items-center gap-2 text-sm">
                                        <button
                                            onClick={() => miktarDegistir(sepetUrunId, miktar - 1)}
                                            className="bg-gray-200 px-2 rounded"
                                            data-testid="sepet-azalt"
                                            disabled={miktar <= 1}
                                            title="Azalt"
                                        >
                                            -
                                        </button>

                                        <span data-testid="sepet-miktar">{miktar}</span>

                                        <button
                                            onClick={() => miktarDegistir(sepetUrunId, miktar + 1)}
                                            className="bg-gray-200 px-2 rounded"
                                            data-testid="sepet-arttir"
                                            title="Arttır"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right ml-4">
                                    <p className="font-bold text-sm text-red-600 mb-1">
                                        ₺{(fiyat * miktar).toFixed(2)}
                                    </p>

                                    <button
                                        onClick={() => sepettenCikar(sepetUrunId)}
                                        className="text-xs text-red-500 hover:underline"
                                        data-testid="sepet-kaldir-btn"
                                    >
                                        ❌ Kaldır
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {sepet.length > 0 && (
                <>
                    <div className="border-t pt-4 mt-6 flex justify-between items-center">
                        <p className="text-lg font-bold">Toplam:</p>
                        <p className="text-lg font-bold text-red-600">
                            ₺{toplamFiyat.toFixed(2)}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/odeme")}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold"
                        data-testid="sepet-odeme-btn"
                    >
                        Ödemeye Geç
                    </button>
                </>
            )}

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center p-5 border rounded shadow-sm bg-gray-50">
                    <FaTruck className="text-red-600 text-3xl mb-3" />
                    <p className="text-base font-medium">Ücretsiz Kargo</p>
                </div>

                <div className="flex flex-col items-center p-5 border rounded shadow-sm bg-gray-50">
                    <FaShieldAlt className="text-red-600 text-3xl mb-3" />
                    <p className="text-base font-medium">Güvenli Ödeme</p>
                </div>

                <div className="flex flex-col items-center p-5 border rounded shadow-sm bg-gray-50">
                    <FaRegSmile className="text-red-600 text-3xl mb-3" />
                    <p className="text-base font-medium">Memnuniyet Garantisi</p>
                </div>
            </div>
        </div>
    );
}
