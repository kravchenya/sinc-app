import { Injectable } from '@angular/core';
import { FilterState } from './filter';

// @Injectable({
//   providedIn: 'root',
// })
export class PersistenceSettingService {
  private readonly STORAGE_KEY = 'product-list-filters';

  saveFilters(filters: FilterState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));
  }

  loadFilters(): FilterState | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  clearFilters(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
