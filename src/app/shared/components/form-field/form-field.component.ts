import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: "./form-field.component.html",
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly required = input(false);
  readonly control = input<AbstractControl | null>(null);

  protected getError(): string {
    const errors = this.control()?.errors;
    if (!errors) return '';
    if (errors['required']) return 'Bu alan zorunludur';
    if (errors['minlength']) return `En az ${errors['minlength'].requiredLength} karakter olmalıdır`;
    if (errors['maxlength']) return `En fazla ${errors['maxlength'].requiredLength} karakter olabilir`;
    if (errors['scoreInvalid']) return errors['scoreInvalid'];
    return 'Geçersiz değer';
  }
}
