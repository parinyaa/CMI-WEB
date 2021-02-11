import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResultDecisonComponent } from './dialog-result-decison.component';

describe('DialogResultDecisonComponent', () => {
  let component: DialogResultDecisonComponent;
  let fixture: ComponentFixture<DialogResultDecisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResultDecisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResultDecisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
