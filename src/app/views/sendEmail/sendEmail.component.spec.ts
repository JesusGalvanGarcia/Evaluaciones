/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendEmailComponent } from './sendEmail.component';

describe('SendEmailComponent', () => {
  let component: SendEmailComponent;
  let fixture: ComponentFixture<SendEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
