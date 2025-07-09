import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { DataService } from '../../shared/services/data.service';
import { Iglesia } from '../../shared/models/asociacion.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-iglesias',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './iglesias.html',
  styleUrl: './iglesias.css'
})
export class Iglesias implements OnInit {
  iglesias: any[] = [];
  totalIglesias: number = 0;
  
  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;

  // Modal y edición
  showModal = false;
  editMode = false;
  modalIglesia: any = {};
  editIndex: number | null = null;
  
  constructor(private dataService: DataService) {}
  
  ngOnInit() {
    // Obtener las iglesias del servicio de datos
    this.dataService.getIglesias().subscribe(iglesiasData => {
      // Obtener todas las iglesias y mezclarlas para tener variedad
      const todasLasIglesias = [...iglesiasData];
      
      // Mezclar las iglesias para tener variedad en cada página
      this.mezclarArray(todasLasIglesias);
      
      this.iglesias = todasLasIglesias.map(iglesia => {
        // Determinar la asociación basada en el ID del distrito
        let asociacion = '';
        if (iglesia.distritoId === 1) asociacion = 'Lima Este';
        else if (iglesia.distritoId === 2) asociacion = 'Lima Oeste';
        else if (iglesia.distritoId === 3) asociacion = 'Chiclayo';
        else if (iglesia.distritoId === 4) asociacion = 'Trujillo';
        else if (iglesia.distritoId === 5) asociacion = 'Cajamarca';
        
        // Determinar la ciudad basada en el distrito y extraer la zona del nombre de la iglesia
        let ciudad = '';
        
        // Extraer la zona del nombre de la iglesia
        const nombreParts = iglesia.nombre.split(' - ');
        const zonaPart = nombreParts.length > 1 ? nombreParts[1] : '';
        
        if (iglesia.distritoId === 1) {
          // Lima Este: Lima cercado, SJL, Chaclacayo, Chosica, Ñaña
          const zonasEste = ['Lima cercado', 'SJL', 'Chaclacayo', 'Chosica', 'Ñaña'];
          ciudad = zonaPart || zonasEste[iglesia.id % zonasEste.length];
        }
        else if (iglesia.distritoId === 2) {
          // Lima Oeste: Los Olivos, San Martín de Porres, Comas, Carabayllo, Trapiche, Puente Piedra, Ventanilla
          const zonasOeste = ['Los Olivos', 'San Martín de Porres', 'Comas', 'Carabayllo', 'Trapiche', 'Puente Piedra', 'Ventanilla'];
          ciudad = zonaPart || zonasOeste[iglesia.id % zonasOeste.length];
        }
        else if (iglesia.distritoId === 3) ciudad = 'Chiclayo';
        else if (iglesia.distritoId === 4) ciudad = 'Trujillo';
        else if (iglesia.distritoId === 5) ciudad = 'Cajamarca';
        
        return {
          id: iglesia.id,
          nombre: iglesia.nombre,
          asociacion: asociacion,
          ciudad: ciudad
        };
      });
      
      // Calcular el número total de páginas
      this.totalPages = Math.ceil(this.iglesias.length / this.itemsPerPage);
      
      // Obtener el total de iglesias para mostrar en la interfaz
      this.dataService.getEstadisticasDashboard().subscribe(stats => {
        this.totalIglesias = stats.totalIglesias;
      });
    });
  }
  
  // Método para mezclar un array (algoritmo Fisher-Yates)
  private mezclarArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Método para generar el array de páginas a mostrar
  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Métodos para el modal y acciones CRUD
  openAddModal() {
    this.editMode = false;
    this.modalIglesia = {
      nombre: '',
      asociacion: '',
      ciudad: ''
    };
    this.showModal = true;
    this.editIndex = null;
  }

  openEditModal(iglesia: any, index: number) {
    this.editMode = true;
    this.modalIglesia = { ...iglesia };
    this.showModal = true;
    this.editIndex = index;
  }

  closeModal() {
    this.showModal = false;
    this.editIndex = null;
  }

  saveIglesia() {
    if (this.editMode && this.editIndex !== null) {
      this.iglesias[this.editIndex] = { ...this.modalIglesia };
    } else {
      this.iglesias.push({ ...this.modalIglesia });
    }
    this.totalIglesias = this.iglesias.length;
    this.closeModal();
  }

  deleteIglesia(index: number) {
    if (window.confirm('¿Seguro que deseas eliminar esta iglesia?')) {
      this.iglesias.splice(index, 1);
      this.totalIglesias = this.iglesias.length;
    }
  }
}