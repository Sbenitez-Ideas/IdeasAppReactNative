export const transformHours = ( hours: number, isMinutes: boolean, modFormat: boolean ) => {
    const minutes = isMinutes ? hours : hours * 60;
    let totalHours: any = Math.floor(minutes / 60);
    let totalMinutes: any = Math.trunc(minutes % 60);

    totalHours = totalHours < 10 ? '0' + totalHours : totalHours;
    totalMinutes = totalMinutes < 10 ? '0' + totalMinutes : totalMinutes;

    return modFormat ? `${totalHours}h:${totalMinutes}m` : `${totalHours}:${totalMinutes}m`;
  }