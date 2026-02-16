import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { Checkbox } from '@/components/ui/checkbox';

interface ScoreItem {
    section: string;
    score: number;
    comments: string;
}

interface ReviewScoringFormProps {
    onChange: (scores: ScoreItem[], totalScore: number, recommendation: number) => void;
    maxFunding?: number;
    initialScores?: ScoreItem[];
    isReadOnly?: boolean;
    type?: 'penelitian' | 'pengabdian';
}

const LUARAN_OPTIONS = [
    { id: 'scopus', label: 'Jurnal Internasional Bereputasi Scopus', bonus: 2000000 },
    { id: 'sinta12', label: 'Jurnal Terakreditasi SINTA 1 - 2', bonus: 2000000 },
    { id: 'internasional', label: 'Jurnal Internasional', bonus: 1000000 },
    { id: 'sinta3', label: 'Jurnal Nasional Terakreditasi SINTA 3', bonus: 1000000 },
];

const ReviewScoringForm: React.FC<ReviewScoringFormProps> = ({
    onChange,
    maxFunding = 7000000,
    initialScores,
    isReadOnly,
    type = 'penelitian'
}) => {
    const labelType = type === 'penelitian' ? 'Penelitian' : 'Pengabdian';

    const SECTIONS = [
        {
            title: 'Bab I. Pendahuluan', items: [
                { id: 'pend_a', label: `a. Kesesuaian latar belakang dengan topik kajian` },
                { id: 'pend_b', label: `b. Urgensi ${labelType.toLowerCase()}` },
                { id: 'pend_c', label: `c. Ketajaman perumusan masalah` },
                { id: 'pend_d', label: `d. Inovasi pendekatan pemecahan masalah` },
                { id: 'pend_e', label: `e. State of the art dan kebaruan` },
            ]
        },
        {
            title: 'Bab II. Metode ' + (type === 'penelitian' ? 'Penelitian' : 'Pengabdian'), items: [
                { id: 'met_a', label: `a. Kesesuaian dan ketepatan metode ${labelType.toLowerCase()} yang digunakan mencakup kesesuaian instrumen, populasi dan sampel, teknik pensampelan, serta teknik analisa data yang digunakan` },
                { id: 'met_b', label: `b. Kesesuaian metode dengan waktu, RAB, dan target publikasi` },
            ]
        },
        {
            title: 'Bab III. Kelayakan P2M', items: [
                { id: 'kel_a', label: 'a. Kesesuaian waktu' },
                { id: 'kel_b', label: 'b. Kesesuaian biaya' },
                { id: 'kel_c', label: 'c. Kesesuaian personalia dan pembagian tugas' },
            ]
        },
        {
            title: 'Referensi', items: [
                { id: 'ref_a', label: 'a. Kebaruan referensi' },
                { id: 'ref_b', label: 'b. Relevansi dan kualitas referensi' },
            ]
        },
    ];

    const ALL_SECTION_IDS = SECTIONS.flatMap(s => s.items.map(i => i.id));

    const [scores, setScores] = useState<ScoreItem[]>(() => {
        if (initialScores && initialScores.length > 0) {
            return ALL_SECTION_IDS.map(id => {
                const found = initialScores.find(is => is.section === id);
                return found || { section: id, score: 0, comments: '' };
            });
        }
        return ALL_SECTION_IDS.map(id => ({ section: id, score: 0, comments: '' }));
    });

    const [selectedLuaran, setSelectedLuaran] = useState<string[]>(() => {
        if (initialScores) {
            const luaranSection = initialScores.find(s => s.section === 'selected_luaran');
            return luaranSection ? luaranSection.comments?.split(',') || [] : [];
        }
        return [];
    });

    useEffect(() => {
        if (initialScores && initialScores.length > 0) {
            setScores(ALL_SECTION_IDS.map(id => {
                const found = initialScores.find(is => is.section === id);
                return found || { section: id, score: 0, comments: '' };
            }));

            const luaranSection = initialScores.find(s => s.section === 'selected_luaran');
            const luaranIds = luaranSection ? luaranSection.comments?.split(',') || [] : [];
            setSelectedLuaran(luaranIds);
        }
    }, [initialScores]);

    const calculateFunding = (avgScore: number, luaranIds: string[]) => {
        let substansiFunding = 0;
        if (avgScore >= 87.01) substansiFunding = 5000000;
        else if (avgScore >= 75.01 && avgScore <= 87.00) substansiFunding = 4000000;
        else if (avgScore >= 63.01 && avgScore <= 75.00) substansiFunding = 3000000;
        else if (avgScore >= 51.01 && avgScore <= 63.00) substansiFunding = 2000000;

        const luaranFunding = luaranIds.reduce((acc, id) => {
            const opt = LUARAN_OPTIONS.find(o => o.id === id);
            return acc + (opt?.bonus || 0);
        }, 0);

        return substansiFunding + luaranFunding;
    };

    const getAvgSubstanceScore = () => {
        const substanceScores = scores.filter(s => ALL_SECTION_IDS.includes(s.section));
        if (substanceScores.length === 0) return 0;
        const total = substanceScores.reduce((acc, s) => acc + (Number(s.score) || 0), 0);
        return total / substanceScores.length;
    };

    useEffect(() => {
        const avgScore = getAvgSubstanceScore();
        const recommendation = calculateFunding(avgScore, selectedLuaran);

        const finalScores = [...scores];
        const luaranIndex = finalScores.findIndex(s => s.section === 'selected_luaran');
        const luaranComments = selectedLuaran.join(',');

        if (luaranIndex !== -1) {
            finalScores[luaranIndex] = { section: 'selected_luaran', score: 0, comments: luaranComments };
        } else {
            finalScores.push({ section: 'selected_luaran', score: 0, comments: luaranComments });
        }

        onChange(finalScores, avgScore, recommendation);
    }, [scores, selectedLuaran]);

    const handleScoreChange = (id: string, val: number) => {
        setScores(prev => prev.map(s => s.section === id ? { ...s, score: val } : s));
    };

    const handleCommentChange = (id: string, val: string) => {
        setScores(prev => prev.map(s => s.section === id ? { ...s, comments: val } : s));
    };

    const toggleLuaran = (id: string) => {
        if (isReadOnly) return;
        setSelectedLuaran(prev => prev.includes(id) ? [] : [id]);
    };

    const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const avgScore = getAvgSubstanceScore();

    return (
        <Card className="border-gray-200">
            <CardHeader className="bg-gray-50 pb-4 border-b border-gray-100">
                <CardTitle className="text-base text-gray-800">Standar Penilaian {labelType}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                    {SECTIONS.map((section, sIdx) => (
                        <div key={sIdx} className="bg-white">
                            <div className="bg-slate-50/80 px-4 py-2 border-y border-slate-100 italic">
                                <Label className="text-xs font-bold text-slate-600">{section.title}</Label>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {section.items.map((item) => {
                                    const scoreItem = scores.find(s => s.section === item.id);
                                    return (
                                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                            <div className="flex justify-between items-start mb-2 gap-4">
                                                <Label className="text-sm text-gray-700 leading-relaxed flex-1">{item.label}</Label>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="w-16 h-8 text-right font-mono text-sm"
                                                        value={scoreItem?.score || 0}
                                                        onChange={(e) => handleScoreChange(item.id, Number(e.target.value))}
                                                        readOnly={isReadOnly}
                                                        disabled={isReadOnly}
                                                    />
                                                    <span className="text-[10px] text-gray-400">/ 100</span>
                                                </div>
                                            </div>
                                            <Textarea
                                                placeholder={isReadOnly ? "" : `Komentar untuk poin ini...`}
                                                className="h-12 text-[11px] resize-none bg-white/50 focus:bg-white"
                                                value={scoreItem?.comments || ''}
                                                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                                readOnly={isReadOnly}
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="bg-blue-50/50 p-4 border-t border-blue-100">
                        <Label className="text-sm font-bold text-blue-900 block mb-3">Peluang Luaran {labelType}</Label>
                        <div className="grid grid-cols-1 gap-3">
                            {LUARAN_OPTIONS.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`flex items-start gap-3 p-2 rounded-lg border transition-all cursor-pointer ${selectedLuaran.includes(opt.id) ? 'bg-white border-blue-300 shadow-sm' : 'bg-transparent border-transparent'
                                        }`}
                                    onClick={() => toggleLuaran(opt.id)}
                                >
                                    <Checkbox
                                        id={opt.id}
                                        checked={selectedLuaran.includes(opt.id)}
                                        onCheckedChange={() => toggleLuaran(opt.id)}
                                        disabled={isReadOnly}
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor={opt.id} className="text-xs font-semibold text-gray-700 cursor-pointer block">{opt.label}</Label>
                                        <span className="text-[10px] text-blue-600 font-bold">+{formatRupiah(opt.bonus)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-orange-50 border-t border-orange-100">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-orange-900">Rata-rata Nilai Substansi</span>
                            <Badge variant="outline" className="text-lg font-bold bg-white text-orange-600 border-orange-200 shadow-sm px-3">
                                {avgScore.toFixed(2)}
                            </Badge>
                        </div>
                        <Separator className="bg-orange-200" />
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm font-bold text-gray-700 block">Rekomendasi Dana</span>
                                <span className="text-[10px] text-gray-500 italic">*Berdasarkan bracket substansi + bonus luaran</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-green-700 font-mono tracking-tighter">
                                    {formatRupiah(calculateFunding(avgScore, selectedLuaran))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewScoringForm;
