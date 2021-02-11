import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewCpaMappingComponent } from './dialog-view-cpa-mapping.component';

describe('DialogViewCpaMappingComponent', () => {
  let component: DialogViewCpaMappingComponent;
  let fixture: ComponentFixture<DialogViewCpaMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewCpaMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewCpaMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
