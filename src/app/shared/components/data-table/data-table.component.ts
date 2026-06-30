import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from '../../../core/models/table-column.model';
import { StatusTextPipe } from '../../pipes/status-text.pipe';
import { StatusColorDirective } from '../../directives/status-color.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [StatusTextPipe, StatusColorDirective, DatePipe],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            @for (col of columns(); track col.key) {
              <th
                class="px-4 py-3 font-medium text-gray-700 cursor-pointer select-none"
                (click)="col.sortable && toggleSort(col.key)"
              >
                {{ col.label }}
                @if (col.sortable && sortKey() === col.key) {
                  <span class="ml-1 text-xs">{{ sortDir() === 'asc' ? '(A-Z)' : '(Z-A)' }}</span>
                }
              </th>
            }
            <th class="px-4 py-3 font-medium text-gray-700">Islemler</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          @for (row of data(); track row.id) {
            <tr class="hover:bg-gray-50">
              @for (col of columns(); track col.key) {
                <td class="px-4 py-3">
                  @if (col.type === 'badge') {
                    <span
                      statusColor="{{ row[col.key] }}"
                      class="px-2 py-1 rounded-full text-sm font-medium"
                    >
                      {{ row[col.key] | statusText }}
                    </span>
                  } @else if (col.type === 'stars') {
                    {{ row[col.key] || 0 }} / 5
                  } @else if (col.type === 'date') {
                    {{ row[col.key] | date:'dd.MM.yyyy' }}
                  } @else {
                    {{ row[col.key] }}
                  }
                </td>
              }
              <td class="px-4 py-3">
                <button
                  class="text-blue-600 hover:text-blue-800 mr-3"
                  (click)="edit.emit(row)"
                >
                  Duzenle
                </button>
                <button
                  class="text-red-600 hover:text-red-800"
                  (click)="delete.emit(row)"
                >
                  Sil
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length + 1" class="text-center py-8 text-gray-500">
                Kayit bulunamadi
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
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
