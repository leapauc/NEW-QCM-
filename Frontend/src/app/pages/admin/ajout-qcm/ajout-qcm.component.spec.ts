import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutQcmComponent } from './ajout-qcm.component';

describe('AjoutQcmComponent', () => {
  let component: AjoutQcmComponent;
  let fixture: ComponentFixture<AjoutQcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutQcmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutQcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
