/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Admin360Component } from './Admin360.component';

describe('Admin360Component', () => {
  let component: Admin360Component;
  let fixture: ComponentFixture<Admin360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Admin360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Admin360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
