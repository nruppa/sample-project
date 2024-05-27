import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueMonitoringComponent } from './queue-monitoring.component';

describe('QueueMonitoringComponent', () => {
  let component: QueueMonitoringComponent;
  let fixture: ComponentFixture<QueueMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
