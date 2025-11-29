import React, { useState } from 'react';
import styles from '../../../css/pengajuan.module.css';

interface RABItem {
  id: number;
  komponen: string;
  item: string;
  satuan: string;
  volume: number;
  hargaSatuan: number;
  total: number;
}

interface PageRABProps {
  onKembali?: () => void;
  onSelanjutnya?: () => void;
}

const PageRAB: React.FC<PageRABProps> = ({ onKembali, onSelanjutnya }) => {
  const [bahanItems, setBahanItems] = useState<RABItem[]>([
    { id: 1, komponen: 'Pilih Komponen', item: '✔', satuan: '✔', volume: 1, hargaSatuan: 0, total: 0 }
  ]);

  const [pengumpulanDataItems, setPengumpulanDataItems] = useState<RABItem[]>([
    { id: 1, komponen: 'Pilih Komponen', item: '✔', satuan: '✔', volume: 1, hargaSatuan: 0, total: 0 }
  ]);

  const addBahanItem = () => {
    const newItem: RABItem = {
      id: Date.now(),
      komponen: 'Pilih Komponen',
      item: '',
      satuan: '',
      volume: 1,
      hargaSatuan: 0,
      total: 0
    };
    setBahanItems([...bahanItems, newItem]);
  };

  const addPengumpulanDataItem = () => {
    const newItem: RABItem = {
      id: Date.now(),
      komponen: 'Pilih Komponen',
      item: '',
      satuan: '',
      volume: 1,
      hargaSatuan: 0,
      total: 0
    };
    setPengumpulanDataItems([...pengumpulanDataItems, newItem]);
  };

  const updateBahanItem = (id: number, field: keyof RABItem, value: string | number) => {
    setBahanItems(bahanItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'volume' || field === 'hargaSatuan') {
          updatedItem.total = updatedItem.volume * updatedItem.hargaSatuan;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const updatePengumpulanDataItem = (id: number, field: keyof RABItem, value: string | number) => {
    setPengumpulanDataItems(pengumpulanDataItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'volume' || field === 'hargaSatuan') {
          updatedItem.total = updatedItem.volume * updatedItem.hargaSatuan;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const deleteBahanItem = (id: number) => {
    if (bahanItems.length > 1) {
      setBahanItems(bahanItems.filter(item => item.id !== id));
    }
  };

  const deletePengumpulanDataItem = (id: number) => {
    if (pengumpulanDataItems.length > 1) {
      setPengumpulanDataItems(pengumpulanDataItems.filter(item => item.id !== id));
    }
  };

  const totalBahan = bahanItems.reduce((sum, item) => sum + item.total, 0);
  const totalPengumpulanData = pengumpulanDataItems.reduce((sum, item) => sum + item.total, 0);
  const totalRAB = totalBahan + totalPengumpulanData;

  return (
    <>
      {/* Informasi Section */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Rencana Anggaran Belanja</h2>
        
        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>ℹ️</div>
          <div className={styles.infoText}>
            Dana Maksimal Usulan Untuk Program Penelitian yaitu <strong>Rp. 50.000.000,00</strong><br />
            Total RAB Usulan anda <strong>Rp. {totalRAB.toLocaleString('id-ID')},00</strong>
          </div>
        </div>
      </div>

      {/* Bahan Section */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.subTitle}>Bahan</h3>
          <button className={styles.addButton} onClick={addBahanItem}>
            + Tambah
          </button>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Komponen</th>
                <th>Item</th>
                <th>Satuan</th>
                <th>Volume</th>
                <th>Harga Satuan</th>
                <th>Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bahanItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <select 
                      className={styles.selectSmall}
                      value={item.komponen}
                      onChange={(e) => updateBahanItem(item.id, 'komponen', e.target.value)}
                    >
                      <option value="Pilih Komponen">Pilih Komponen</option>
                      <option value="Bahan Habis Pakai">Bahan Habis Pakai</option>
                      <option value="Bahan Kimia">Bahan Kimia</option>
                      <option value="Peralatan">Peralatan</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={styles.inputSmall}
                      value={item.item}
                      onChange={(e) => updateBahanItem(item.id, 'item', e.target.value)}
                      placeholder="Item"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className={styles.inputSmall}
                      value={item.satuan}
                      onChange={(e) => updateBahanItem(item.id, 'satuan', e.target.value)}
                      placeholder="Satuan"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.inputSmall}
                      value={item.volume}
                      onChange={(e) => updateBahanItem(item.id, 'volume', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.inputSmall}
                      value={item.hargaSatuan}
                      onChange={(e) => updateBahanItem(item.id, 'hargaSatuan', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </td>
                  <td>Rp. {item.total.toLocaleString('id-ID')},00</td>
                  <td>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deleteBahanItem(item.id)}
                      disabled={bahanItems.length === 1}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pengumpulan Data Section */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.subTitle}>Pengumpulan Data</h3>
          <button className={styles.addButton} onClick={addPengumpulanDataItem}>
            + Tambah
          </button>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Komponen</th>
                <th>Item</th>
                <th>Satuan</th>
                <th>Volume</th>
                <th>Harga Satuan</th>
                <th>Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengumpulanDataItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <select 
                      className={styles.selectSmall}
                      value={item.komponen}
                      onChange={(e) => updatePengumpulanDataItem(item.id, 'komponen', e.target.value)}
                    >
                      <option value="Pilih Komponen">Pilih Komponen</option>
                      <option value="Survey">Survey</option>
                      <option value="Wawancara">Wawancara</option>
                      <option value="Observasi">Observasi</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={styles.inputSmall}
                      value={item.item}
                      onChange={(e) => updatePengumpulanDataItem(item.id, 'item', e.target.value)}
                      placeholder="Item"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className={styles.inputSmall}
                      value={item.satuan}
                      onChange={(e) => updatePengumpulanDataItem(item.id, 'satuan', e.target.value)}
                      placeholder="Satuan"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.inputSmall}
                      value={item.volume}
                      onChange={(e) => updatePengumpulanDataItem(item.id, 'volume', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.inputSmall}
                      value={item.hargaSatuan}
                      onChange={(e) => updatePengumpulanDataItem(item.id, 'hargaSatuan', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </td>
                  <td>Rp. {item.total.toLocaleString('id-ID')},00</td>
                  <td>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deletePengumpulanDataItem(item.id)}
                      disabled={pengumpulanDataItems.length === 1}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionContainer}>
        <button className={styles.secondaryButton} onClick={onKembali}>
          &lt; Kembali
        </button>
        <button className={styles.primaryButton} onClick={onSelanjutnya}>
          Selanjutnya &gt;
        </button>
      </div>
    </>
  );
};

export default PageRAB;