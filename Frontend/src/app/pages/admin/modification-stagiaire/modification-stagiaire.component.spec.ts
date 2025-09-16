import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationStagiaireComponent } from './modification-stagiaire.component';

describe('ModificationStagiaireComponent', () => {
  let component: ModificationStagiaireComponent;
  let fixture: ComponentFixture<ModificationStagiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationStagiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationStagiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
