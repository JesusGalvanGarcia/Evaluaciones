/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Curso1Component } from './curso1.component';

describe('Curso1Component', () => {
  let component: Curso1Component;
  let fixture: ComponentFixture<Curso1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Curso1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Curso1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
