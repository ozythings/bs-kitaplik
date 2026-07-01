import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Book } from '../models/book.model';
import { StorageService } from '@core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly STORAGE_KEY = 'books';
  private booksSubject = new BehaviorSubject<Book[]>([]);
  readonly books$: Observable<Book[]> = this.booksSubject.asObservable();
  readonly books: Signal<Book[]> = toSignal(this.books$, { initialValue: [] });

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Book[]>(this.STORAGE_KEY);
    if (saved) {
      this.booksSubject.next(saved);
    }
  }

  getBookById(id: number): Book | undefined {
    return this.booksSubject.value.find(b => b.id === id);
  }

  addBook(book: Omit<Book, 'id' | 'eklenmeTarihi'>): void {
    const books = this.booksSubject.value;
    const newBook: Book = {
      ...book,
      id: Date.now(),
      eklenmeTarihi: new Date().toISOString(),
    };
    books.push(newBook);
    this.save(books);
  }

  updateBook(id: number, changes: Partial<Book>): void {
    const books = this.booksSubject.value;
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...changes };
      this.save(books);
    }
  }

  deleteBook(id: number): void {
    const books = this.booksSubject.value.filter(b => b.id !== id);
    this.save(books);
  }

  private save(books: Book[]): void {
    this.storage.set(this.STORAGE_KEY, books);
    this.booksSubject.next([...books]);
  }
}
