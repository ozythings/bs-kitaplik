import { Component, input, output } from '@angular/core';
import { ConfirmDialogData } from '../../../core/models/confirm-dialog-data.model';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-lg shadow-xl p-6 mx-4 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-2">{{ data().title }}</h3>
          <p class="text-gray-600 mb-6">{{ data().message }}</p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
              (click)="onCancel()"
            >
              {{ data().cancelLabel || 'İptal' }}
            </button>
            <button
              class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              (click)="onConfirm()"
            >
              {{ data().confirmLabel || 'Sil' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly visible = input.required<boolean>();
  readonly data = input.required<ConfirmDialogData>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
