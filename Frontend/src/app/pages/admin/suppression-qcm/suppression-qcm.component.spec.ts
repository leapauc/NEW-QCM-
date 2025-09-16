import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppressionQcmComponent } from './suppression-qcm.component';

describe('SuppressionQcmComponent', () => {
  let component: SuppressionQcmComponent;
  let fixture: ComponentFixture<SuppressionQcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppressionQcmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppressionQcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
