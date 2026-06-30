import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from '@core/models/table-column.model';
import { StatusTextPipe } from '@shared/pipes/status-text.pipe';
import { StatusColorDirective } from '@shared/directives/status-color.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [StatusTextPipe, StatusColorDirective, DatePipe],
  templateUrl: "./data-table.component.html",
})
export class DataTableComponent {
  readonly columns = input.required<TableColumn[]>();
  readonly data = input.required<any[]>();

  readonly edit = output<any>();
  readonly delete = output<any>();

  protected readonly sortKey = signal<string>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');

  protected toggleSort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }
}
