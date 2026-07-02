import { Injectable, signal } from '@angular/core';
import { Notification } from '@core/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notification = signal<Notification | null>(null);

  readonly current = this.notification.asReadonly();

  show(message: string, type: Notification['type'] = 'info'): void {
    this.notification.set({ message, type });
    setTimeout(() => this.notification.set(null), 1500);
  }
}
