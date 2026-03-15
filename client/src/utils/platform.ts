export function isAndroidApp(): boolean {
  return typeof window !== 'undefined' && (window as any).Android !== undefined;
}

export function isCapacitor(): boolean {
  return typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.() === true;
}

export function isRunningInApp(): boolean {
  return isAndroidApp() || isCapacitor();
}
