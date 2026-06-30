import { Component, input, output } from '@angular/core';
import { ConfirmDialogData } from '@core/models/confirm-dialog-data.model';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: "./confirm-dialog.component.html",
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
