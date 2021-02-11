import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMatrixPageComponent } from './index-matrix-page.component';

describe('IndexMatrixPageComponent', () => {
  let component: IndexMatrixPageComponent;
  let fixture: ComponentFixture<IndexMatrixPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexMatrixPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMatrixPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
