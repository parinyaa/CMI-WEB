import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSettingMappingComponent } from './dialog-setting-mapping.component';

describe('DialogSettingMappingComponent', () => {
  let component: DialogSettingMappingComponent;
  let fixture: ComponentFixture<DialogSettingMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSettingMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSettingMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
