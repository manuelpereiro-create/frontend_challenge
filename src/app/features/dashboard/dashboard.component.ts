import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MetricsService } from '../../core/services/metrics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="dashboard-layout">
      <nav class="glass-nav">
        <div class="brand">Angular Academy</div>
        
        <div class="user-controls">
            <div class="user-badge">
                <span class="role" [class.admin]="authService.isAdmin()">
                    {{ authService.isAdmin() ? 'ADMIN' : 'USER' }}
                </span>
                <span class="name">{{ currentUser()?.name }}</span>
            </div>
            <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>

      <div class="content-container">
        
        <div class="dashboard-card user-section">
            <div class="card-header">
                <h3>👋 Hola, {{ currentUser()?.name }}</h3>
                <p>Aquí está el resumen de tu actividad personal.</p>
            </div>
            
            <div class="metrics-row">
                <div class="metric-box">
                    <span class="metric-label">Mis Logins Exitosos</span>
                    <span class="metric-value text-primary">
                        {{ userMetrics?.login_count || 0 }}
                    </span>
                </div>
                <div class="metric-box">
                    <span class="metric-label">Última Conexión</span>
                    <span class="metric-value text-accent">
                        {{ (userMetrics?.last_login | date:'dd/MM/yyyy HH:mm') || 'Primera vez' }}
                    </span>
                </div>
            </div>
        </div>

        <div class="dashboard-card admin-section" *ngIf="authService.isAdmin()">
            <div class="card-header">
                <h3 class="text-warning">🛡️ Panel de Administrador</h3>
                <p>Métricas globales de la aplicación.</p>
            </div>

            <div *ngIf="adminMetrics" class="metrics-row">
                <div class="metric-box">
                    <span class="metric-label">Total Usuarios</span>
                    <span class="metric-value">{{ adminMetrics.total_users }}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-label">Total Logins (Sistema)</span>
                    <span class="metric-value">{{ adminMetrics.total_system_logins }}</span>
                </div>
            </div>
            
            <div *ngIf="!adminMetrics" class="loading-text">
                Cargando datos del sistema...
            </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Layout utilizando tus variables CSS globales */
    .dashboard-layout {
        min-height: 100vh;
        /* El fondo ya viene del body global, dejamos transparente */
    }

    /* Navbar estilo Glass */
    .glass-nav {
        display: flex; justify-content: space-between; align-items: center;
        padding: 1rem 2rem;
        background: var(--card-bg); /* Reutilizando tu variable */
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--card-border);
        position: sticky; top: 0; z-index: 10;
    }

    .brand {
        font-weight: 700; font-size: 1.2rem; color: var(--text-strong);
        background: linear-gradient(to right, #a855f7, #6366f1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .user-controls { display: flex; align-items: center; gap: 1.5rem; }

    .user-badge {
        display: flex; flex-direction: column; align-items: flex-end;
        font-size: 0.9rem;
    }
    .name { color: var(--text-main); font-weight: 500; }
    .role { 
        font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; 
        background: rgba(99, 102, 241, 0.2); color: #818cf8; margin-bottom: 2px;
    }
    .role.admin { background: rgba(234, 179, 8, 0.2); color: #facc15; }

    .btn-logout {
        background: transparent; border: 1px solid rgba(248, 113, 113, 0.5);
        color: #fca5a5; padding: 0.5rem 1rem; border-radius: 8px;
        cursor: pointer; transition: all 0.2s;
    }
    .btn-logout:hover { background: rgba(153, 27, 27, 0.3); color: white; }

    /* Contenedor principal */
    .content-container {
        max-width: 1000px; margin: 2rem auto; padding: 0 1.5rem;
        display: flex; flex-direction: column; gap: 2rem;
    }

    /* Tarjetas del Dashboard (mismo estilo que tu Login pero más ancho) */
    .dashboard-card {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--border-radius);
        padding: 2rem;
        box-shadow: var(--shadow-sm);
        /* Glow sutil */
        position: relative; overflow: hidden;
    }

    .card-header { margin-bottom: 2rem; }
    .card-header h3 { margin: 0; font-size: 1.5rem; color: var(--text-strong); }
    .card-header p { margin: 0.5rem 0 0; color: var(--text-muted); }

    .metrics-row {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .metric-box {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.1);
        padding: 1.5rem; border-radius: var(--border-radius-sm);
        display: flex; flex-direction: column; gap: 0.5rem;
    }

    .metric-label { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 2rem; font-weight: 700; color: var(--text-main); }
    
    .text-primary { color: #818cf8; }
    .text-accent { color: #c084fc; font-size: 1.2rem; } /* Fecha más pequeña */
    .text-warning { color: #facc15 !important; }

    .loading-text { color: var(--text-muted); font-style: italic; }
  `]
})
export class DashboardComponent implements OnInit {
    authService = inject(AuthService);
    private metricsService = inject(MetricsService);
    
    // Signals y estado
    currentUser = this.authService.currentUser;
    userMetrics: any = null;
    adminMetrics: any = null;

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        // 1. Llamamos a ME primero para asegurar el token y obtener el usuario actualizado
        // Esto soluciona que "no traiga bien las métricas" si la página se recarga
        this.authService.me().subscribe({
            next: (user) => {
                // Una vez que ME responde éxito, cargamos las métricas AUTOMÁTICAMENTE
                
                // Cargar métricas de usuario personal
                this.metricsService.getUserMetrics().subscribe(data => {
                    this.userMetrics = data;
                });

                // Si es admin, cargar métricas globales
                if (user.role === 'admin') {
                    this.metricsService.getAdminMetrics().subscribe(data => {
                        this.adminMetrics = data;
                    });
                }
            },
            error: () => {
                // Si /me falla, el token no sirve
                this.authService.logout();
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}