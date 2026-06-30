import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
  private readonly STORAGE_PREFIX = "bs_kitaplik_";

  get<T>(key: string): T | null {
    const data = localStorage.getItem(this.STORAGE_PREFIX + key);
    return data ? (JSON.parse(data) as T) : null;
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(this.STORAGE_PREFIX + key);
  }

  clear(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }


}
