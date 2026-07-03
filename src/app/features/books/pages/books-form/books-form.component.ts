import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { scoreValidator } from '@shared/validators/score-validator';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { CanComponentDeactivate } from '@core/guards/unsaved-changes.guard';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  templateUrl: "./books-form.component.html",
})
export class BooksFormComponent implements CanComponentDeactivate {
  private booksService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NotificationService);

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
    if (this.bookForm.invalid) {
      const error = this.getFirstError();
      if (error) this.notification.show(error, 'error');
      return;
    }

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

  private getFirstError(): string | null {
    const controls = [
      { name: 'ad', label: 'Kitap Adı' },
      { name: 'yazar', label: 'Yazar' },
      { name: 'puan', label: 'Puan' },
    ];
    for (const { name, label } of controls) {
      const control = this.bookForm.get(name);
      if (control?.errors) {
        if (control.errors['required']) return `${label} alanı zorunludur`;
        if (control.errors['scoreInvalid']) return control.errors['scoreInvalid'] as string;
      }
    }
    return 'Formda geçersiz alanlar var';
  }

  hasUnsavedChanges(): boolean {
    return this.bookForm.dirty;
  }
}
