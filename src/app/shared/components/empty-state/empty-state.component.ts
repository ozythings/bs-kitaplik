import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./empty-state.component.html",
})
export class EmptyStateComponent {
  readonly message = input<string>('Henuz kayit yok');
  readonly link = input<string>('/kitaplar/ekle');
  readonly buttonLabel = input<string>('Kitap Ekle');
}
