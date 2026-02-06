import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ScoreItem {
    section: string;
    score: number;
    comments: string;
}

interface ReviewScoringFormProps {
    onChange: (scores: ScoreItem[], totalScore: number, recommendation: number) => void;
    maxFunding?: number; // Default 7,000,000
}

const SECTIONS = [
    { id: 'judul', label: 'Judul Penelitian', weight: 5 },
    { id: 'abstrak', label: 'Abstrak', weight: 10 },
    { id: 'pendahuluan', label: 'Latar Belakang & Pendahuluan', weight: 15 },
    { id: 'tinjauan_pustaka', label: 'Tinjauan Pustaka', weight: 15 },
    { id: 'metode', label: 'Metode Penelitian', weight: 25 },
    { id: 'jadwal', label: 'Jadwal Penelitian', weight: 10 },
    { id: 'tim', label: 'Kualifikasi Tim Peneliti', weight: 10 },
    { id: 'rab', label: 'Kewajaran RAB', weight: 10 },
];

const ReviewScoringForm: React.FC<ReviewScoringFormProps> = ({ onChange, maxFunding = 7000000 }) => {
    const [scores, setScores] = useState<ScoreItem[]>(SECTIONS.map(s => ({ section: s.id, score: 0, comments: '' })));

    useEffect(() => {
        let calculatedScore = 0;
        let totalWeight = 0;

        SECTIONS.forEach(section => {
            const item = scores.find(s => s.section === section.id);
            const score = item?.score || 0;
            calculatedScore += (score * section.weight / 100);
            totalWeight += section.weight;
        });

        // calculatedScore is now 0-100 based on weights.
        const recommendation = (calculatedScore / 100) * maxFunding;

        onChange(scores, calculatedScore, recommendation);
    }, [scores]);

    const handleScoreChange = (section: string, val: number) => {
        const newScores = scores.map(s => s.section === section ? { ...s, score: val } : s);
        setScores(newScores);
    };

    const handleCommentChange = (section: string, val: string) => {
        const newScores = scores.map(s => s.section === section ? { ...s, comments: val } : s);
        setScores(newScores);
    };

    const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const totalWeighted = scores.reduce((acc, item) => {
        const weight = SECTIONS.find(s => s.id === item.section)?.weight || 0;
        return acc + (item.score * weight / 100);
    }, 0);

    return (
        <Card className="border-gray-200">
            <CardHeader className="bg-gray-50 pb-4">
                <CardTitle className="text-base text-gray-800">Form Penilaian Detail</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                    {SECTIONS.map((section) => {
                        const scoreItem = scores.find(s => s.section === section.id);
                        return (
                            <div key={section.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <Label className="font-bold text-gray-700">{section.label} <span className="text-xs font-normal text-gray-500">(Bobot: {section.weight}%)</span></Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-20 h-8 text-right font-mono"
                                            value={scoreItem?.score || 0}
                                            onChange={(e) => handleScoreChange(section.id, Number(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-400">/ 100</span>
                                    </div>
                                </div>
                                <Textarea
                                    placeholder={`Catatan untuk ${section.label}...`}
                                    className="h-16 text-xs resize-none"
                                    value={scoreItem?.comments || ''}
                                    onChange={(e) => handleCommentChange(section.id, e.target.value)}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-orange-50 border-t border-orange-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700">Total Skor (Terbobot)</span>
                        <Badge variant="outline" className="text-lg font-bold bg-white text-orange-600 border-orange-200">
                            {totalWeighted.toFixed(2)}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Rekomendasi Dana</span>
                        <span className="text-lg font-bold text-green-700 font-mono">
                            {formatRupiah((totalWeighted / 100) * maxFunding)}
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 text-right">
                        *Maksimal Dana: {formatRupiah(maxFunding)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewScoringForm;
