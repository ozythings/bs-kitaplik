import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';
import { TableColumn } from '@core/models/table-column.model';
import { DataTableComponent } from '@shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

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
  templateUrl: "./books-list.component.html",
})
export class BooksListComponent {
  private booksService = inject(BooksService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly searchText = signal('');
  protected readonly filterTur = signal('');
  protected readonly filterDurum = signal('');
  protected readonly sortField = signal<string>('eklenmeTarihi');
  protected readonly sortDir = signal<'asc' | 'desc'>('desc');

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
    const dir = this.sortDir();
    books = [...books].sort((a, b) => {
      if (field === 'puan') {
        if (a.puan == null && b.puan == null) return 0;
        if (a.puan == null) return 1;
        if (b.puan == null) return -1;
        return dir === 'desc' ? b.puan - a.puan : a.puan - b.puan;
      }
      if (field === 'ad') {
        return dir === 'asc'
          ? a.ad.localeCompare(b.ad)
          : b.ad.localeCompare(a.ad);
      }
      const dateA = new Date(a.eklenmeTarihi).getTime();
      const dateB = new Date(b.eklenmeTarihi).getTime();
      return dir === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return books;
  });

  protected readonly columns: TableColumn[] = [
    { key: 'ad', label: 'Kitap Adi', sortable: true },
    { key: 'yazar', label: 'Yazar' },
    { key: 'tur', label: 'Tur' },
    { key: 'durum', label: 'Durum', type: 'badge' },
    { key: 'sayfaSayisi', label: 'Sayfa' },
    { key: 'puan', label: 'Puan', type: 'stars', sortable: true },
    { key: 'eklenmeTarihi', label: 'Eklenme', type: 'date', sortable: true },
  ];

  constructor() {
    setTimeout(() => this.loading.set(false), 300);
  }

  protected onSortFieldChange(field: string): void {
    this.sortField.set(field);
    this.sortDir.set(field === 'ad' ? 'asc' : 'desc');
  }

  protected onColumnSort(event: { key: string; dir: 'asc' | 'desc' }): void {
    this.sortField.set(event.key);
    this.sortDir.set(event.dir);
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
