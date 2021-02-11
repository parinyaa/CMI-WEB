import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComponentComponent } from './inbox-component.component';

describe('InboxComponentComponent', () => {
  let component: InboxComponentComponent;
  let fixture: ComponentFixture<InboxComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboxComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
