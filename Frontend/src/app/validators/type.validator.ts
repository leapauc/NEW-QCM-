import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur Angular personnalisé pour vérifier le type d'une question de QCM.
 *
 * Ce validateur est utilisé dans les formulaires réactifs (`ReactiveForms`) pour
 * s'assurer que le champ `type` d'une question contient uniquement l'une des valeurs
 * autorisées : `"single"` ou `"multiple"`.
 *
 * Usage typique dans un `FormGroup` :
 * ```ts
 * this.questionForm = this.fb.group({
 *   question: ['', Validators.required],
 *   type: ['', [typeValidator()]]
 * });
 * ```
 *
 * Exemple de résultat :
 * - `"single"` → valide
 * - `"multiple"` → valide
 * - `"other"` → retourne `{ invalidType: true }`
 *
 * @returns Une fonction `ValidatorFn` compatible avec Angular Reactive Forms.
 */
export function typeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validValues = ['single', 'multiple'];
    if (control.value && !validValues.includes(control.value)) {
      return { invalidType: true };
    }
    return null;
  };
}
