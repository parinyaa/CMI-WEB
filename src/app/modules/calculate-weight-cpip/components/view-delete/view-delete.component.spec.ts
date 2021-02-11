import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeleteComponent } from './view-delete.component';

describe('ViewDeleteComponent', () => {
  let component: ViewDeleteComponent;
  let fixture: ComponentFixture<ViewDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
