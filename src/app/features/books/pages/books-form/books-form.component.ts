import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { scoreValidator } from '@shared/validators/score-validator';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { CanComponentDeactivate } from '@core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  template: `
    <div class="max-w-lg mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">{{ isEdit() ? 'Kitap Duzenle' : 'Kitap Ekle' }}</h1>

      <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <app-form-field label="Kitap Adi" [required]="true" [control]="bookForm.get('ad')">
          <input formControlName="ad" class="w-full border rounded-lg px-3 py-2" />
        </app-form-field>

        <app-form-field label="Yazar" [required]="true" [control]="bookForm.get('yazar')">
          <input formControlName="yazar" class="w-full border rounded-lg px-3 py-2" />
        </app-form-field>

        <app-form-field label="Tur" [control]="bookForm.get('tur')">
          <input formControlName="tur" class="w-full border rounded-lg px-3 py-2" />
        </app-form-field>

        <app-form-field label="Durum" [control]="bookForm.get('durum')">
          <select formControlName="durum" class="w-full border rounded-lg px-3 py-2">
            <option value="okunacak">Okunacak</option>
            <option value="okunuyor">Okunuyor</option>
            <option value="okundu">Okundu</option>
          </select>
        </app-form-field>

        <app-form-field label="Sayfa Sayisi" [control]="bookForm.get('sayfaSayisi')">
          <input type="number" formControlName="sayfaSayisi" class="w-full border rounded-lg px-3 py-2" />
        </app-form-field>

        <app-form-field label="Puan (1-5)" [control]="bookForm.get('puan')">
          <input type="number" formControlName="puan" class="w-full border rounded-lg px-3 py-2" />
        </app-form-field>

        <app-form-field label="Not" [control]="bookForm.get('not')">
          <textarea formControlName="not" class="w-full border rounded-lg px-3 py-2" rows="3"></textarea>
        </app-form-field>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            [disabled]="bookForm.invalid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isEdit() ? 'Guncelle' : 'Ekle' }}
          </button>
          <a
            routerLink="/kitaplar"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Iptal
          </a>
        </div>
      </form>
    </div>
  `,
})
export class BooksFormComponent implements CanComponentDeactivate {
  private booksService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly isEdit = signal(false);
  protected readonly bookForm = new FormGroup({
    ad: new FormControl('', Validators.required),
    yazar: new FormControl('', Validators.required),
    tur: new FormControl(''),
    durum: new FormControl<'okunacak' | 'okunuyor' | 'okundu'>('okunacak'),
    sayfaSayisi: new FormControl<number | null>(null),
    puan: new FormControl<number | null>(null, [scoreValidator()]),
    not: new FormControl(''),
  });

  constructor() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      const book = this.booksService.getBookById(Number(id));
      if (book) {
        this.bookForm.patchValue(book);
      }
    }
  }

  protected onSubmit(): void {
    if (this.bookForm.invalid) return;

    const formValue = this.bookForm.value;
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.booksService.updateBook(Number(id), formValue as any);
    } else {
      this.booksService.addBook(formValue as any);
    }

    this.bookForm.markAsPristine();
    this.router.navigate(['/kitaplar']);
  }

  hasUnsavedChanges(): boolean {
    return this.bookForm.dirty;
  }
}
