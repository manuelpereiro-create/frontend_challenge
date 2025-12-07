import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MetricsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/metrics`; 

    getUserMetrics() {
        return this.http.get<any>(`${this.apiUrl}/user`);
    }

    getAdminMetrics() {
        return this.http.get<any>(`${this.apiUrl}/admin`);
    }
}