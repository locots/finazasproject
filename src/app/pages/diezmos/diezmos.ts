import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { DataService } from '../../shared/services/data.service';
import { Diezmo, Ofrenda, Miembro, Iglesia } from '../../shared/models/asociacion.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-diezmos',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './diezmos.html',
  styleUrl: './diezmos.css'
})
export class Diezmos implements OnInit {
  diezmos: any[] = [];
  ofrendas: any[] = [];
  miembros: Miembro[] = [];
  iglesias: Iglesia[] = [];
  mostrarOfrendas: boolean = true;
  cargandoDiezmos: boolean = true;
  cargandoOfrendas: boolean = true;
  
  // Añadir variables para paginación
  paginaDiezmos: number = 1;
  tamañoPagina: number = 10;
  totalDiezmos: number = 0;
  
  paginaOfrendas: number = 1;
  totalOfrendas: number = 0;
  
  // Agregar Math como propiedad para usarlo en el template
  Math = Math;
  
  // Añadir las propiedades faltantes
  paginaActualDiezmos: string = '';
  disabledAnteriorDiezmos: boolean = true;
  paginasDiezmos: number[] = [];
  disabledSiguienteDiezmos: boolean = false;
  
  paginaActualOfrendas: string = '';
  disabledAnteriorOfrendas: boolean = true;
  paginasOfrendas: number[] = [];
  disabledSiguienteOfrendas: boolean = false;
  
  // Modal y edición para diezmos
  showModalDiezmo = false;
  editModeDiezmo = false;
  modalDiezmo: any = {};
  editIndexDiezmo: number | null = null;

  // Modal y edición para ofrendas
  showModalOfrenda = false;
  editModeOfrenda = false;
  modalOfrenda: any = {};
  editIndexOfrenda: number | null = null;
  
  constructor(private dataService: DataService) {}
  
  ngOnInit() {
    this.cargarDatos();
  }
  
  cargarDatos() {
    // Solo cargamos las iglesias inicialmente (suelen ser menos que los miembros)
    this.dataService.getIglesias().subscribe(iglesias => {
      this.iglesias = iglesias;
      // Cargamos los diezmos y ofrendas, pero no los miembros todavía
      this.cargarDiezmos();
      this.cargarOfrendas();
    });
  }
  
  cargarDiezmos() {
    this.cargandoDiezmos = true;
    this.dataService.getDiezmos().subscribe(data => {
      // Obtener todos los diezmos y ordenarlos por fecha (más reciente primero)
      const todosDiezmos = data
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      
      // Guardar el total para la paginación
      this.totalDiezmos = todosDiezmos.length;
      
      // Calcular qué página mostrar
      const inicio = (this.paginaDiezmos - 1) * this.tamañoPagina;
      const diezmosPagina = todosDiezmos.slice(inicio, inicio + this.tamañoPagina);
      
      // Extraer los IDs de miembros únicos de esta página
      const miembrosIds = [...new Set(diezmosPagina.map(d => d.miembroId))];
      
      // Cargar solo los miembros necesarios para esta página
      this.cargarMiembrosEspecificos(miembrosIds).then(miembrosMap => {
        // Mapear los diezmos con la información de miembros
        this.diezmos = diezmosPagina.map(d => {
          const miembro = miembrosMap.get(d.miembroId);
          const iglesia = this.iglesias.find(i => i.id === d.iglesiaId);
          return {
            id: d.id,
            fecha: new Date(d.fecha).toLocaleDateString('es-ES'),
            miembro: miembro ? `${miembro.nombre} ${miembro.apellido}` : `Miembro ID: ${d.miembroId}`,
            miembroId: d.miembroId,
            monto: d.monto,
            iglesia: iglesia ? iglesia.nombre : `Iglesia ID: ${d.iglesiaId}`,
            iglesiaId: d.iglesiaId,
            procesado: d.procesado
          };
        });
        
        this.cargandoDiezmos = false;
        this.actualizarInfoPaginacionDiezmos();
      });
    });
  }
  
  // Método para cargar solo los miembros específicos que necesitamos
  cargarMiembrosEspecificos(miembrosIds: number[]): Promise<Map<number, Miembro>> {
    return new Promise((resolve) => {
      if (miembrosIds.length === 0) {
        resolve(new Map());
        return;
      }
      
      this.dataService.getMiembros().subscribe(todosLosMiembros => {
        // Filtrar solo los miembros que necesitamos
        const miembrosFiltrados = todosLosMiembros.filter(m => miembrosIds.includes(m.id));
        
        // Crear un mapa para acceso rápido por ID
        const miembrosMap = new Map<number, Miembro>();
        miembrosFiltrados.forEach(m => miembrosMap.set(m.id, m));
        
        resolve(miembrosMap);
      });
    });
  }
  
  cargarOfrendas() {
    this.cargandoOfrendas = true;
    this.dataService.getOfrendas().subscribe(data => {
      // Obtener todas las ofrendas y ordenarlas por fecha (más reciente primero)
      const todasOfrendas = data
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      
      // Guardar el total para la paginación
      this.totalOfrendas = todasOfrendas.length;
      
      // Calcular qué página mostrar
      const inicio = (this.paginaOfrendas - 1) * this.tamañoPagina;
      const ofrendasPagina = todasOfrendas.slice(inicio, inicio + this.tamañoPagina);
      
      // Mapear las ofrendas con la información de iglesias
      this.ofrendas = ofrendasPagina.map(o => {
        const iglesia = this.iglesias.find(i => i.id === o.iglesiaId);
        return {
          id: o.id,
          fecha: new Date(o.fecha).toLocaleDateString('es-ES'),
          iglesia: iglesia ? iglesia.nombre : `Iglesia ID: ${o.iglesiaId}`,
          iglesiaId: o.iglesiaId,
          monto: o.monto,
          descripcion: o.descripcion || 'Ofrenda general',
          procesado: o.procesado
        };
      });
      
      this.cargandoOfrendas = false;
      this.actualizarInfoPaginacionOfrendas();
    });
  }
  
  // Métodos para cambiar de página
  cambiarPaginaDiezmos(pagina: number) {
    this.paginaDiezmos = pagina;
    this.cargarDiezmos();
  }
  
  cambiarPaginaOfrendas(pagina: number) {
    this.paginaOfrendas = pagina;
    this.cargarOfrendas();
  }
  
  toggleMostrarOfrendas() {
    this.mostrarOfrendas = !this.mostrarOfrendas;
  }
  
  // Añadir métodos auxiliares para la paginación
  getTotalPaginasDiezmos(): number {
    return Math.ceil(this.totalDiezmos / this.tamañoPagina);
  }
  
  getTotalPaginasOfrendas(): number {
    return Math.ceil(this.totalOfrendas / this.tamañoPagina);
  }
  
  // Actualizar los métodos para generar arrays de páginas
  actualizarInfoPaginacionDiezmos() {
    const inicio = (this.paginaDiezmos - 1) * this.tamañoPagina + 1;
    const fin = this.paginaDiezmos * this.tamañoPagina > this.totalDiezmos ? 
                this.totalDiezmos : 
                this.paginaDiezmos * this.tamañoPagina;
    
    this.paginaActualDiezmos = `Mostrando ${inicio} - ${fin} de ${this.totalDiezmos} diezmos`;
    
    const totalPaginas = this.getTotalPaginasDiezmos();
    this.paginasDiezmos = [];
    for (let i = 1; i <= Math.min(totalPaginas, 5); i++) {
      this.paginasDiezmos.push(i);
    }
    
    this.disabledAnteriorDiezmos = this.paginaDiezmos === 1;
    this.disabledSiguienteDiezmos = this.paginaDiezmos >= totalPaginas;
  }
  
  actualizarInfoPaginacionOfrendas() {
    const inicio = (this.paginaOfrendas - 1) * this.tamañoPagina + 1;
    const fin = this.paginaOfrendas * this.tamañoPagina > this.totalOfrendas ? 
                this.totalOfrendas : 
                this.paginaOfrendas * this.tamañoPagina;
    
    this.paginaActualOfrendas = `Mostrando ${inicio} - ${fin} de ${this.totalOfrendas} ofrendas`;
    
    const totalPaginas = this.getTotalPaginasOfrendas();
    this.paginasOfrendas = [];
    for (let i = 1; i <= Math.min(totalPaginas, 5); i++) {
      this.paginasOfrendas.push(i);
    }
    
    this.disabledAnteriorOfrendas = this.paginaOfrendas === 1;
    this.disabledSiguienteOfrendas = this.paginaOfrendas >= totalPaginas;
  }
  
  // Estos métodos ya no son necesarios porque ahora usamos propiedades
  // Pero los mantenemos por compatibilidad
  getPaginasDiezmos(): number[] {
    return this.paginasDiezmos;
  }
  
  getPaginasOfrendas(): number[] {
    return this.paginasOfrendas;
  }

  // Métodos para el modal y acciones CRUD de Diezmos
  openAddModalDiezmo() {
    this.editModeDiezmo = false;
    this.modalDiezmo = {
      fecha: '',
      miembro: '',
      iglesia: '',
      monto: 0,
      procesado: false
    };
    this.showModalDiezmo = true;
    this.editIndexDiezmo = null;
  }

  openEditModalDiezmo(diezmo: any, index: number) {
    this.editModeDiezmo = true;
    this.modalDiezmo = { ...diezmo };
    this.showModalDiezmo = true;
    this.editIndexDiezmo = index;
  }

  closeModalDiezmo() {
    this.showModalDiezmo = false;
    this.editIndexDiezmo = null;
  }

  saveDiezmo() {
    if (this.editModeDiezmo && this.editIndexDiezmo !== null) {
      this.diezmos[this.editIndexDiezmo] = { ...this.modalDiezmo };
    } else {
      this.diezmos.push({ ...this.modalDiezmo });
    }
    this.closeModalDiezmo();
  }

  deleteDiezmo(index: number) {
    if (window.confirm('¿Seguro que deseas eliminar este diezmo?')) {
      this.diezmos.splice(index, 1);
    }
  }

  // Métodos para el modal y acciones CRUD de Ofrendas
  openAddModalOfrenda() {
    this.editModeOfrenda = false;
    this.modalOfrenda = {
      fecha: '',
      iglesia: '',
      descripcion: '',
      monto: 0,
      procesado: false
    };
    this.showModalOfrenda = true;
    this.editIndexOfrenda = null;
  }

  openEditModalOfrenda(ofrenda: any, index: number) {
    this.editModeOfrenda = true;
    this.modalOfrenda = { ...ofrenda };
    this.showModalOfrenda = true;
    this.editIndexOfrenda = index;
  }

  closeModalOfrenda() {
    this.showModalOfrenda = false;
    this.editIndexOfrenda = null;
  }

  saveOfrenda() {
    if (this.editModeOfrenda && this.editIndexOfrenda !== null) {
      this.ofrendas[this.editIndexOfrenda] = { ...this.modalOfrenda };
    } else {
      this.ofrendas.push({ ...this.modalOfrenda });
    }
    this.closeModalOfrenda();
  }

  deleteOfrenda(index: number) {
    if (window.confirm('¿Seguro que deseas eliminar esta ofrenda?')) {
      this.ofrendas.splice(index, 1);
    }
  }
}