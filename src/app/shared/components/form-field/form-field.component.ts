import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ label() }}
        @if (required()) { <span class="text-red-500">*</span> }
      </label>
      <ng-content />
      @if (control() && control()!.invalid && (control()!.dirty || control()!.touched)) {
        <p class="mt-1 text-sm text-red-600">{{ getError() }}</p>
      }
    </div>
  `,
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly required = input(false);
  readonly control = input<AbstractControl | null>(null);

  protected getError(): string {
    const errors = this.control()?.errors;
    if (!errors) return '';
    if (errors['required']) return 'Bu alan zorunludur';
    if (errors['scoreInvalid']) return errors['scoreInvalid'];
    return 'Gecersiz deger';
  }
}
