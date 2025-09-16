import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageResultsComponent } from './affichage-results.component';

describe('AffichageResultsComponent', () => {
  let component: AffichageResultsComponent;
  let fixture: ComponentFixture<AffichageResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffichageResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichageResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
