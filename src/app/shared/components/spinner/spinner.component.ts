import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../../core/services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  protected spinnerService = inject(SpinnerService);
}