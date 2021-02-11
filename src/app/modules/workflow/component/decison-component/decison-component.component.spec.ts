import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisonComponentComponent } from './decison-component.component';

describe('DecisonComponentComponent', () => {
  let component: DecisonComponentComponent;
  let fixture: ComponentFixture<DecisonComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisonComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
