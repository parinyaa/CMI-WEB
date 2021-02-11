import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBaseyearComponent } from './setting-baseyear.component';

describe('SettingBaseyearComponent', () => {
  let component: SettingBaseyearComponent;
  let fixture: ComponentFixture<SettingBaseyearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingBaseyearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBaseyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
