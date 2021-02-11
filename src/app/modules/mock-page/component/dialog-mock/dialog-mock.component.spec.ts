import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMockComponent } from './dialog-mock.component';

describe('DialogMockComponent', () => {
  let component: DialogMockComponent;
  let fixture: ComponentFixture<DialogMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
