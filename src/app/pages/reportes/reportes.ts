import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../shared/services/data.service';
import { Distrito, Iglesia, Diezmo } from '../../shared/models/asociacion.model';
import { jsPDF } from 'jspdf';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  // Cambiar a template en línea
  template: `
    <div class="dashboard-container">
      <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-auto">
          <app-sidebar></app-sidebar>
        </div>
        
        <!-- Contenido principal -->
        <div class="col main-content">
          <div class="container-fluid py-4">
            <h1 class="mb-4">Reportes</h1>
            
            <div class="row mb-4">
              <div class="col-md-6 mb-3">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">Distribución de Diezmos por Asociación</h5>
                  </div>
                  <div class="card-body">
                    <canvas #aportesPorDistritoChart class="grafico-pequeno"></canvas>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 mb-3">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">Diezmos por Iglesia (Top 10)</h5>
                  </div>
                  <div class="card-body">
                    <canvas #aportesPorAsociacionChart class="grafico-pequeno"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Generar Reportes</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <div class="card report-card">
                      <div class="card-body text-center">
                        <i class="bi bi-cash-coin report-icon"></i>
                        <h5 class="mt-3">Reporte de Diezmos</h5>
                        <p class="text-muted">Generar informe detallado de diezmos por período</p>
                        <button class="btn btn-primary" (click)="generarReporteDiezmosPDF()">Generar</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-4 mb-3">
                    <div class="card report-card">
                      <div class="card-body text-center">
                        <i class="bi bi-people report-icon"></i>
                        <h5 class="mt-3">Reporte de Miembros</h5>
                        <p class="text-muted">Generar informe de miembros por iglesia</p>
                        <button class="btn btn-primary" (click)="generarReporteMiembrosPDF()">Generar</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-4 mb-3">
                    <div class="card report-card">
                      <div class="card-body text-center">
                        <i class="bi bi-graph-up report-icon"></i>
                        <h5 class="mt-3">Reporte de Crecimiento</h5>
                        <p class="text-muted">Generar informe de crecimiento anual</p>
                        <button class="btn btn-primary" (click)="generarReporteCrecimientoPDF()">Generar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .main-content {
      padding-top: 20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    
    .card {
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 20px;
    }
    
    .card-header {
      background-color: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .report-card {
      transition: transform 0.3s ease;
    }
    
    .report-card:hover {
      transform: translateY(-5px);
    }
    
    .report-icon {
      font-size: 2.5rem;
      color: #1e2a3a;
    }

    .grafico-pequeno {
      max-width: 500px;
      max-height: 500px;
      width: 100%;
      height: 300px;
      margin: 0 auto;
      display: block;
    }
  `]
})
export class Reportes implements OnInit, AfterViewInit {
  @ViewChild('aportesPorDistritoChart') distritoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('aportesPorAsociacionChart') asociacionChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private dataService: DataService) {}
  
  ngOnInit() {
    // Cachear asociaciones para reportes PDF
    this.dataService.getAsociaciones().subscribe(asoc => {
      this.asociacionesCache = asoc;
    });
  }

  ngAfterViewInit() {
    this.loadCharts();
  }
  
  loadCharts() {
    this.dataService.getDiezmos().subscribe((diezmos: Diezmo[]) => {
      this.dataService.getIglesias().subscribe((iglesias: Iglesia[]) => {
        this.dataService.getAsociaciones().subscribe(asociaciones => {
          // 1. Diezmos por Distrito (histórico)
          const distritoMap: { [distrito: string]: number } = {};
          iglesias.forEach(iglesia => {
            const distrito = this.getDistritoNombreByIglesia(iglesia, asociaciones);
            distritoMap[distrito] = 0;
          });
          diezmos.forEach(diezmo => {
            const iglesia = iglesias.find(i => i.id === diezmo.iglesiaId);
            if (iglesia) {
              const distrito = this.getDistritoNombreByIglesia(iglesia, asociaciones);
              distritoMap[distrito] = (distritoMap[distrito] || 0) + diezmo.monto;
            }
          });

          // 2. Diezmos por Iglesia (Top 10)
          const iglesiaMap: { [iglesia: string]: number } = {};
          iglesias.forEach(iglesia => {
            iglesiaMap[iglesia.nombre] = 0;
          });
          diezmos.forEach(diezmo => {
            const iglesia = iglesias.find(i => i.id === diezmo.iglesiaId);
            if (iglesia) {
              iglesiaMap[iglesia.nombre] = (iglesiaMap[iglesia.nombre] || 0) + diezmo.monto;
            }
          });
          const topIglesias = Object.entries(iglesiaMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
          const topIglesiasMap: { [iglesia: string]: number } = {};
          topIglesias.forEach(([nombre, monto]) => {
            topIglesiasMap[nombre] = monto;
          });

          // Renderizar ambos gráficos
          setTimeout(() => this.renderDistritoChart(distritoMap), 0);
          setTimeout(() => this.renderIglesiaChart(topIglesiasMap), 0);
        });
      });
    });
  }

  getDistritoNombreByIglesia(iglesia: Iglesia, asociaciones: any[]): string {
    for (const asoc of asociaciones) {
      for (const dist of asoc.distritos) {
        if (dist.iglesias && dist.iglesias.find((i: Iglesia) => i.id === iglesia.id)) {
          return dist.nombre;
        }
      }
    }
    // fallback: buscar por distritoId
    for (const asoc of asociaciones) {
      for (const dist of asoc.distritos) {
        if (dist.id === iglesia.distritoId) {
          return dist.nombre;
        }
      }
    }
    return 'Desconocido';
  }

  getAsociacionNombreByIglesia(iglesia: Iglesia, asociaciones: any[]): string {
    for (const asoc of asociaciones) {
      for (const dist of asoc.distritos) {
        if (dist.iglesias && dist.iglesias.find((i: Iglesia) => i.id === iglesia.id)) {
          return asoc.nombre;
        }
        if (dist.id === iglesia.distritoId) {
          return asoc.nombre;
        }
      }
    }
    return 'Desconocida';
  }

  renderDistritoChart(distritoMap: { [distrito: string]: number }) {
    const ctx = this.distritoChartRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(distritoMap),
          datasets: [{
            label: 'Diezmos por Distrito',
            data: Object.values(distritoMap),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(199, 199, 199, 0.7)',
              'rgba(83, 102, 255, 0.7)',
              'rgba(255, 99, 255, 0.7)',
              'rgba(99, 255, 132, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true
        }
      });
    }
  }

  renderIglesiaChart(iglesiaMap: { [iglesia: string]: number }) {
    const ctx = this.asociacionChartRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(iglesiaMap),
          datasets: [{
            label: 'Diezmos por Iglesia (Top 10)',
            data: Object.values(iglesiaMap),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(199, 199, 199, 0.7)',
              'rgba(83, 102, 255, 0.7)',
              'rgba(255, 99, 255, 0.7)',
              'rgba(99, 255, 132, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true
        }
      });
    }
  }

  generarReporteDiezmosPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Diezmos', 105, 15, { align: 'center' });
    let y = 30;
    doc.setFontSize(12);
    doc.text('Totales por Distrito:', 10, y);
    y += 8;
    const distritoMap: { [distrito: string]: number } = {};
    this.dataService.getIglesias().subscribe(iglesias => {
      this.dataService.getDiezmos().subscribe(diezmos => {
        iglesias.forEach(iglesia => {
          const distrito = this.getDistritoNombreByIglesia(iglesia, this.asociacionesCache || []);
          distritoMap[distrito] = 0;
        });
        diezmos.forEach(diezmo => {
          const iglesia = iglesias.find(i => i.id === diezmo.iglesiaId);
          if (iglesia) {
            const distrito = this.getDistritoNombreByIglesia(iglesia, this.asociacionesCache || []);
            distritoMap[distrito] = (distritoMap[distrito] || 0) + diezmo.monto;
          }
        });
        // Encabezado de tabla
        doc.setFont('helvetica', 'bold');
        doc.text('Distrito', 20, y);
        doc.text('Total S/', 120, y);
        doc.setFont('helvetica', 'normal');
        y += 7;
        Object.entries(distritoMap).forEach(([distrito, monto]) => {
          doc.text(String(distrito ?? ''), 20, y);
          doc.text(String(monto != null ? monto.toLocaleString() : ''), 120, y, { align: 'right' });
          y += 7;
        });
        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Top 10 Iglesias por Diezmo:', 10, y);
        y += 8;
        doc.text('Iglesia', 20, y);
        doc.text('Total S/', 120, y);
        doc.setFont('helvetica', 'normal');
        y += 7;
        const iglesiaMap: { [iglesia: string]: number } = {};
        iglesias.forEach(iglesia => {
          iglesiaMap[iglesia.nombre] = 0;
        });
        diezmos.forEach(diezmo => {
          const iglesia = iglesias.find(i => i.id === diezmo.iglesiaId);
          if (iglesia) {
            iglesiaMap[iglesia.nombre] = (iglesiaMap[iglesia.nombre] || 0) + diezmo.monto;
          }
        });
        const topIglesias = Object.entries(iglesiaMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);
        topIglesias.forEach(([nombre, monto]) => {
          doc.text(String(nombre ?? ''), 20, y);
          doc.text(String(monto != null ? monto.toLocaleString() : ''), 120, y, { align: 'right' });
          y += 7;
        });
        doc.save('reporte_diezmos.pdf');
      });
    });
  }

  generarReporteMiembrosPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Miembros', 105, 15, { align: 'center' });
    let y = 30;
    doc.setFontSize(12);
    this.dataService.getIglesias().subscribe(iglesias => {
      this.dataService.getMiembros().subscribe(miembros => {
        doc.setFont('helvetica', 'bold');
        doc.text('Iglesia', 20, y);
        doc.text('Total Miembros', 120, y);
        doc.setFont('helvetica', 'normal');
        y += 7;
        iglesias.forEach(iglesia => {
          const total = miembros.filter(m => m.iglesiaId === iglesia.id).length;
          doc.text(String((iglesia && iglesia.nombre) ? iglesia.nombre : ''), 20, y);
          doc.text(String(total != null ? total.toString() : ''), 120, y, { align: 'right' });
          y += 7;
        });
        doc.save('reporte_miembros.pdf');
      });
    });
  }

  generarReporteCrecimientoPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Crecimiento', 105, 15, { align: 'center' });
    let y = 30;
    doc.setFontSize(12);
    this.dataService.getMiembros().subscribe(miembros => {
      // Agrupar por año de registro
      const crecimientoPorAnio: { [anio: string]: number } = {};
      miembros.forEach(m => {
        const anio = new Date(m.fechaRegistro).getFullYear();
        crecimientoPorAnio[anio] = (crecimientoPorAnio[anio] || 0) + 1;
      });
      doc.setFont('helvetica', 'bold');
      doc.text('Año', 20, y);
      doc.text('Miembros Registrados', 120, y);
      doc.setFont('helvetica', 'normal');
      y += 7;
      Object.entries(crecimientoPorAnio).sort().forEach(([anio, total]) => {
        doc.text(String(anio ?? ''), 20, y);
        doc.text(String(total != null ? total.toString() : ''), 120, y, { align: 'right' });
        y += 7;
      });
      doc.save('reporte_crecimiento.pdf');
    });
  }

  asociacionesCache: any[] | null = null;
}