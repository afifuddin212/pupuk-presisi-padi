export interface SoilGroupInfo {
  groupName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  deskripsi: string;
}

export function getSoilGroupInfo(tanahName: string | undefined): SoilGroupInfo {
  const t = (tanahName || '').toLowerCase();

  if (t.includes('latosol')) {
    return {
      groupName: 'Latosol (Inceptisols/Oxisols Kemerahan)',
      color: '#c2410c',
      badgeBg: 'bg-orange-100 dark:bg-orange-950/60',
      badgeText: 'text-orange-800 dark:text-orange-300',
      deskripsi: 'Tanah berpelapukan lanjut dengan solum tebal, drainase baik hingga cepat, kandungan bahan organik sedang-rendah, bereaksi masam, dan kaya oksida besi/aluminium.',
    };
  }

  if (t.includes('kambisol')) {
    return {
      groupName: 'Kambisol (Inceptisols Cokelat)',
      color: '#ca8a04',
      badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60',
      badgeText: 'text-yellow-800 dark:text-yellow-300',
      deskripsi: 'Tanah muda dengan pembentukan horizon kambik (Bw) yang jelas, perkembangan agregat baik, tingkat kesuburan alami sedang hingga tinggi, cocok untuk persawahan irigasi.',
    };
  }

  if (t.includes('litosol')) {
    return {
      groupName: 'Litosol (Entisols Berbatu Dangkal)',
      color: '#64748b',
      badgeBg: 'bg-slate-200 dark:bg-slate-800',
      badgeText: 'text-slate-800 dark:text-slate-300',
      deskripsi: 'Tanah sangat dangkal (< 20 cm) di atas batuan induk masif, biasanya berada di lereng curam dengan tingkat bahaya erosi tinggi.',
    };
  }

  if (t.includes('badan air')) {
    return {
      groupName: 'Badan Air',
      color: '#0284c7',
      badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
      badgeText: 'text-sky-800 dark:text-sky-300',
      deskripsi: 'Danau, waduk, rawa genangan permanen, atau sungai besar.',
    };
  }

  if (t.includes('terbangun')) {
    return {
      groupName: 'Lahan Terbangun / Pemukiman',
      color: '#94a3b8',
      badgeBg: 'bg-slate-100 dark:bg-slate-850',
      badgeText: 'text-slate-700 dark:text-slate-300',
      deskripsi: 'Area pemukiman, infrastruktur jalan, dan fasilitas perkotaan/desa.',
    };
  }

  return {
    groupName: tanahName || 'Lainnya',
    color: '#10b981',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    deskripsi: 'Satuan unit klasifikasi tanah.',
  };
}
