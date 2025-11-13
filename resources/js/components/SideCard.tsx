// src/components/SideCard.jsx
const SideCard = ({ article, position }) => {
    const isTop = position === 'top';

    // Menggunakan flex-col-reverse untuk menaruh gambar di bawah (kartu Lifestyle)
    const orderClass = isTop ? 'flex-col' : 'flex-col-reverse';

    return (
        <div className={`flex ${orderClass} bg-blue-500 text-white 
                    shadow-xl rounded-sm overflow-hidden h-full min-h-[300px]`}>

            {/* Konten Gambar */}
            {/* Di kartu atas, gambar 1/2 tinggi. Di kartu bawah, gambar 2/3 tinggi */}
            <div className={`${isTop ? 'h-1/2' : 'h-2/3'} w-full`}>
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Konten Teks */}
            <div className={`p-4 ${isTop ? 'h-1/2' : 'h-1/3'} flex flex-col justify-between`}>
                <div>
                    <span className="text-xs font-medium uppercase tracking-widest">{article.category}</span>
                    {/* Untuk kartu samping, tambahkan tanggal di bagian atas jika posisinya 'bottom' */}
                    {!isTop && <span className="text-xs ml-3">{article.date}</span>}

                    <h3 className="text-lg font-bold mt-1 leading-snug">
                        {article.title}
                    </h3>
                </div>

                {/* Info Meta di Bawah */}
                <div className="flex justify-between text-xs mt-3 opacity-80">
                    <span>{article.author}</span>
                    {isTop && <span>{article.date}</span>}
                    {/* Anda bisa tambahkan ikon panah di sini */}
                </div>
            </div>
        </div>
    );
};

export default SideCard;