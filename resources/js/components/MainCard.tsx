// src/components/MainCard.tsx

const MainCard = ({ article }) => {
    return (
        <div className="bg-white shadow-xl h-full rounded-sm overflow-hidden 
                    grid grid-cols-1 sm:grid-cols-5 relative">

            {/* 1. Blok Warna & Teks (Mengambil 2 dari 5 kolom) */}
            <div className="bg-blue-500 text-white p-6 sm:p-10 lg:p-12 sm:col-span-2 relative">

                {/* Blok Ungu/Biru Tua di Samping Kiri (Absolute Positioning) */}
                {/* Lebar 16px (w-4) dan warna blue-700 */}
                <div className="absolute top-0 left-0 w-4 h-full bg-blue-700"></div>

                <div className="pl-4"> {/* Padding agar konten tidak tertutup blok warna */}
                    <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <p className="font-semibold text-lg mb-6">{article.author}</p>

                    <p className="text-sm font-light">
                        {article.excerpt}
                    </p>
                </div>
            </div>

            {/* 2. Area Gambar (Mengambil 3 dari 5 kolom) */}
            <div className="sm:col-span-3 min-h-[250px] sm:min-h-0">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default MainCard;