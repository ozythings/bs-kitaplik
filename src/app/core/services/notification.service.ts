import { Injectable, signal } from '@angular/core';
import { Notification } from '@core/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifications = signal<Notification[]>([]);
  private nextId = 0;

  readonly current = this.notifications.asReadonly();

  show(message: string, type: Notification['type'] = 'info'): void {
    const id = this.nextId++;
    this.notifications.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.remove(id), 2250);
  }

  remove(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}
