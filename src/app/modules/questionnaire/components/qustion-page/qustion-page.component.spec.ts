import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QustionPageComponent } from './qustion-page.component';

describe('QustionPageComponent', () => {
  let component: QustionPageComponent;
  let fixture: ComponentFixture<QustionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QustionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QustionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
