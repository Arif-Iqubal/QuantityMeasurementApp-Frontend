import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);

  selectedType = 'LengthUnit';
  selectedAction = 'add';
  isArithmeticMode = true;
  result: any = null;
  error: string | null = null;

  // History states
  history: any[] = [];
  showHistory = false;
  
  units: any = {
    LengthUnit: ["FEET", "INCHES", "YARD", "CENTIMETERS"],
    WeightUnit: ["KILOGRAM", "GRAM", "POUND"],
    VolumeUnit: ["MILLILITER", "LITRE", "GALLON"],
    TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"]
  };  

  calc = { val1: 1, val2: 1, unit1: '', unit2: '', operator: 'add' };

  ngOnInit() { this.updateUnits(); }

  updateUnits() {
    this.calc.unit1 = this.units[this.selectedType][0];
    this.calc.unit2 = this.units[this.selectedType][0];
  }

  setType(type: string) {
    this.selectedType = type;
    this.updateUnits();
  }

  setAction(action: string) {
    this.selectedAction = action;
    this.isArithmeticMode = action === 'add' || action === 'subtract' || action === 'divide';
  }

  calculate() {
    this.error = null;
    const body = {
      thisQuantityDTO: { value: this.calc.val1, unit: this.calc.unit1, measurementType: this.selectedType },
      thatQuantityDTO: { value: this.calc.val2, unit: this.calc.unit2, measurementType: this.selectedType }
    };

    const actionUrl = this.isArithmeticMode ? this.calc.operator : this.selectedAction;
    
    this.http.post(`${environment.gatewayUrl}/api/v1/quantities/${actionUrl}`, body)
      .subscribe({
        next: (res) => this.result = res,
        error: (err) => this.error = "Measurement failed: " + (err.error?.message || "Server Error")
      });
  }

  // Fetch history from backend
  viewHistory() {
    this.http.get<any[]>(`${environment.gatewayUrl}/api/v1/quantities/history/errored`)
      .subscribe({
        next: (res) => {
          this.history = res;
          this.showHistory = true;
        },
        error: (err) => this.error = "Could not load history"
      });
  }

  closeHistory() {
    this.showHistory = false;
  }
}