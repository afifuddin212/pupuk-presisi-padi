export function getLbsColor(jenisLahan: string | undefined): string {
  const j = (jenisLahan || '').toLowerCase();
  if (j.includes('irigasi') && !j.includes('non')) return '#16a34a';
  if (j.includes('tadah')) return '#84cc16';
  if (j.includes('rawa') || j.includes('lebak')) return '#06b6d4';
  if (j.includes('non')) return '#f59e0b';
  return '#10b981';
}

export function getLbsBadgeClass(jenisLahan: string | undefined): { bg: string; text: string } {
  const j = (jenisLahan || '').toLowerCase();
  if (j.includes('irigasi') && !j.includes('non')) {
    return { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300' };
  }
  if (j.includes('tadah')) {
    return { bg: 'bg-lime-100 dark:bg-lime-950/60', text: 'text-lime-800 dark:text-lime-300' };
  }
  if (j.includes('rawa') || j.includes('lebak')) {
    return { bg: 'bg-cyan-100 dark:bg-cyan-950/60', text: 'text-cyan-800 dark:text-cyan-300' };
  }
  return { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300' };
}
