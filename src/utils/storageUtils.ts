import localforage from 'localforage';
import { SurveyPoint, JenisPadi, MetodeRekomendasi, HaraStatus } from '../types';

// Inisialisasi localforage database
const surveyStore = localforage.createInstance({
  name: 'PupukPresisiPadi',
  storeName: 'survey_points',
});

const configStore = localforage.createInstance({
  name: 'PupukPresisiPadi',
  storeName: 'app_config',
});

/**
 * Storage Persistence API (Perlindungan Anti-Purge OS)
 * Meminta izin ke browser / OS Android agar IndexedDB tidak dihapus otomatis
 * saat memori penyimpanan internal perangkat menipis (best-effort -> persistent).
 */
export async function ensurePersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        const granted = await navigator.storage.persist();
        console.log(`[Storage] Status penyimpanan persisten: ${granted ? 'PERSISTENT (Kebal Purge OS)' : 'BEST-EFFORT'}`);
        return granted;
      }
      return isPersisted;
    } catch (err) {
      console.warn('[Storage] Gagal meminta penyimpanan persisten:', err);
    }
  }
  return false;
}

/**
 * Menyimpan titik survei baru ke IndexedDB
 */
export async function saveSurveyPoint(point: SurveyPoint): Promise<SurveyPoint[]> {
  const current = (await surveyStore.getItem<SurveyPoint[]>('points')) || [];
  const updated = [point, ...current];
  await surveyStore.setItem('points', updated);
  return updated;
}

/**
 * Mengambil semua titik survei dari IndexedDB
 */
export async function getAllSurveyPoints(): Promise<SurveyPoint[]> {
  return (await surveyStore.getItem<SurveyPoint[]>('points')) || [];
}

/**
 * Menghapus titik survei berdasarkan ID
 */
export async function deleteSurveyPoint(id: string): Promise<SurveyPoint[]> {
  const current = (await surveyStore.getItem<SurveyPoint[]>('points')) || [];
  const updated = current.filter((p) => p.id !== id);
  await surveyStore.setItem('points', updated);
  return updated;
}

/**
 * Menghapus seluruh titik survei
 */
export async function clearAllSurveyPoints(): Promise<void> {
  await surveyStore.removeItem('points');
}

/**
 * Menyimpan nama pencatat terakhir agar tidak perlu mengetik ulang
 */
export async function saveLastSurveyorName(name: string): Promise<void> {
  await configStore.setItem('last_surveyor', name);
}

/**
 * Mengambil nama pencatat terakhir
 */
export async function getLastSurveyorName(): Promise<string> {
  return (await configStore.getItem<string>('last_surveyor')) || '';
}

/**
 * Struktur Draf Isian Kalkulator Pemupukan
 */
export interface CalculatorDraft {
  surveyorName?: string;
  notes?: string;
  jenisPadi?: JenisPadi;
  metode?: MetodeRekomendasi;
  mode?: 'kualitatif' | 'kuantitatif';
  pStatus?: HaraStatus;
  kStatus?: HaraStatus;
  p2o5Val?: string;
  k2oVal?: string;
  luasPetak?: string;
  targetUrea?: number;
  hasStrawRecycled?: boolean;
}

const DRAFT_KEY = 'pupuk_presisi_calc_draft';

/**
 * Menyimpan draf kalkulator secara otomatis (Auto-Save)
 */
export function saveCalculatorDraft(draft: CalculatorDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.warn('[Storage] Gagal menyimpan draf kalkulator:', e);
  }
}

/**
 * Mengambil draf kalkulator terakhir dari localStorage
 */
export function getCalculatorDraft(): CalculatorDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('[Storage] Gagal membaca draf kalkulator:', e);
    return null;
  }
}

/**
 * Menghapus draf kalkulator
 */
export function clearCalculatorDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.warn('[Storage] Gagal menghapus draf kalkulator:', e);
  }
}
