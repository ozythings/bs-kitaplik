import { Component, computed, effect, input, output, signal } from '@angular/core';
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
  readonly pageSize = input(0);

  readonly edit = output<any>();
  readonly delete = output<any>();
  readonly sortChange = output<{ key: string; dir: 'asc' | 'desc' }>();

  protected readonly sortKey = signal<string>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly pageIndex = signal(1);

  protected readonly totalPages = computed(() =>
    Math.ceil(this.data().length / this.pageSize()) || 1
  );

  protected readonly displayData = computed(() => {
    if (!this.pageSize()) return this.data();
    const start = (this.pageIndex() - 1) * this.pageSize();
    return this.data().slice(start, start + this.pageSize());
  });

  constructor() {
    effect(() => {
      this.data();
      this.pageIndex.set(1);
    });
  }

  protected toggleSort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.sortChange.emit({ key, dir: this.sortDir() });
  }

  protected nextPage(): void {
    if (this.pageIndex() < this.totalPages())
      this.pageIndex.update(p => p + 1);
  }

  protected prevPage(): void {
    if (this.pageIndex() > 1)
      this.pageIndex.update(p => p - 1);
  }
}
