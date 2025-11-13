// src/components/NewsLayout.tsx

import React from 'react';
import { motion } from 'framer-motion';
import homeStyles from '../../css/home.module.css';

interface Article {
    id: number;
    title: string;
    author: string;
    excerpt?: string;
    imageUrl: string;
    category: string;
    date: string;
}

interface NewsLayoutProps {
    articles: Article[];
}

export default function NewsLayout({ articles }: NewsLayoutProps) {
    if (!articles || articles.length === 0) {
        return <div className="text-center text-gray-500">Tidak ada artikel</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Article - Left Side */}
            <motion.div
                className="lg:col-span-2"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="flex bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer border-l-8 border-blue-500 min-h-[500px]"
                    whileHover={{ boxShadow: "0 30px 40px rgba(0,0,0,0.15)" }}
                >
                    {/* Left Content Section with Blue Background - Memanjang */}
                    <div className="bg-white text-gray-800 p-8 w-1/2 flex flex-col justify-center items-center">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold mb-6 leading-tight text-blue-500">
                                {articles[0].title}
                            </h1>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {articles[0].excerpt}
                            </p>
                        </div>

                        <motion.a
                            href={`/berita/${articles[0].id}`}
                            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full mt-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >Baca Selengkapnya</motion.a>


                        <div className="w-full">
                            <p className="text-sm font-semibold text-gray-800 mt-50">{articles[0].author}</p>
                            <p className="text-xs text-gray-500 mt-2">{articles[0].category}</p>
                        </div>
                    </div>

                    {/* Right Image Section - Memanjang */}
                    <motion.div
                        className="w-1/2 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    >
                        <motion.img
                            src={articles[0].imageUrl}
                            alt={articles[0].title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Side Articles - Right Side */}
            <div className="space-y-6">
                {articles.slice(1, 3).map((article, index) => (
                    <motion.div
                        key={article.id}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer text-white"
                            whileHover={{ boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
                        >
                            {/* Image */}
                            <motion.div
                                className="h-48 overflow-hidden"
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.4 }}
                            >
                                <motion.img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.div>

                            {/* Content */}
                            <div className="p-6">
                                <span className="text-xs font-bold bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                                    {article.category}
                                </span>
                                <h3 className="text-xl font-bold mt-4 leading-tight text-gray-800"> {/* Ubah di sini */}
                                    {article.title}
                                </h3>
                                <div className="flex justify-between items-center mt-4 text-sm text-gray-800"> {/* Ubah di sini */}
                                    <span>{article.author}</span>
                                    <span>{article.date}</span>
                                </div>
                                <a href={`/berita/${article.id}`} className="text-blue-500 hover:underline mt-2 block">
                                    Baca Selengkapnya
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}