import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { Form } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EnviarCorreoService {

  @Input() form!: Form;

  private enviadoSubject = new Subject<void>();
  public enviado$ = this.enviadoSubject.asObservable();
 
  constructor(private http: HttpClient) { }
  
  private apiURL = environment.apiURL;

  enviaContacto(form: any) {

    let formData = new FormData();
    formData.append('ToEmail', 'admin@cosmox.mx');
    formData.append('Subject', 'Contacto desde la pagina web');
    formData.append('Body', 'Nombre: ' + form.nombre + ', Telefono: ' + form.telefono + ',  Mensaje: ' + form.mensaje);

    fetch(this.apiURL, {
      method: 'POST',
      body: formData,
    })
      .then(resp => this.aviso(resp.status.toString()))
      .then(console.log)
      .catch(error => {
        this.aviso("fail")
        console.log('Error en la aplicación');
        console.log(error);
      });
  }

  aviso(message: string){
    if (message === '200'){
      Swal.fire({
        title: 'Exito',
        text: 'Mensaje enviado!!!',
        icon: 'success'
      })
      this.enviadoSubject.next();
      
    }else{
        Swal.fire({
        title: 'Ooops...',
        text: 'No se pudo enviar el mensaje',
        icon: 'error'
      })
      this.enviadoSubject.next();
    }
  }
}
