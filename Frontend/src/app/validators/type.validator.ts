import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function typeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validValues = ['single', 'multiple'];
    if (control.value && !validValues.includes(control.value)) {
      return { invalidType: true };
    }
    return null;
  };
}
