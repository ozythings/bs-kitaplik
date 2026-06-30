import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  hasUnsavedChanges: () => boolean;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  private readonly confirmText = "Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?";

  canDeactivate(component: CanComponentDeactivate): boolean {
    if (component.hasUnsavedChanges()) {
      return window.confirm(this.confirmText);
    }
    return true;
  }
}
