import { Routes } from '@angular/router';
import { UnsavedChangesGuard } from '@core/guards/unsaved-changes.guard';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/books-list/books-list.component').then(
        m => m.BooksListComponent
      ),
  },
  {
    path: 'ekle',
    loadComponent: () =>
      import('./pages/books-form/books-form.component').then(
        m => m.BooksFormComponent
      ),
    canDeactivate: [UnsavedChangesGuard],
  },
  {
    path: ':id/duzenle',
    loadComponent: () =>
      import('./pages/books-form/books-form.component').then(
        m => m.BooksFormComponent
      ),
    canDeactivate: [UnsavedChangesGuard],
  },
];
