import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Composant de pagination réutilisable.
 *
 * @example
 * ```html
 * <app-pagination
 *   [items]="filteredAttempts"
 *   [pageSize]="10"
 *   (pageChange)="onPageChange($event)">
 * </app-pagination>
 * ```
 */
@Component({
  selector: 'app-pagination',
  template: `
    <nav *ngIf="items && items.length > pageSize">
      <ul class="pagination">
        <li class="page-item" [class.disabled]="currentPage === 1">
          <button class="page-link" (click)="prevPage()">&lt;</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">{{ currentPage }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <button class="page-link" (click)="nextPage()">&gt;</button>
        </li>
      </ul>
    </nav>
  `,
  imports: [CommonModule],
})
export class PaginationComponent<T> {
  /** Tableau complet des éléments à paginer */
  @Input() items: T[] = [];

  /** Nombre d'éléments par page */
  @Input() pageSize = 10;

  /** Émet l'array paginé à chaque changement de page */
  @Output() pageChange = new EventEmitter<T[]>();

  /** Page courante */
  currentPage = 1;

  /** Nombre total de pages */
  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  /** Émet les éléments de la page courante */
  private emitPage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pageChange.emit(this.items.slice(start, end));
  }

  /** Passe à la page suivante */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitPage();
    }
  }

  /** Revient à la page précédente */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPage();
    }
  }

  /** Initialisation : émettre la première page */
  ngOnChanges() {
    this.currentPage = 1;
    this.emitPage();
  }
}
