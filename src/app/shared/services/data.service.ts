import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Asociacion, Distrito, Iglesia, Pastor, Miembro, Diezmo, Ofrenda } from '../models/asociacion.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Listas de nombres para generar nombres de iglesias más realistas
  private nombresIglesias = [
    'Emanuel', 'Betel', 'Nueva Vida', 'Luz del Mundo', 'Fuente de Vida', 'Manantial', 'Esperanza', 
    'Gracia y Verdad', 'Palabra Viva', 'Camino de Fe', 'Puerta del Cielo', 'Buen Pastor', 'Redención', 
    'Restauración', 'Vida Abundante', 'Príncipe de Paz', 'Maranatha', 'Shalom', 'Peniel', 'Filadelfia', 
    'Siloé', 'Monte Sion', 'Getsemaní', 'Nazaret', 'Belén', 'Jerusalén', 'Galilea', 'Jordán', 'Eben-Ezer', 
    'Bethania', 'Monte Horeb', 'Monte Sinaí', 'Monte Carmelo', 'Monte de los Olivos', 'Jericó', 'Antioquía', 
    'Corinto', 'Éfeso', 'Tesalónica', 'Filipos', 'Colosas', 'Esmirna', 'Pérgamo', 'Tiatira', 'Sardis', 
    'Laodicea', 'Samaria', 'Judea', 'Damasco', 'Cesarea', 'Caná', 'Capernaum', 'Betesda', 'Gólgota', 
    'Calvario', 'Getsemaní', 'Edén', 'Canaán', 'Sion', 'Moriah', 'Tabor', 'Hermón', 'Líbano', 'Gilgal', 
    'Gilead', 'Jope', 'Tarsis', 'Patmos', 'Berea', 'Emaús', 'Betfagé', 'Betania', 'Arimatea', 'Magdala'
  ];

  private sectoresLima = [
    'San Juan de Lurigancho', 'Ate', 'Chaclacayo', 'Chosica', 'Ñaña', 'Los Olivos', 'San Martín de Porres', 
    'Comas', 'Carabayllo', 'Trapiche', 'Puente Piedra', 'Ventanilla', 'Cercado de Lima', 'Jesús María', 
    'Lince', 'San Isidro', 'Miraflores', 'Barranco', 'Chorrillos', 'Villa El Salvador', 'Villa María del Triunfo', 
    'San Juan de Miraflores', 'La Molina', 'Santa Anita', 'El Agustino', 'Rímac', 'Independencia', 'San Miguel', 
    'Pueblo Libre', 'Magdalena', 'Surquillo', 'San Borja', 'Santiago de Surco', 'La Victoria'
  ];

  private sectoresChiclayo = [
    'Centro', 'José Leonardo Ortiz', 'La Victoria', 'Pimentel', 'Monsefú', 'Pomalca', 'Tumán', 
    'Lambayeque', 'Ferreñafe', 'Reque', 'Santa Rosa', 'Eten', 'Puerto Eten', 'Picsi', 'Cayaltí', 
    'Zaña', 'Nueva Arica', 'Oyotún', 'Chongoyape', 'Pátapo', 'Pucalá', 'Mochumí', 'Mórrope', 'Jayanca'
  ];

  private sectoresTrujillo = [
    'Centro', 'El Porvenir', 'Florencia de Mora', 'Huanchaco', 'La Esperanza', 'Laredo', 'Moche', 
    'Salaverry', 'Víctor Larco Herrera', 'Simbal', 'Poroto', 'El Milagro', 'Alto Trujillo', 'Buenos Aires', 
    'Chicago', 'Las Quintanas', 'La Merced', 'San Andrés', 'Santa María', 'Vista Alegre', 'La Rinconada', 
    'Mansiche', 'Monserrate', 'San Isidro'
  ];

  private sectoresCajamarca = [
    'Centro', 'Baños del Inca', 'Jesús', 'Llacanora', 'Namora', 'Matara', 'San Marcos', 'Ichocán', 
    'Pedro Gálvez', 'Gregorio Pita', 'Chancay', 'Eduardo Villanueva', 'Cajabamba', 'Condebamba', 'Sitacocha', 
    'Cachachi', 'Celendín', 'Huasmín', 'Jorge Chávez', 'José Gálvez', 'Miguel Iglesias', 'Oxamarca', 'Sorochuco', 
    'Sucre', 'Utco', 'La Libertad de Pallán', 'Chota', 'Contumazá', 'Cutervo', 'Hualgayoc', 'Jaén', 'San Ignacio', 
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  private callesLima = [
    'Abancay', 'Arequipa', 'Tacna', 'Garcilaso de la Vega', 'Javier Prado', 'La Marina', 'Brasil', 
    'Venezuela', 'Colonial', 'Universitaria', 'Túpac Amaru', 'Tomás Marsano', 'Benavides', 'Angamos', 
    'Primavera', 'El Sol', 'La Paz', 'Los Incas', 'Salaverry', 'Petit Thouars', 'Alfonso Ugarte', 
    'Paseo de la República', 'Aviación', 'Canadá', 'San Luis', 'Nicolás Ayllón', 'Grau', 'Bolognesi', 
    'Sucre', 'Los Héroes', 'Pachacútec', 'Próceres', 'Wiesse', 'Canto Grande', 'Naranjal', 'Izaguirre', 
    'Universitaria', 'La Mar', 'Ejército', 'Aramburu', 'Larco', 'Pardo', 'Reducto', 'Huaylas', 'Guardia Civil'
  ];

  private callesChiclayo = [
    'Balta', 'Bolognesi', 'Elías Aguirre', 'Luis Gonzáles', 'Pedro Ruiz', 'Salaverry', 'San José', 
    'Cuglievan', 'Vicente de la Vega', 'Lora y Lora', 'Manuel María Izaga', 'José Leonardo Ortiz', 
    'Sáenz Peña', 'Leoncio Prado', 'Grau', 'Junín', 'Huamachuco', 'Tarata', 'Arica', 'Tacna', 
    'Amazonas', 'Los Incas', 'Agricultura', 'Chinchaysuyo', 'Panamericana Norte'
  ];

  private callesTrujillo = [
    'España', 'Gamarra', 'Pizarro', 'Orbegoso', 'Independencia', 'Bolívar', 'Ayacucho', 'Colón', 
    'San Martín', 'Junín', 'Grau', 'Bolognesi', 'Eguren', 'América', 'Los Incas', 'Miraflores', 
    'Larco', 'Húsares de Junín', 'Fátima', 'Los Ángeles', 'Mansiche', 'Vallejo', 'Unión', 'Moche', 
    'Industrial', 'Panamericana Norte'
  ];

  private callesCajamarca = [
    'Amalia Puga', 'El Comercio', 'Amazonas', 'José Gálvez', 'Apurímac', 'Cruz de Piedra', 
    'Del Batán', 'Dos de Mayo', 'Huánuco', 'Junín', 'Los Gladiolos', 'Mario Urteaga', 'San Martín', 
    'Tarapacá', 'Unión', 'Villanueva', 'Angamos', 'Atahualpa', 'Belén', 'Chanchamayo', 'El Inca', 
    'Fraternidad', 'Iquique', 'La Paz', 'Los Sauces', 'Progreso', 'Revilla Pérez', 'Silva Santisteban'
  ];

  // Datos simulados basados en la información proporcionada
  private asociaciones: Asociacion[] = [
    {
      id: 1,
      nombre: 'Lima Este',
      distritos: [
        {
          id: 1,
          nombre: 'Lima cercado, SJL, Chaclacayo, Chosica, Ñaña',
          cantidadIglesias: 450,
          cantidadMiembros: 37500,
          diezmoMensual: 15000,
          ofrendaMensual: 6000
        }
      ]
    },
    {
      id: 2,
      nombre: 'Lima Oeste',
      distritos: [
        {
          id: 2,
          nombre: 'Los Olivos, San Martín de Porres, Comas, Carabayllo, Trapiche, Puente Piedra, Ventanilla',
          cantidadIglesias: 578,
          cantidadMiembros: 48900,
          diezmoMensual: 13570,
          ofrendaMensual: 4356
        }
      ]
    },
    {
      id: 3,
      nombre: 'Chiclayo',
      distritos: [
        {
          id: 3,
          nombre: 'Todo Chiclayo',
          cantidadIglesias: 267,
          cantidadMiembros: 17000,
          diezmoMensual: 12000,
          ofrendaMensual: 2300
        }
      ]
    },
    {
      id: 4,
      nombre: 'Trujillo',
      distritos: [
        {
          id: 4,
          nombre: 'Todo Trujillo',
          cantidadIglesias: 312,
          cantidadMiembros: 21000,
          diezmoMensual: 15000,
          ofrendaMensual: 2477
        }
      ]
    },
    {
      id: 5,
      nombre: 'Cajamarca',
      distritos: [
        {
          id: 5,
          nombre: 'Todo Cajamarca',
          cantidadIglesias: 541,
          cantidadMiembros: 46900,
          diezmoMensual: 19000,
          ofrendaMensual: 3244
        }
      ]
    }
  ];

  // Eliminar este constructor vacío
  private asociacionesSubject = new BehaviorSubject<Asociacion[]>(this.asociaciones);
  
  getAsociaciones(): Observable<Asociacion[]> {
    return this.asociacionesSubject.asObservable();
  }
  
  getAsociacionById(id: number): Observable<Asociacion | undefined> {
    const asociacion = this.asociaciones.find(a => a.id === id);
    return of(asociacion);
  }
  
  getDistritosByAsociacionId(asociacionId: number): Observable<Distrito[]> {
    const asociacion = this.asociaciones.find(a => a.id === asociacionId);
    return of(asociacion ? asociacion.distritos : []);
  }
  
  // Métodos para simular la recolección de diezmos y ofrendas
  registrarDiezmo(diezmo: Diezmo): Observable<boolean> {
    // Aquí simularíamos el registro en una base de datos
    console.log('Diezmo registrado:', diezmo);
    return of(true);
  }
  
  registrarOfrenda(ofrenda: Ofrenda): Observable<boolean> {
    // Aquí simularíamos el registro en una base de datos
    console.log('Ofrenda registrada:', ofrenda);
    return of(true);
  }
  
  // Método para calcular distribución de ofrendas (60% iglesia, 40% asociación)
  calcularDistribucionOfrenda(monto: number): {montoIglesia: number, montoAsociacion: number} {
    const montoIglesia = monto * 0.6;
    const montoAsociacion = monto * 0.4;
    return { montoIglesia, montoAsociacion };
  }
  
  // Método para generar reportes
  generarReporteMensual(mes: number, año: number): Observable<any> {
    // Aquí simularíamos la generación de reportes
    const reporte = {
      mes,
      año,
      totalDiezmos: 0,
      totalOfrendas: 0,
      detalleAsociaciones: this.asociaciones.map(a => ({
        nombre: a.nombre,
        totalDiezmos: a.distritos.reduce((sum, d) => sum + d.diezmoMensual, 0),
        totalOfrendas: a.distritos.reduce((sum, d) => sum + d.ofrendaMensual, 0),
        distritos: a.distritos.map(d => ({
          nombre: d.nombre,
          diezmos: d.diezmoMensual,
          ofrendas: d.ofrendaMensual
        }))
      }))
    };
    
    reporte.totalDiezmos = reporte.detalleAsociaciones.reduce((sum, a) => sum + a.totalDiezmos, 0);
    reporte.totalOfrendas = reporte.detalleAsociaciones.reduce((sum, a) => sum + a.totalOfrendas, 0);
    
    return of(reporte);
  }
  
  // Datos simulados de iglesias basados en la información proporcionada
  private iglesias: Iglesia[] = [
    // Lima Este
    ...Array(450).fill(0).map((_, i) => ({
      id: i + 1,
      nombre: this.generarNombreIglesia(1, i),
      direccion: `Av. ${this.callesLima[i % this.callesLima.length]} ${Math.floor(Math.random() * 1000) + 100}`,
      distritoId: 1,
      cantidadMiembros: Math.floor(Math.random() * 100) + 50,
      diezmoSemanal: [Math.random() * 1000, Math.random() * 1000],
      ofrendaSemanal: [Math.random() * 500, Math.random() * 500]
    })),
    
    // Lima Oeste
    ...Array(578).fill(0).map((_, i) => ({
      id: 450 + i + 1,
      nombre: this.generarNombreIglesia(2, i),
      direccion: `Av. ${this.callesLima[i % this.callesLima.length]} ${Math.floor(Math.random() * 1000) + 100}`,
      distritoId: 2,
      cantidadMiembros: Math.floor(Math.random() * 100) + 50,
      diezmoSemanal: [Math.random() * 1000, Math.random() * 1000],
      ofrendaSemanal: [Math.random() * 500, Math.random() * 500]
    })),
    
    // Chiclayo
    ...Array(267).fill(0).map((_, i) => ({
      id: 450 + 578 + i + 1,
      nombre: this.generarNombreIglesia(3, i),
      direccion: `Av. ${this.callesChiclayo[i % this.callesChiclayo.length]} ${Math.floor(Math.random() * 1000) + 100}`,
      distritoId: 3,
      cantidadMiembros: Math.floor(Math.random() * 100) + 50,
      diezmoSemanal: [Math.random() * 1000, Math.random() * 1000],
      ofrendaSemanal: [Math.random() * 500, Math.random() * 500]
    })),
    
    // Trujillo
    ...Array(312).fill(0).map((_, i) => ({
      id: 450 + 578 + 267 + i + 1,
      nombre: this.generarNombreIglesia(4, i),
      direccion: `Av. ${this.callesTrujillo[i % this.callesTrujillo.length]} ${Math.floor(Math.random() * 1000) + 100}`,
      distritoId: 4,
      cantidadMiembros: Math.floor(Math.random() * 100) + 50,
      diezmoSemanal: [Math.random() * 1000, Math.random() * 1000],
      ofrendaSemanal: [Math.random() * 500, Math.random() * 500]
    })),
    
    // Cajamarca
    ...Array(541).fill(0).map((_, i) => ({
      id: 450 + 578 + 267 + 312 + i + 1,
      nombre: this.generarNombreIglesia(5, i),
      direccion: `Av. ${this.callesCajamarca[i % this.callesCajamarca.length]} ${Math.floor(Math.random() * 1000) + 100}`,
      distritoId: 5,
      cantidadMiembros: Math.floor(Math.random() * 100) + 50,
      diezmoSemanal: [Math.random() * 1000, Math.random() * 1000],
      ofrendaSemanal: [Math.random() * 500, Math.random() * 500]
    }))
  ];
  
  // Datos simulados de pastores (230 en total según la información)
  private pastores: Pastor[] = Array(230).fill(0).map((_, i) => {
    const nombre = `Pastor ${i + 1}`;
    const apellido = `Apellido ${i + 1}`;
    return {
      id: i + 1,
      nombre: nombre,
      apellido: apellido,
      email: `${nombre.toLowerCase().replace(' ', '')}.${apellido.toLowerCase()}@${this.generarDominioCorreo(i)}`,
      telefono: `9${Math.floor(Math.random() * 100000000)}`,
      iglesiaId: i + 1,
      distritoId: Math.ceil((i + 1) / 46), // Distribuir pastores entre los 5 distritos
      fechaInicio: new Date(2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    };
  });
  
  // Datos simulados de miembros
  // Listas para generar nombres y apellidos más realistas
  private nombresPersonas = [
    'Juan', 'María', 'José', 'Ana', 'Carlos', 'Lucía', 'Pedro', 'Rosa', 'Miguel', 'Carmen', 
    'Francisco', 'Pilar', 'Manuel', 'Isabel', 'Javier', 'Patricia', 'David', 'Laura', 'Antonio', 'Cristina',
    'Jesús', 'Marta', 'Alberto', 'Sofía', 'Luis', 'Paula', 'Alejandro', 'Raquel', 'Fernando', 'Elena',
    'Roberto', 'Silvia', 'Daniel', 'Beatriz', 'Jorge', 'Susana', 'Pablo', 'Natalia', 'Sergio', 'Mónica',
    'Enrique', 'Alicia', 'Raúl', 'Sandra', 'Diego', 'Nuria', 'Óscar', 'Claudia', 'Andrés', 'Esther',
    'Rubén', 'Lorena', 'Iván', 'Sara', 'Mario', 'Verónica', 'Víctor', 'Marina', 'Eduardo', 'Rocío',
    'Adrián', 'Yolanda', 'Ignacio', 'Sonia', 'Gonzalo', 'Carla', 'Marcos', 'Diana', 'Emilio', 'Julia',
    'Guillermo', 'Irene', 'Samuel', 'Daniela', 'Álvaro', 'Carolina', 'Jaime', 'Inés', 'Nicolás', 'Lourdes',
    'Héctor', 'Amparo', 'Tomás', 'Begoña', 'Joaquín', 'Dolores', 'Gabriel', 'Consuelo', 'Agustín', 'Victoria',
    'Arturo', 'Manuela', 'Rodrigo', 'Margarita', 'Salvador', 'Ángela', 'Alfredo', 'Rosario', 'Ismael', 'Mercedes'
  ];
  
  private apellidosPersonas = [
    'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín',
    'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Alonso', 'Gutiérrez',
    'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Suárez',
    'Molina', 'Morales', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Núñez',
    'Iglesias', 'Medina', 'Garrido', 'Santos', 'Castillo', 'Cortes', 'Lozano', 'Guerrero', 'Cano', 'Prieto',
    'Méndez', 'Cruz', 'Calvo', 'Gallego', 'Vidal', 'León', 'Herrera', 'Márquez', 'Peña', 'Cabrera',
    'Flores', 'Campos', 'Vega', 'Fuentes', 'Carrasco', 'Díez', 'Caballero', 'Reyes', 'Nieto', 'Aguilar',
    'Pascual', 'Herrero', 'Santana', 'Lorenzo', 'Montero', 'Hidalgo', 'Giménez', 'Ibáñez', 'Ferrer', 'Durán',
    'Santiago', 'Benítez', 'Mora', 'Vicente', 'Vargas', 'Arias', 'Carmona', 'Crespo', 'Román', 'Pastor',
    'Soto', 'Sáez', 'Velasco', 'Moya', 'Soler', 'Parra', 'Esteban', 'Bravo', 'Gallardo', 'Rojas'
  ];
  
  // Método para generar un nombre aleatorio
  private generarNombrePersona(indice: number): string {
    return this.nombresPersonas[indice % this.nombresPersonas.length];
  }
  
  // Método para generar un apellido aleatorio
  private generarApellidoPersona(indice: number): string {
    return this.apellidosPersonas[indice % this.apellidosPersonas.length];
  }
  
  // Lista de dominios de correo para generar emails más variados
  private dominiosCorreo = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com',
    'live.com', 'protonmail.com', 'aol.com', 'zoho.com', 'yandex.com',
    'mail.com', 'gmx.com', 'tutanota.com', 'inbox.com', 'fastmail.com',
    'peru.com', 'latinmail.com', 'terra.com.pe', 'movistar.com.pe', 'claro.com.pe'
  ];
  
  // Método para generar un dominio de correo aleatorio
  // Verificar que dominiosCorreo esté definido antes de usarlo
  private generarDominioCorreo(indice: number): string {
    // Verificar que dominiosCorreo esté definido antes de usarlo
    if (!this.dominiosCorreo || !this.dominiosCorreo.length) {
      return 'gmail.com'; // Valor por defecto en caso de error
    }
    return this.dominiosCorreo[indice % this.dominiosCorreo.length];
  }
  
  // Modificar la generación de miembros para usar nombres y apellidos más realistas
  private miembros: Miembro[] = [
    // Lima Este - 37,500 miembros
    ...Array(37500).fill(0).map((_, i) => {
      const nombre = this.generarNombrePersona(i);
      const apellido = this.generarApellidoPersona(i);
      return {
        id: i + 1,
        nombre: nombre,
        apellido: apellido,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random() * 1000)}@${this.generarDominioCorreo(i)}`,
        telefono: `9${Math.floor(Math.random() * 100000000)}`,
        direccion: `Av. ${this.callesLima[i % this.callesLima.length]} ${Math.floor(Math.random() * 1000) + 100}`,
        iglesiaId: Math.ceil((i + 1) / (37500 / 450)), // Distribuir miembros entre las iglesias del distrito
        fechaRegistro: new Date(2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        activo: Math.random() > 0.1 // 90% activos
      };
    }),
    
    // Lima Oeste - 48,900 miembros
    ...Array(48900).fill(0).map((_, i) => {
      const nombre = this.generarNombrePersona(37500 + i);
      const apellido = this.generarApellidoPersona(37500 + i);
      return {
        id: 37500 + i + 1,
        nombre: nombre,
        apellido: apellido,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random() * 1000)}@${this.generarDominioCorreo(37500 + i)}`,
        telefono: `9${Math.floor(Math.random() * 100000000)}`,
        direccion: `Av. ${this.callesLima[i % this.callesLima.length]} ${Math.floor(Math.random() * 1000) + 100}`,
        iglesiaId: 450 + Math.ceil((i + 1) / (48900 / 578)),
        fechaRegistro: new Date(2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        activo: Math.random() > 0.1
      };
    }),
    
    // Chiclayo - 17,000 miembros
    ...Array(17000).fill(0).map((_, i) => {
      const nombre = this.generarNombrePersona(37500 + 48900 + i);
      const apellido = this.generarApellidoPersona(37500 + 48900 + i);
      return {
        id: 37500 + 48900 + i + 1,
        nombre: nombre,
        apellido: apellido,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random() * 1000)}@${this.generarDominioCorreo(37500 + 48900 + i)}`,
        telefono: `9${Math.floor(Math.random() * 100000000)}`,
        direccion: `Av. ${this.callesChiclayo[i % this.callesChiclayo.length]} ${Math.floor(Math.random() * 1000) + 100}`,
        iglesiaId: 450 + 578 + Math.ceil((i + 1) / (17000 / 267)),
        fechaRegistro: new Date(2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        activo: Math.random() > 0.1
      };
    }),
    
    // Trujillo - 21,000 miembros
    ...Array(21000).fill(0).map((_, i) => {
      const nombre = this.generarNombrePersona(37500 + 48900 + 17000 + i);
      const apellido = this.generarApellidoPersona(37500 + 48900 + 17000 + i);
      return {
        id: 37500 + 48900 + 17000 + i + 1,
        nombre: nombre,
        apellido: apellido,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random() * 1000)}@${this.generarDominioCorreo(37500 + 48900 + 17000 + i)}`,
        telefono: `9${Math.floor(Math.random() * 100000000)}`,
        direccion: `Av. ${this.callesTrujillo[i % this.callesTrujillo.length]} ${Math.floor(Math.random() * 1000) + 100}`,
        iglesiaId: 450 + 578 + 267 + Math.ceil((i + 1) / (21000 / 312)),
        fechaRegistro: new Date(2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        activo: Math.random() > 0.1
      };
    }),
    
    // Cajamarca - 46,900 miembros
    ...Array(46900).fill(0).map((_, i) => {
      const nombre = this.generarNombrePersona(37500 + 48900 + 17000 + 21000 + i);
      const apellido = this.generarApellidoPersona(37500 + 48900 + 17000 + 21000 + i);
      return {
        id: 37500 + 48900 + 17000 + 21000 + i + 1,
        nombre: nombre,
        apellido: apellido,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random() * 1000)}@${this.generarDominioCorreo(37500 + 48900 + 17000 + 21000 + i)}`,
        telefono: `9${Math.floor(Math.random() * 100000000)}`,
        direccion: `Av. ${this.callesCajamarca[i % this.callesCajamarca.length]} ${Math.floor(Math.random() * 1000) + 100}`,
        iglesiaId: 450 + 578 + 267 + 312 + Math.ceil((i + 1) / (46900 / 541)),
        fechaRegistro: new Date(2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        activo: Math.random() > 0.1
      };
    })
  ];
  
  // Datos simulados de diezmos (últimos 3 meses)
  private diezmos: Diezmo[] = [];
  
  // Datos simulados de ofrendas (últimos 3 meses)
  private ofrendas: Ofrenda[] = [];
  
  private iglesiasSubject = new BehaviorSubject<Iglesia[]>(this.iglesias);
  private pastoresSubject = new BehaviorSubject<Pastor[]>(this.pastores);
  private miembrosSubject = new BehaviorSubject<Miembro[]>(this.miembros);
  private diezmosSubject = new BehaviorSubject<Diezmo[]>(this.diezmos);
  private ofrendasSubject = new BehaviorSubject<Ofrenda[]>(this.ofrendas);
  
  constructor() {
    this.generarDatosSimulados();
  }
  
  // Método para generar datos simulados de diezmos y ofrendas
  private generarDatosSimulados() {
    const fechaActual = new Date();
    
    // Generar diezmos para los últimos 3 meses
    for (let mes = 0; mes < 3; mes++) {
      const fechaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - mes, 1);
      
      // Para cada miembro activo, generar un diezmo mensual
      this.miembros.filter(m => m.activo).forEach((miembro, index) => {
        // Simular que el 80% de los miembros activos dan diezmo
        if (Math.random() < 0.8) {
          this.diezmos.push({
            id: this.diezmos.length + 1,
            miembroId: miembro.id,
            monto: Math.floor(Math.random() * 500) + 100, // Entre 100 y 600 soles
            fecha: new Date(fechaMes.getFullYear(), fechaMes.getMonth(), Math.floor(Math.random() * 28) + 1),
            iglesiaId: miembro.iglesiaId,
            procesado: true
          });
        }
      });
      
      // Para cada iglesia, generar ofrendas semanales (8-12 por mes)
      this.iglesias.forEach(iglesia => {
        const ofrendasPorMes = Math.floor(Math.random() * 5) + 8; // Entre 8 y 12 ofrendas por mes
        
        for (let i = 0; i < ofrendasPorMes; i++) {
          this.ofrendas.push({
            id: this.ofrendas.length + 1,
            iglesiaId: iglesia.id,
            monto: Math.floor(Math.random() * 300) + 50, // Entre 50 y 350 soles
            fecha: new Date(fechaMes.getFullYear(), fechaMes.getMonth(), Math.floor(Math.random() * 28) + 1),
            descripcion: `Ofrenda ${i + 1} de ${fechaMes.toLocaleString('es-ES', { month: 'long' })}`,
            procesado: true
          });
        }
      });
    }
    
    this.diezmosSubject.next(this.diezmos);
    this.ofrendasSubject.next(this.ofrendas);
  }
  
  getIglesias(): Observable<Iglesia[]> {
    return this.iglesiasSubject.asObservable();
  }
  
  getIglesiasByDistrito(distritoId: number): Observable<Iglesia[]> {
    const iglesiasDistrito = this.iglesias.filter(i => i.distritoId === distritoId);
    return of(iglesiasDistrito);
  }
  
  getPastores(): Observable<Pastor[]> {
    return this.pastoresSubject.asObservable();
  }
  
  getMiembros(): Observable<Miembro[]> {
    return this.miembrosSubject.asObservable();
  }
  
  getMiembrosByIglesia(iglesiaId: number): Observable<Miembro[]> {
    const miembrosIglesia = this.miembros.filter(m => m.iglesiaId === iglesiaId);
    return of(miembrosIglesia);
  }
  
  getDiezmos(): Observable<Diezmo[]> {
    return this.diezmosSubject.asObservable();
  }
  
  getOfrendas(): Observable<Ofrenda[]> {
    return this.ofrendasSubject.asObservable();
  }
  
  // Método para registrar diezmo semanal (por el diácono)
  registrarDiezmoSemanal(iglesiaId: number, fecha: Date, total: number): Observable<boolean> {
    // Implementar lógica según el proceso descrito
    console.log(`Diezmo semanal registrado para iglesia ${iglesiaId}: ${total}`);
    return of(true);
  }
  
  // Método para registrar ofrenda semanal (por el diácono)
  registrarOfrendaSemanal(iglesiaId: number, fecha: Date, total: number): Observable<boolean> {
    // Implementar lógica según el proceso descrito
    console.log(`Ofrenda semanal registrada para iglesia ${iglesiaId}: ${total}`);
    return of(true);
  }
  
  // Método para procesar distribución de ofrendas (60% iglesia, 40% asociación/misión)
  procesarDistribucionOfrendas(ofrendaId: number): Observable<{montoIglesia: number, montoAsociacion: number}> {
    const ofrenda = this.ofrendas.find(o => o.id === ofrendaId);
    if (!ofrenda) {
      return of({ montoIglesia: 0, montoAsociacion: 0 });
    }
    
    const montoIglesia = ofrenda.monto * 0.6;
    const montoAsociacion = ofrenda.monto * 0.4;
    
    // Actualizar estado de procesamiento
    ofrenda.procesado = true;
    this.ofrendasSubject.next(this.ofrendas);
    
    return of({ montoIglesia, montoAsociacion });
  }
  
  // Método para obtener estadísticas para el dashboard
  getEstadisticasDashboard(): Observable<any> {
    const totalIglesias = this.asociaciones.reduce((sum, asociacion) => 
      sum + asociacion.distritos.reduce((distSum, distrito) => distSum + distrito.cantidadIglesias, 0), 0);
    
    const totalMiembros = this.asociaciones.reduce((sum, asociacion) => 
      sum + asociacion.distritos.reduce((distSum, distrito) => distSum + distrito.cantidadMiembros, 0), 0);
    
    const diezmosMes = this.asociaciones.reduce((sum, asociacion) => 
      sum + asociacion.distritos.reduce((distSum, distrito) => distSum + distrito.diezmoMensual, 0), 0);
    
    const ofrendasMes = this.asociaciones.reduce((sum, asociacion) => 
      sum + asociacion.distritos.reduce((distSum, distrito) => distSum + distrito.ofrendaMensual, 0), 0);
    
    return of({
      totalIglesias,
      totalMiembros,
      diezmosMes,
      ofrendasMes
    });
  }
  
  // Método para generar nombres de iglesias
  private generarNombreIglesia(distritoId: number, indice: number): string {
    const nombreBase = this.nombresIglesias[indice % this.nombresIglesias.length];
    let sector = '';
    
    switch(distritoId) {
      case 1: // Lima Este
        sector = this.sectoresLima[indice % (this.sectoresLima.length / 2)];
        break;
      case 2: // Lima Oeste
        sector = this.sectoresLima[(indice % (this.sectoresLima.length / 2)) + Math.floor(this.sectoresLima.length / 2)];
        break;
      case 3: // Chiclayo
        sector = this.sectoresChiclayo[indice % this.sectoresChiclayo.length];
        break;
      case 4: // Trujillo
        sector = this.sectoresTrujillo[indice % this.sectoresTrujillo.length];
        break;
      case 5: // Cajamarca
        sector = this.sectoresCajamarca[indice % this.sectoresCajamarca.length];
        break;
    }
    
    // Alternar entre diferentes formatos de nombres para mayor variedad
    const formato = indice % 5;
    switch(formato) {
      case 0: return `Iglesia ${nombreBase} de ${sector}`;
      case 1: return `Iglesia ${nombreBase} - ${sector}`;
      case 2: return `${nombreBase} de ${sector}`;
      case 3: return `${nombreBase} ${sector}`;
      case 4: return `Comunidad Cristiana ${nombreBase} - ${sector}`;
      default: return `Iglesia ${nombreBase} de ${sector}`;
    }
  }
}