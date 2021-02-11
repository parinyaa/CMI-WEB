import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMappingWeightComponent } from './dialog-mapping-weight.component';

describe('DialogMappingWeightComponent', () => {
  let component: DialogMappingWeightComponent;
  let fixture: ComponentFixture<DialogMappingWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMappingWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMappingWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
