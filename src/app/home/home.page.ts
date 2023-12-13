import { Component } from '@angular/core';
import {Cancion} from '../cancion'
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  cancionEditando = {} as Cancion;

  arrayColeccionCanciones:any = [{
    id: "",
    cancion: {} as Cancion
  }];

  idCancionSelec: string = "";

  constructor(private firestoreService: FirestoreService) {
    this.obtenerListaCanciones();
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("canciones", this.cancionEditando).then(() => { 
      console.log('Canción añadida correctamente!');
      this.cancionEditando = {} as Cancion;
    }, (error) => {
      console.error(error);
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("canciones", this.idCancionSelec).then(() => {
      console.log("Canción borrada correctamente");
      // Limpiar datos de pantalla
      this.idCancionSelec = "";
      this.cancionEditando = {} as Cancion;
    }, (error) => {
      console.error(error);
    });
  }

  clicBotonModificar() {
    this.firestoreService.modificar("canciones", this.idCancionSelec, this.cancionEditando).then(() => {
      console.log("Canción modificada correctamente");
      // Actualizar la lista completa
      this.obtenerListaCanciones();
      // Limpiar datos de pantalla
      this.cancionEditando = {} as Cancion;
    }, (error) => {
      console.error(error);
    });
  }

  obtenerListaCanciones() {
    // Hacer una consulta cada vez que se detectan nuevos datos en la BD
    this.firestoreService.consultar("canciones").subscribe((datosRecibidos) => {
      // Limpiar el array para que no se dupliquen los datos anteriores
      this.arrayColeccionCanciones = [];
      // Recorrer todos los datos recibidos de la BD
      datosRecibidos.forEach((datosCancion) => {
        // Cada elemento de la BD se almacena en el array que se muestra en pantalla
        this.arrayColeccionCanciones.push({
          id: datosCancion.payload.doc.id,
          cancion: datosCancion.payload.doc.data()
        })
      });
    });
  }

  selecCancion(idCancion:string, cancionSelec:Cancion) {
    this.cancionEditando = cancionSelec;
    this.idCancionSelec = idCancion;

  }


}
