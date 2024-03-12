/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Users360Component } from './users360.component';

describe('Users360Component', () => {
  let component: Users360Component;
  let fixture: ComponentFixture<Users360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Users360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Users360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
