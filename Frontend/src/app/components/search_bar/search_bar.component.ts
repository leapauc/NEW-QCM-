import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Composant de barre de recherche.
 *
 * @description
 * Ce composant fournit une barre de recherche avec liaison bidirectionnelle (`two-way binding`).
 * Il émet un événement à chaque modification de la valeur de recherche.
 *
 * @usageNotes
 * ### Importation
 * Ce composant est autonome (`standalone`) et importe :
 * - `CommonModule` pour les directives Angular communes
 * - `FormsModule` pour la liaison ngModel
 *
 * @example
 * <app-search-bar
 *   placeholder="Rechercher un élément..."
 *   [(value)]="searchTerm"
 *   (valueChange)="applyFilter()"
 * ></app-search-bar>
 *
 * @selector app-search-bar
 * @component
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-3 d-flex justify-content-end">
      <input
        type="text"
        class="form-control w-25"
        placeholder="{{ placeholder }}"
        [(ngModel)]="value"
        (input)="onInputChange()"
      />
    </div>
  `,
})
export class SearchBarComponent {
  /**
   * Texte affiché dans le placeholder de la barre de recherche.
   * @default 'Rechercher...'
   */
  @Input() placeholder = 'Rechercher...';
  /**
   * Valeur de la recherche.
   * Peut être utilisée avec un `two-way binding` via [(value)].
   * @default ''
   */
  @Input() value = '';
  /**
   * Événement émis à chaque changement de la valeur de recherche.
   */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Méthode appelée lors de la saisie dans l'input.
   * Émet la nouvelle valeur via l'EventEmitter `valueChange`.
   */
  onInputChange() {
    this.valueChange.emit(this.value);
  }
}
