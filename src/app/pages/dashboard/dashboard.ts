import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../shared/services/data.service';
import { Diezmo, Ofrenda, Iglesia } from '../../shared/models/asociacion.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  totalIglesias: number = 0;
  totalMiembros: number = 0;
  diezmosMes: number = 0;
  ofrendasMes: number = 0;
  
  // Actividad reciente
  actividadReciente: any[] = [];
  iglesiasMap: Map<number, string> = new Map();
  
  constructor(private dataService: DataService) {}
  
  ngOnInit() {
    this.cargarEstadisticas();
    this.initCharts();
    this.cargarActividadReciente();
  }
  
  cargarEstadisticas() {
    this.dataService.getEstadisticasDashboard().subscribe(stats => {
      this.totalIglesias = stats.totalIglesias;
      this.totalMiembros = stats.totalMiembros;
      this.diezmosMes = stats.diezmosMes;
      this.ofrendasMes = stats.ofrendasMes;
    });
  }
  
  cargarActividadReciente() {
    // Primero, cargar el mapa de iglesias para obtener los nombres
    this.dataService.getIglesias().subscribe(iglesias => {
      // Crear un mapa de ID de iglesia a nombre de iglesia
      iglesias.forEach(iglesia => {
        this.iglesiasMap.set(iglesia.id, iglesia.nombre);
      });
      
      // Obtener diezmos del último mes
      this.dataService.getDiezmos().subscribe(diezmos => {
        const fechaActual = new Date();
        const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        
        // Filtrar diezmos del mes actual
        const diezmosMesActual = diezmos.filter(diezmo => 
          diezmo.fecha >= primerDiaMes && diezmo.fecha <= fechaActual
        );
        
        // Obtener ofrendas del último mes
        this.dataService.getOfrendas().subscribe(ofrendas => {
          // Filtrar ofrendas del mes actual
          const ofrendasMesActual = ofrendas.filter(ofrenda => 
            ofrenda.fecha >= primerDiaMes && ofrenda.fecha <= fechaActual
          );
          
          // Combinar diezmos y ofrendas en una sola lista de actividad
          const actividadDiezmos = diezmosMesActual.map(diezmo => ({
            fecha: diezmo.fecha,
            tipo: 'Diezmo',
            iglesia: this.iglesiasMap.get(diezmo.iglesiaId) || `Iglesia ${diezmo.iglesiaId}`,
            monto: diezmo.monto,
            estado: diezmo.procesado ? 'Completado' : 'Pendiente'
          }));
          
          const actividadOfrendas = ofrendasMesActual.map(ofrenda => ({
            fecha: ofrenda.fecha,
            tipo: 'Ofrenda',
            iglesia: this.iglesiasMap.get(ofrenda.iglesiaId) || `Iglesia ${ofrenda.iglesiaId}`,
            monto: ofrenda.monto,
            estado: ofrenda.procesado ? 'Completado' : 'Pendiente'
          }));
          
          // Combinar y ordenar por fecha (más reciente primero)
          this.actividadReciente = [...actividadDiezmos, ...actividadOfrendas]
            .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
            .slice(0, 5); // Mostrar solo las 5 actividades más recientes
        });
      });
    });
  }
  
  initCharts() {
    // Obtener datos de diezmos por mes para los últimos 6 meses
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    
    // Usar valores más realistas basados en los datos de los distritos
    const datosDiezmos = [70000, 72500, 73800, 74570, 75200, 76000];
    const datosOfrendas = [17000, 17500, 18000, 18377, 18500, 19000];
    
    // Gráfico de diezmos por mes
    const diezmosChart = new Chart('diezmosChart', {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Diezmos (S/.)',
          data: datosDiezmos,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Gráfico de ofrendas por mes
    const ofrendasChart = new Chart('ofrendasChart', {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Ofrendas (S/.)',
          data: datosOfrendas,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Método para formatear fechas
  formatearFecha(fecha: Date): string {
    return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
  }
}