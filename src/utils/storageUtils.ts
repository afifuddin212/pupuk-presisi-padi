import localforage from 'localforage';
import { SurveyPoint } from '../types';

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
 * Menyimpan titik survei baru
 */
export async function saveSurveyPoint(point: SurveyPoint): Promise<SurveyPoint[]> {
  const current = (await surveyStore.getItem<SurveyPoint[]>('points')) || [];
  const updated = [point, ...current];
  await surveyStore.setItem('points', updated);
  return updated;
}

/**
 * Mengambil semua titik survei
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

