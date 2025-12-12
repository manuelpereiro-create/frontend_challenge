import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { MetricsService } from '../../core/services/metrics.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

class MockAuthService {
  currentUser = signal(null);
  me() { return of({ role: 'user' }); }
  isAdmin() { return false; }
  logout() {}
}

class MockMetricsService {
  getUserMetrics() { return of({}); }
  getAdminMetrics() { return of({}); }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;
  let metricsService: MetricsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        // Usamos useClass para inyectar nuestras clases falsas
        { provide: AuthService, useClass: MockAuthService },
        { provide: MetricsService, useClass: MockMetricsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    metricsService = TestBed.inject(MetricsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});