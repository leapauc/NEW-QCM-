import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppressionStagiaireComponent } from './suppression-stagiaire.component';

describe('SuppressionStagiaireComponent', () => {
  let component: SuppressionStagiaireComponent;
  let fixture: ComponentFixture<SuppressionStagiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppressionStagiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppressionStagiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
