import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCommodityPageComponent } from './result-commodity-page.component';

describe('ResultCommodityPageComponent', () => {
  let component: ResultCommodityPageComponent;
  let fixture: ComponentFixture<ResultCommodityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultCommodityPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultCommodityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
