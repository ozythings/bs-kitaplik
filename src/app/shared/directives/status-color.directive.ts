import { Directive, input, ElementRef, effect, inject } from '@angular/core';

@Directive({
  selector: '[statusColor]',
  standalone: true,
})
export class StatusColorDirective {
  readonly statusColor = input.required<string>();

  private readonly colors: Record<string, string[]> = {
    okunacak: ['bg-red-100', 'text-red-800'],
    okunuyor: ['bg-yellow-100', 'text-yellow-800'],
    okundu: ['bg-green-100', 'text-green-800'],
  };

  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      const status = this.statusColor();
      const classes = this.colors[status];
      if (classes) {
        this.el.nativeElement.classList.add(...classes);
      }
    });
  }
}
