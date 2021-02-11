import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMakeDicisionComponent } from './dialog-make-dicision.component';

describe('DialogMakeDicisionComponent', () => {
  let component: DialogMakeDicisionComponent;
  let fixture: ComponentFixture<DialogMakeDicisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMakeDicisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMakeDicisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
