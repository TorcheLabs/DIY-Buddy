export function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `$${value}`;
}

export function formatCurrencyRange(low: number, high: number): string {
  if (low === 0) return `Free–${formatCurrency(high)}`;
  return `${formatCurrency(low)}–${formatCurrency(high)}`;
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours} hr${hours === 1 ? '' : 's'}`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hrs} hr${hrs === 1 ? '' : 's'}` : `${hrs}h ${rem}m`;
}

export function estimateValueAddMidpoint(low: number, high: number): number {
  return Math.round((low + high) / 2);
}
