import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe Angular pour formater un temps donné en minutes et secondes.
 *
 * Ce pipe prend en entrée un nombre (ou une chaîne convertible en nombre)
 * représentant un temps en **minutes décimales**, et renvoie une chaîne
 * lisible sous la forme `"X min Y s"`.
 *
 * Exemple :
 * ```ts
 * 90.5 | timeFormat => "90 min 30 s"
 * ```
 *
 * Usage typique dans un template :
 * ```html
 * <span>{{ 12.75 | timeFormat }}</span> <!-- Affiche "12 min 45 s" -->
 * ```
 */
@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  /**
   * Transforme un nombre ou une chaîne représentant un temps en minutes décimales
   * en une chaîne formatée minutes + secondes.
   *
   * @param value Le temps en minutes décimales (number ou string).
   *              Si null, undefined ou '-', renvoie simplement '-'.
   * @returns Une chaîne formatée sous la forme `"X min Y s"`.
   */
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
