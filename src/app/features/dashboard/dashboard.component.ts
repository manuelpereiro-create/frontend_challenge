import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MetricsService } from '../../core/services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="dashboard-wrapper">
      <nav class="navbar">
        <div class="logo">Angular Academy</div>
        <div class="user-info">
          <span>Hola, {{ currentUser()?.name }}</span>
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <div class="container">
        
        <!-- Tarjeta de Usuario Normal -->
        <div class="card user-card">
          <div class="card-header">
            <h3>👤 Mis Métricas</h3>
          </div>
          <div class="card-body">
            <div class="metric-item">
              <span class="label">Total de Logins</span>
              <span class="value">{{ userMetrics?.login_count || 0 }}</span>
            </div>
            <div class="metric-item">
              <span class="label">Último Acceso</span>
              <span class="value">{{ (userMetrics?.last_login | date:'medium') || 'Primera vez' }}</span>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Admin (Solo visible si isAdmin es true) -->
        <div class="card admin-card" *ngIf="authService.isAdmin()">
          <div class="card-header">
            <h3>🛡️ Métricas Globales (Admin)</h3>
          </div>
          <div class="card-body" *ngIf="adminMetrics; else loadingAdmin">
            <div class="metric-item">
              <span class="label">Usuarios Registrados</span>
              <span class="value">{{ adminMetrics.total_users }}</span>
            </div>
            <div class="metric-item">
              <span class="label">Logins Totales del Sistema</span>
              <span class="value">{{ adminMetrics.total_system_logins }}</span>
            </div>
          </div>
          <ng-template #loadingAdmin>
            <p class="loading-text">Cargando métricas de administrador...</p>
          </ng-template>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; min-height: 100vh; }
    .navbar { background-color: #343a40; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .logo { font-weight: bold; font-size: 1.2rem; }
    .user-info { display: flex; gap: 1rem; align-items: center; }
    .logout-btn { background-color: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
    .logout-btn:hover { background-color: #c82333; }
    
    .container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; display: grid; gap: 2rem; }
    
    .card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
    .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #eee; }
    .card-header h3 { margin: 0; font-size: 1.1rem; color: #444; }
    
    .card-body { padding: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    
    .metric-item { display: flex; flex-direction: column; }
    .label { font-size: 0.9rem; color: #666; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 1.8rem; font-weight: bold; color: #2c3e50; }
    
    .user-card .card-header { background-color: #e3f2fd; color: #0d47a1; }
    .admin-card { border: 1px solid #cce5ff; }
    .admin-card .card-header { background-color: #fff3cd; color: #856404; }
    .loading-text { padding: 1rem; color: #666; font-style: italic; }
  `]
})
export class DashboardComponent implements OnInit {
    authService = inject(AuthService);
    private metricsService = inject(MetricsService);

    currentUser = this.authService.currentUser;
    userMetrics: any = null;
    adminMetrics: any = null;

    ngOnInit() {
        this.metricsService.getUserMetrics().subscribe({
            next: (data) => this.userMetrics = data,
            error: (err) => console.error('Error cargando métricas de usuario', err)
        });
        
        if (this.authService.isAdmin()) {
            this.metricsService.getAdminMetrics().subscribe({
                next: (data) => this.adminMetrics = data,
                error: (err) => console.error('Error cargando métricas de admin', err)
            });
        }
    }

    logout() {
        this.authService.logout();
    }
}