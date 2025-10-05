import { Pipe, PipeTransform } from '@angular/core';
/**
 * @pipe
 * @name TruncateEmailPipe
 * @description
 * Pipe Angular permettant de tronquer une chaîne de caractères (par exemple une adresse e-mail)
 * si elle dépasse une longueur maximale donnée.
 *
 * Ce pipe est utile pour afficher les adresses e-mail ou tout texte long
 * dans une interface utilisateur, en conservant une taille lisible.
 *
 * ---
 * Fonctionnement :
 * - Si la chaîne est plus longue que la limite spécifiée (`limit`),
 *   elle est tronquée et terminée par `...`
 * - Si la chaîne est plus courte ou égale à la limite, elle est retournée telle quelle.
 * - Si la valeur est vide ou `null`, retourne une chaîne vide.
 *
 * ---
 * @usageNotes
 * ### Exemple d'utilisation :
 * ```html
 * <!-- Exemple simple -->
 * {{ user.email | truncateEmail }}
 *
 * <!-- Exemple avec limite personnalisée -->
 * {{ user.email | truncateEmail:15 }}
 * ```
 *
 * ---
 * @example
 * **Entrée :**
 * ```typescript
 * 'exemple.longemail@domaine.com'
 * ```
 * **Sortie avec limite par défaut (10) :**
 * ```
 * 'exemple.lo...'
 * ```
 *
 * **Sortie avec limite personnalisée (20) :**
 * ```
 * 'exemple.longemail@d...'
 * ```
 *
 * ---
 * @param {string} value - La chaîne de caractères à tronquer.
 * @param {number} [limit=10] - Longueur maximale avant troncature.
 * @returns {string} La chaîne tronquée si nécessaire.
 */
@Pipe({ name: 'truncateEmail' })
export class TruncateEmailPipe implements PipeTransform {
  transform(value: string, limit: number = 10): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
