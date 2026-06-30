import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class StorageService {
  private readonly STORAGE_PREFIX = 'bs_kitaplik_';
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    const data = localStorage.getItem(this.STORAGE_PREFIX + key);
    return data ? (JSON.parse(data) as T) : null;
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.STORAGE_PREFIX + key);
  }

  clear(): void {
    if (!this.isBrowser) return;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}
