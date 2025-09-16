import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixQcmComponent } from './choix-qcm.component';

describe('ChoixQcmComponent', () => {
  let component: ChoixQcmComponent;
  let fixture: ComponentFixture<ChoixQcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixQcmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixQcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
