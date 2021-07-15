import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Form } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { from, Subject } from "rxjs";

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

    var cuerpoMensaje = `<i>~~~ Correo enviado desde la página web de CosmoX: ~~~</i> <br/><br/>
              Nombre : <b>${form.nombre}</b>  <br/>
              Correo : <b>${form.correo}</b>  <br/>
              Telefono: <b>${form.telefono}</b><br/>
              Mensaje: <b>${form.mensaje} </b> <br/><br/>
              <i>~~~ Fin del mensaje ~~~</i>`;

    console.log(cuerpoMensaje);
    

    let formData = new FormData();
    formData.append('ToEmail', 'admin@cosmox.mx');
    formData.append('Subject', 'Contacto desde la pagina web');
    // formData.append('Body', 'Nombre: ' + form.nombre +  ', Correo: ' + form.correo +  ', Telefono: ' + form.telefono + ',  Mensaje: ' + form.mensaje);
    formData.append('Body', cuerpoMensaje); 
    
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