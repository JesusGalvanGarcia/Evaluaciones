/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Personal360Component } from './personal360.component';

describe('Personal360Component', () => {
  let component: Personal360Component;
  let fixture: ComponentFixture<Personal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Personal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Personal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
