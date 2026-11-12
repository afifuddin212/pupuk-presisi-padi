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
      color: '#9a3412', // Rich Terracotta / Brick Earth
      badgeBg: 'bg-orange-100 dark:bg-orange-950/80 border border-orange-300 dark:border-orange-700',
      badgeText: 'text-orange-950 dark:text-orange-200 font-bold',
      deskripsi: 'Tanah berpelapukan lanjut dengan solum tebal, drainase baik hingga cepat, kandungan bahan organik sedang-rendah, bereaksi masam, dan kaya oksida besi/aluminium.',
    };
  }

  if (t.includes('kambisol')) {
    return {
      groupName: 'Kambisol (Inceptisols Cokelat Keemasan)',
      color: '#b45309', // Warm Ochre Soil
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700',
      badgeText: 'text-amber-950 dark:text-amber-200 font-bold',
      deskripsi: 'Tanah muda dengan pembentukan horizon kambik (Bw) yang jelas, perkembangan agregat baik, tingkat kesuburan alami sedang hingga tinggi, sangat responsif terhadap pemupukan berimbang.',
    };
  }

  if (t.includes('litosol')) {
    return {
      groupName: 'Litosol (Entisols Berbatu Dangkal)',
      color: '#475569', // Mineral Slate Stone
      badgeBg: 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700',
      badgeText: 'text-slate-900 dark:text-slate-200 font-bold',
      deskripsi: 'Tanah sangat dangkal (< 20 cm) di atas batuan induk masif, biasanya berada di lereng curam dengan tingkat bahaya erosi tinggi.',
    };
  }

  if (t.includes('badan air')) {
    return {
      groupName: 'Badan Air',
      color: '#0369a1', // Deep Water Blue
      badgeBg: 'bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700',
      badgeText: 'text-sky-950 dark:text-sky-200 font-bold',
      deskripsi: 'Danau, waduk, rawa genangan permanen, atau sungai besar.',
    };
  }

  if (t.includes('terbangun')) {
    return {
      groupName: 'Lahan Terbangun / Pemukiman',
      color: '#64748b',
      badgeBg: 'bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700',
      badgeText: 'text-zinc-900 dark:text-zinc-200 font-bold',
      deskripsi: 'Area pemukiman, infrastruktur jalan, dan fasilitas perkotaan/desa.',
    };
  }

  return {
    groupName: tanahName || 'Lainnya',
    color: '#059669',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700',
    badgeText: 'text-emerald-950 dark:text-emerald-200 font-bold',
    deskripsi: 'Satuan unit klasifikasi tanah.',
  };
}
