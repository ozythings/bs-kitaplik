import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';
import { TableColumn } from '../../../../core/models/table-column.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    RouterLink,
    DataTableComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold">Kitaplar</h1>
        <a
          routerLink="/kitaplar/ekle"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Yeni Kitap Ekle
        </a>
      </div>

      <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 mb-4">
        <input
          [value]="searchText()"
          (input)="searchText.set($any($event.target).value)"
          placeholder="Kitap adi veya yazar ara..."
          class="col-span-2 sm:flex-1 border rounded-lg px-3 py-2"
        />
        <select
          [value]="filterTur()"
          (change)="filterTur.set($any($event.target).value)"
          class="border rounded-lg px-3 py-2"
        >
          <option value="">Tum Turler</option>
          @for (tur of turList(); track tur) {
            <option [value]="tur">{{ tur }}</option>
          }
        </select>
        <select
          [value]="filterDurum()"
          (change)="filterDurum.set($any($event.target).value)"
          class="border rounded-lg px-3 py-2"
        >
          <option value="">Tum Durumlar</option>
          <option value="okunacak">Okunacak</option>
          <option value="okunuyor">Okunuyor</option>
          <option value="okundu">Okundu</option>
        </select>
        <select
          [value]="sortField()"
          (change)="sortField.set($any($event.target).value)"
          class="col-span-2 sm:col-span-1 border rounded-lg px-3 py-2"
        >
          <option value="eklenmeTarihi">Eklenme Tarihi</option>
          <option value="puan">Puana Gore</option>
          <option value="ad">Ada Gore</option>
        </select>
      </div>

      <app-loading-spinner [loading]="loading()" label="Kitaplar yukleniyor..." />

      @if (!loading() && filteredBooks().length === 0) {
        <app-empty-state />
      }

      @if (filteredBooks().length > 0) {
        <app-data-table
          [columns]="columns"
          [data]="filteredBooks()"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
        />
      }
    </div>

    <app-confirm-dialog
      [visible]="deleteDialogVisible()"
      [data]="deleteDialogData"
      (confirm)="confirmDelete()"
      (cancel)="deleteDialogVisible.set(false)"
    />
  `,
})
export class BooksListComponent {
  private booksService = inject(BooksService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly searchText = signal('');
  protected readonly filterTur = signal('');
  protected readonly filterDurum = signal('');
  protected readonly sortField = signal<string>('eklenmeTarihi');

  protected readonly deleteDialogVisible = signal(false);
  protected selectedBook: Book | null = null;

  protected readonly deleteDialogData = {
    title: 'Kitabi Sil',
    message: 'Bu kitabi silmek istediginize emin misiniz?',
    confirmLabel: 'Sil',
    cancelLabel: 'Iptal',
  };

  protected readonly turList = computed<string[]>(() => {
    const turler = this.booksService
      .books()
      .map(b => b.tur)
      .filter((t): t is string => !!t);
    return [...new Set(turler)].sort();
  });

  protected readonly filteredBooks = computed(() => {
    let books = this.booksService.books();
    const search = this.searchText().toLowerCase();

    if (search) {
      books = books.filter(
        b =>
          b.ad.toLowerCase().includes(search) ||
          b.yazar.toLowerCase().includes(search)
      );
    }

    if (this.filterTur()) {
      books = books.filter(b => b.tur === this.filterTur());
    }

    if (this.filterDurum()) {
      books = books.filter(b => b.durum === this.filterDurum());
    }

    const field = this.sortField();
    books = [...books].sort((a, b) => {
      if (field === 'puan') {
        return (b.puan || 0) - (a.puan || 0);
      }
      if (field === 'ad') {
        return a.ad.localeCompare(b.ad);
      }
      return new Date(b.eklenmeTarihi).getTime() - new Date(a.eklenmeTarihi).getTime();
    });

    return books;
  });

  protected readonly columns: TableColumn[] = [
    { key: 'ad', label: 'Kitap Adi', sortable: true },
    { key: 'yazar', label: 'Yazar', sortable: true },
    { key: 'tur', label: 'Tur' },
    { key: 'durum', label: 'Durum', type: 'badge' },
    { key: 'sayfaSayisi', label: 'Sayfa' },
    { key: 'puan', label: 'Puan', type: 'stars' },
    { key: 'eklenmeTarihi', label: 'Eklenme', type: 'date' },
  ];

  constructor() {
    setTimeout(() => this.loading.set(false), 300);
  }

  protected onEdit(book: Book): void {
    this.router.navigate(['/kitaplar', book.id, 'duzenle']);
  }

  protected onDelete(book: Book): void {
    this.selectedBook = book;
    this.deleteDialogVisible.set(true);
  }

  protected confirmDelete(): void {
    if (this.selectedBook) {
      this.booksService.deleteBook(this.selectedBook.id);
      this.selectedBook = null;
    }
    this.deleteDialogVisible.set(false);
  }
}
