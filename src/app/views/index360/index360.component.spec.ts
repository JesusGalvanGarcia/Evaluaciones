/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Index360Component } from './index360.component';

describe('Index360Component', () => {
  let component: Index360Component;
  let fixture: ComponentFixture<Index360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Index360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Index360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
