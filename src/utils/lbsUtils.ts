export function getLbsColor(jenisLahan: string | undefined): string {
  const j = (jenisLahan || '').toLowerCase();
  if (j.includes('irigasi') && !j.includes('non')) return '#059669'; // Sawah Irigasi (Emerald Brand)
  if (j.includes('tadah')) return '#65a30d'; // Sawah Tadah Hujan (Vibrant Lime/Olive)
  if (j.includes('rawa') || j.includes('lebak')) return '#0284c7'; // Sawah Rawa/Lebak (Clear Sky Blue)
  if (j.includes('non')) return '#d97706'; // Sawah Non-Irigasi (Warm Amber)
  return '#059669';
}

export function getLbsBadgeClass(jenisLahan: string | undefined): { bg: string; text: string; border: string } {
  const j = (jenisLahan || '').toLowerCase();
  if (j.includes('irigasi') && !j.includes('non')) {
    return { 
      bg: 'bg-emerald-50 dark:bg-emerald-950/80', 
      text: 'text-emerald-900 dark:text-emerald-200',
      border: 'border-emerald-300 dark:border-emerald-700'
    };
  }
  if (j.includes('tadah')) {
    return { 
      bg: 'bg-lime-50 dark:bg-lime-950/80', 
      text: 'text-lime-900 dark:text-lime-200',
      border: 'border-lime-300 dark:border-lime-700'
    };
  }
  if (j.includes('rawa') || j.includes('lebak')) {
    return { 
      bg: 'bg-sky-50 dark:bg-sky-950/80', 
      text: 'text-sky-900 dark:text-sky-200',
      border: 'border-sky-300 dark:border-sky-700'
    };
  }
  return { 
    bg: 'bg-amber-50 dark:bg-amber-950/80', 
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-700'
  };
}
