import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBaseyearRegionComponent } from './create-baseyear-region.component';

describe('CreateBaseyearRegionComponent', () => {
  let component: CreateBaseyearRegionComponent;
  let fixture: ComponentFixture<CreateBaseyearRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBaseyearRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBaseyearRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
