import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MetricsService } from '../../core/services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private authService: AuthService = inject(AuthService);
    private metricsService: MetricsService = inject(MetricsService);

    protected currentUser = this.authService.currentUser;
    protected userMetrics = signal<any>(null);
    protected adminMetrics = signal<any>(null);

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.authService.me().subscribe({
            next: (user) => {
                this.metricsService.getUserMetrics().subscribe(data => {
                    this.userMetrics.set(data);
                });

                if (user.role === 'admin') {
                    this.metricsService.getAdminMetrics().subscribe(data => {
                        this.adminMetrics.set(data);
                    });
                }
            },
            error: () => {
                this.authService.logout();
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}