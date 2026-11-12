export interface KesesuaianDetail {
  kelas: 'S1' | 'S2' | 'S3' | 'N' | 'null';
  kelasLabel: string;
  kelasColor: string;
  faktorList: Array<{
    kode: string;
    nama: string;
    deskripsi: string;
  }>;
}

export const FAKTOR_PEMBATAS_MAP: Record<string, { nama: string; deskripsi: string }> = {
  tc: {
    nama: 'Temperatur / Suhu',
    deskripsi: 'Suhu rata-rata tahunan lingkungan tumbuh padi',
  },
  wa: {
    nama: 'Ketersediaan Air',
    deskripsi: 'Curah hujan tahunan, kelembaban udara, dan zona agroklimat',
  },
  oa: {
    nama: 'Ketersediaan Oksigen',
    deskripsi: 'Kondisi drainase tanah dan aerasi perakaran',
  },
  rc: {
    nama: 'Media Perakaran',
    deskripsi: 'Tekstur tanah, bahan kasar, dan kedalaman efektif perakaran',
  },
  nr: {
    nama: 'Retensi Hara',
    deskripsi: 'Kapasitas Tukar Kation (KTK), Kejenuhan Basa (KB), pH masam, C-Organik',
  },
  na: {
    nama: 'Hara Tersedia',
    deskripsi: 'Ketersediaan hara makro utama (N, P₂O₅, K₂O)',
  },
  xc: {
    nama: 'Toksisitas',
    deskripsi: 'Kadar garam terlarut / salinitas tanah',
  },
  xn: {
    nama: 'Sodisitas',
    deskripsi: 'Alkalinitas tanah / kejenuhan natrium',
  },
  xs: {
    nama: 'Bahaya Sulfidik',
    deskripsi: 'Kedalaman pirit / lapisan sulfidik masam',
  },
  eh: {
    nama: 'Bahaya Erosi',
    deskripsi: 'Tingkat erosi tanah dan kemiringan lereng',
  },
  fh: {
    nama: 'Bahaya Banjir',
    deskripsi: 'Tinggi dan durasi genangan air limpasan',
  },
  lp: {
    nama: 'Penyiapan Lahan',
    deskripsi: 'Batuan di permukaan dan singkapan batuan',
  },
};

export const KELAS_KESESUAIAN_MAP: Record<
  string,
  { label: string; color: string; desc: string }
> = {
  S1: {
    label: 'S1 - Sangat Sesuai',
    color: '#1a9850',
    desc: 'Lahan tidak mempunyai faktor pembatas yang berarti atau hanya memiliki pembatas minor yang tidak berpengaruh nyata terhadap produktivitas.',
  },
  S2: {
    label: 'S2 - Cukup Sesuai',
    color: '#a6d96a',
    desc: 'Lahan mempunyai faktor pembatas agak berat yang dapat menurunkan produktivitas atau memerlukan tambahan masukan.',
  },
  S3: {
    label: 'S3 - Sesuai Marginal',
    color: '#fee08b',
    desc: 'Lahan mempunyai faktor pembatas berat yang sangat membatasi produksi atau memerlukan biaya input pengelolaan yang tinggi.',
  },
  N: {
    label: 'N - Tidak Sesuai',
    color: '#d73027',
    desc: 'Lahan mempunyai faktor pembatas sangat permanen atau parah yang tidak memungkinkan produksi tanaman padi secara ekonomis.',
  },
  null: {
    label: 'Tidak Dinilai',
    color: '#94a3b8',
    desc: 'Komoditas tidak dinilai pada poligon delineasi ini.',
  },
};

/**
 * Mengurai string kelas dan faktor pembatas (misal: "S2 - tc/nr/na")
 */
export function parseKesesuaianString(val: string | null | undefined): KesesuaianDetail {
  if (!val || val === 'null') {
    return {
      kelas: 'null',
      kelasLabel: 'Tidak Dinilai',
      kelasColor: '#94a3b8',
      faktorList: [],
    };
  }

  const parts = val.split(' - ');
  const rawKelas = (parts[0] || '').trim();
  const kelas = (['S1', 'S2', 'S3', 'N'].includes(rawKelas) ? rawKelas : 'null') as KesesuaianDetail['kelas'];

  const kelasInfo = KELAS_KESESUAIAN_MAP[kelas] || KELAS_KESESUAIAN_MAP['null'];

  const rawFaktor = parts[1] ? parts[1].trim() : '';
  const faktorCodes = rawFaktor ? rawFaktor.split('/') : [];

  const faktorList = faktorCodes.map((c) => {
    const clean = c.trim().toLowerCase();
    const info = FAKTOR_PEMBATAS_MAP[clean] || {
      nama: `Faktor ${clean.toUpperCase()}`,
      deskripsi: 'Faktor pembatas spesifik kondisi biofisik lahan',
    };
    return {
      kode: clean,
      nama: info.nama,
      deskripsi: info.deskripsi,
    };
  });

  return {
    kelas,
    kelasLabel: kelasInfo.label,
    kelasColor: kelasInfo.color,
    faktorList,
  };
}
