import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-gray-500 text-lg mb-4">{{ message() }}</p>
      <a
        [routerLink]="link()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {{ buttonLabel() }}
      </a>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly message = input<string>('Henuz kayit yok');
  readonly link = input<string>('/kitaplar/ekle');
  readonly buttonLabel = input<string>('Kitap Ekle');
}
