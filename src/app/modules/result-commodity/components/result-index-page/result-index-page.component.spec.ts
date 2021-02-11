import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultIndexPageComponent } from './result-index-page.component';

describe('ResultIndexPageComponent', () => {
  let component: ResultIndexPageComponent;
  let fixture: ComponentFixture<ResultIndexPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultIndexPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
