import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusText',
  standalone: true,
})
export class StatusTextPipe implements PipeTransform {
  private readonly statusMap: Record<string, string> = {
    okunacak: 'Okunacak',
    okunuyor: 'Okunuyor',
    okundu: 'Okundu',
  };

  transform(value: string): string {
    return this.statusMap[value] ?? value;
  }
}
