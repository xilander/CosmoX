import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EnviarCorreoService } from '../services/enviarcorreo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})

export class ContactoComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  botonInactivo: boolean =  false;

  private enviadoRef!: Subscription;

  constructor(private fb: FormBuilder, private enviarCorreoService: EnviarCorreoService) { 
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.enviadoRef.unsubscribe;
  }

  ngOnInit(): void {
  }


  get nombreNoValido(){
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched
  }

  get correoNoValido(){
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched
  }

  get telefonoNoValido(){
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched
  }

  get mensajeNoValido(){
    return this.form.get('mensaje')?.invalid && this.form.get('mensaje')?.touched
  }

  crearFormulario(){
    this.form = this.fb.group({
      nombre:  ['', [Validators.required, Validators.minLength(3)]],
      correo:  ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      telefono:['', [Validators.required, Validators.pattern("[0-9]{10}")]],
      mensaje: ['', [Validators.required]]
    })
  }

  guardar() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    
    this.botonInactivo = true;
    
    this.enviarCorreoService.enviaContacto( this.form.value );

    this.enviadoRef = this.enviarCorreoService.enviado$.subscribe( ()=>{
      console.log(this.enviarCorreoService.enviado$);
      this.form.reset();
      this.botonInactivo= false;  
    } )
  }
}
