import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ERROR_MESSAGE = 'Puan 1 ile 5 arasında tam sayı olmalıdır';

export function scoreValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1 || num > 5) {
      return { scoreInvalid: ERROR_MESSAGE };
    }
    return null;
  };
}
