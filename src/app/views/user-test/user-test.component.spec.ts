import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestComponent } from './user-test.component';

describe('UserTestComponent', () => {
  let component: UserTestComponent;
  let fixture: ComponentFixture<UserTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTestComponent]
    });
    fixture = TestBed.createComponent(UserTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
