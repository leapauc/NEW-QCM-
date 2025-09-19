import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || value === '-') return '-';

    // Convertir en nombre
    const totalMinutes = typeof value === 'string' ? parseFloat(value) : value;

    // Calculer minutes et secondes
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);

    return `${minutes} min ${seconds} s`;
  }
}
