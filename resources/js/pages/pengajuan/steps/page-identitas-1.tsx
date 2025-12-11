import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import styles from '../../../../css/pengajuan.module.css';
import IdentitasAnggotaPengajuan from '../../../components/Pengajuan/IdentityAnggota';

interface UsulanData {
  judul: string;
  tkt_saat_ini: number | string;
  target_akhir_tkt: number | string;
  kelompok_skema: string;
  ruang_lingkup: string;
  kategori_sbk: string;
  bidang_fokus: string;
  tema_penelitian: string;
  topik_penelitian: string;
  rumpun_ilmu_1: string;
  rumpun_ilmu_2: string;
  rumpun_ilmu_3: string;
  prioritas_riset: string;
  tahun_pertama: number | string;
  lama_kegiatan: number | string;
  [key: string]: string | number; // Index signature for FormDataType
}

interface PageIdentitasProps {
  onSelanjutnya?: () => void;
  onTutupForm?: () => void;
  usulanId?: number;
  usulan?: Partial<UsulanData>; // data draft jika ada (optional fields)
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({
  onSelanjutnya,
  onTutupForm,
  usulanId,
  usulan,
}) => {
  // State untuk menyimpan ID usulan setelah draft pertama
  const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(usulanId ?? null);

  // Form dengan prefill dari draft jika ada
  const { data, setData, post, put, processing, errors } = useForm<UsulanData>({
    judul: usulan?.judul ?? '',
    tkt_saat_ini: usulan?.tkt_saat_ini ?? '',
    target_akhir_tkt: usulan?.target_akhir_tkt ?? '',
    kelompok_skema: usulan?.kelompok_skema ?? '',
    ruang_lingkup: usulan?.ruang_lingkup ?? '',
    kategori_sbk: usulan?.kategori_sbk ?? '',
    bidang_fokus: usulan?.bidang_fokus ?? '',
    tema_penelitian: usulan?.tema_penelitian ?? '',
    topik_penelitian: usulan?.topik_penelitian ?? '',
    rumpun_ilmu_1: usulan?.rumpun_ilmu_1 ?? '',
    rumpun_ilmu_2: usulan?.rumpun_ilmu_2 ?? '',
    rumpun_ilmu_3: usulan?.rumpun_ilmu_3 ?? '',
    prioritas_riset: usulan?.prioritas_riset ?? '',
    tahun_pertama: usulan?.tahun_pertama ?? '',
    lama_kegiatan: usulan?.lama_kegiatan ?? '',
  });

  // Simpan draft
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUsulanId) {
      // Update existing draft
      put(`/pengajuan/${currentUsulanId}`, {
        preserveScroll: true,
      });
    } else {
      // Create new draft
      post('/pengajuan/draft', {
        preserveScroll: true,
        onSuccess: (page) => {
          const id = (page.props.flash as Record<string, unknown>)?.usulanId as number | undefined;
          if (id) setCurrentUsulanId(id);
        },
      });
    }
  };

  // Auto-create draft when needed (for anggota component)
  const ensureDraftExists = async (): Promise<number | null> => {
    return new Promise<number | null>((resolve) => {
      if (currentUsulanId) {
        console.log('Draft already exists:', currentUsulanId);
        resolve(currentUsulanId);
        return;
      }

      console.log('Creating draft via ensureDraftExists...');
      post('/pengajuan/draft', {
        preserveScroll: true,
        onSuccess: (page) => {
          const id = (page.props.flash as Record<string, unknown>)?.usulanId as number | undefined;
          console.log('Draft created with ID:', id);
          if (id) {
            setCurrentUsulanId(id);
            resolve(id);
          } else {
            console.warn('No usulanId in response');
            resolve(null);
          }
        },
        onError: () => {
          console.error('Failed to create draft');
          resolve(null);
        },
      });
    });
  };

  // Selanjutnya (lanjut ke step berikutnya)
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUsulanId) {
      put(`/pengajuan/${currentUsulanId}`, {
        preserveScroll: true,
        onSuccess: () => onSelanjutnya?.(),
      });
    } else {
      post('/pengajuan/draft', {
        preserveScroll: true,
        onSuccess: (page) => {
          const id = (page.props.flash as Record<string, unknown>)?.usulanId as number | undefined;
          if (id) setCurrentUsulanId(id);
          onSelanjutnya?.();
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleNext}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Identitas Usulan Penelitian</h2>
          <div className={styles.formGrid}>
            {/* Judul */}
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${styles.required}`}>1. Judul</label>
              <input
                type="text"
                className={styles.input}
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
              />
              {errors.judul && <span className={styles.error}>{errors.judul}</span>}
            </div>

            {/* TKT Saat Ini */}
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${styles.required}`}>2. TKT Saat Ini</label>
              <input
                type="number"
                className={styles.input}
                value={data.tkt_saat_ini}
                onChange={(e) => setData('tkt_saat_ini', e.target.value)}
              />
              {errors.tkt_saat_ini && <span className={styles.error}>{errors.tkt_saat_ini}</span>}
            </div>

            {/* Target Akhir TKT */}
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${styles.required}`}>3. Target Akhir TKT</label>
              <select
                className={styles.select}
                value={data.target_akhir_tkt}
                onChange={(e) => setData('target_akhir_tkt', e.target.value)}
              >
                <option value="">Pilih Target TKT Akhir</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>TKT {n}</option>
                ))}
              </select>
              {errors.target_akhir_tkt && <span className={styles.error}>{errors.target_akhir_tkt}</span>}
            </div>

            {/* Kelompok Skema */}
            <div className={styles.formGroup}>
              <label className={styles.label}>4. Kelompok Skema *</label>
              <select
                className={styles.select}
                value={data.kelompok_skema}
                onChange={(e) => setData("kelompok_skema", e.target.value)}
              >
                <option value="">Pilih Kategori Penelitian</option>
                <option value="Penelitian Dasar">Penelitian Dasar</option>
                <option value="Penelitian Terapan">Penelitian Terapan</option>
                <option value="Penelitian Pengembangan">Penelitian Pengembangan</option>
              </select>
            </div>

            {/* Ruang Lingkup */}
            <div className={styles.formGroup}>
              <label className={styles.label}>5. Ruang Lingkup *</label>
              <select
                className={styles.select}
                value={data.ruang_lingkup}
                onChange={(e) => setData("ruang_lingkup", e.target.value)}
              >
                <option value="">Pilih Ruang Lingkup</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
                <option value="Regional">Regional</option>
              </select>
            </div>

            {/* Kategori SBK */}
            <div className={styles.formGroup}>
              <label className={styles.label}>6. Kategori SBK *</label>
              <select
                className={styles.select}
                value={data.kategori_sbk}
                onChange={(e) => setData("kategori_sbk", e.target.value)}
              >
                <option value="">Pilih Kategori SBK</option>
                <option value="SBK A">SBK A</option>
                <option value="SBK B">SBK B</option>
                <option value="SBK C">SBK C</option>
              </select>
            </div>

            {/* Bidang Fokus */}
            <div className={styles.formGroup}>
              <label className={styles.label}>7. Bidang Fokus Penelitian *</label>
              <select
                className={styles.select}
                value={data.bidang_fokus}
                onChange={(e) => setData("bidang_fokus", e.target.value)}
              >
                <option value="">Pilih Bidang Fokus</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Pertanian">Pertanian</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Sosial Humaniora">Sosial Humaniora</option>
              </select>
            </div>

            {/* Tema */}
            <div className={styles.formGroup}>
              <label className={styles.label}>8. Tema Penelitian</label>
              <select
                className={styles.select}
                value={data.tema_penelitian}
                onChange={(e) => setData("tema_penelitian", e.target.value)}
              >
                <option value="">Pilih Tema</option>
                <option value="Tema 1">Tema 1</option>
                <option value="Tema 2">Tema 2</option>
                <option value="Tema 3">Tema 3</option>
              </select>
            </div>

            {/* Topik */}
            <div className={styles.formGroup}>
              <label className={styles.label}>9. Topik Penelitian</label>
              <select
                className={styles.select}
                value={data.topik_penelitian}
                onChange={(e) => setData("topik_penelitian", e.target.value)}
              >
                <option value="">Pilih Topik</option>
                <option value="Topik 1">Topik 1</option>
                <option value="Topik 2">Topik 2</option>
                <option value="Topik 3">Topik 3</option>
              </select>
            </div>

            {/* Rumpun Ilmu 1 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>10. Rumpun Ilmu Level 1 *</label>
              <select
                className={styles.select}
                value={data.rumpun_ilmu_1}
                onChange={(e) => setData("rumpun_ilmu_1", e.target.value)}
              >
                <option value="">Pilih Rumpun Ilmu</option>
                <option value="Ilmu Alam">Ilmu Alam</option>
                <option value="Ilmu Sosial">Ilmu Sosial</option>
                <option value="Ilmu Humaniora">Ilmu Humaniora</option>
              </select>
            </div>

            {/* Rumpun Ilmu 2 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>11. Rumpun Ilmu Level 2 *</label>
              <select
                className={styles.select}
                value={data.rumpun_ilmu_2}
                onChange={(e) => setData("rumpun_ilmu_2", e.target.value)}
              >
                <option value="">Pilih Level 2</option>
                <option value="Matematika">Matematika</option>
                <option value="Fisika">Fisika</option>
                <option value="Kimia">Kimia</option>
              </select>
            </div>

            {/* Rumpun Ilmu 3 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>12. Rumpun Ilmu Level 3 *</label>
              <select
                className={styles.select}
                value={data.rumpun_ilmu_3}
                onChange={(e) => setData("rumpun_ilmu_3", e.target.value)}
              >
                <option value="">Pilih Level 3</option>
                <option value="Aljabar">Aljabar</option>
                <option value="Geometri">Geometri</option>
                <option value="Statistika">Statistika</option>
              </select>
            </div>

            {/* Prioritas Riset */}
            <div className={styles.formGroup}>
              <label className={styles.label}>13. Prioritas Riset</label>
              <select
                className={styles.select}
                value={data.prioritas_riset}
                onChange={(e) => setData("prioritas_riset", e.target.value)}
              >
                <option value="">Pilih Prioritas</option>
                <option value="Prioritas 1">Prioritas 1</option>
                <option value="Prioritas 2">Prioritas 2</option>
                <option value="Prioritas 3">Prioritas 3</option>
              </select>
            </div>

            {/* Tahun Pertama */}
            <div className={styles.formGroup}>
              <label className={styles.label}>14. Tahun Pertama *</label>
              <select
                className={styles.select}
                value={data.tahun_pertama}
                onChange={(e) => setData("tahun_pertama", e.target.value)}
              >
                <option value="">Pilih Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Lama */}
            <div className={styles.formGroup}>
              <label className={styles.label}>15. Lama Kegiatan *</label>
              <select
                className={styles.select}
                value={data.lama_kegiatan}
                onChange={(e) => setData("lama_kegiatan", e.target.value)}
              >
                <option value="">Pilih Lama</option>
                <option value="1">1 Tahun</option>
                <option value="2">2 Tahun</option>
                <option value="3">3 Tahun</option>
              </select>
            </div>
          </div>
        </div>

        <IdentitasAnggotaPengajuan
          usulanId={currentUsulanId}
          onCreateDraft={ensureDraftExists}
        />

        {/* Tombol aksi */}
        <div className={styles.actionContainer}>
          <button type="button" className={styles.secondaryButton} onClick={onTutupForm} disabled={processing}>
            Tutup Form
          </button>

          <button type="button" className={styles.secondaryButton} onClick={handleSaveDraft} disabled={processing}>
            {processing ? 'Menyimpan...' : 'Simpan Sebagai Draft'}
          </button>

          <button type="submit" className={styles.primaryButton} disabled={processing}>
            {processing ? 'Memproses...' : 'Selanjutnya >'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageIdentitas;