import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccesoService } from 'src/app/servicios/acceso.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  usuario: any;
  nombre: string='';
  apellido: string='';
  clave: string='123';
  cedula: string='';

  constructor(private router: Router, private servicio:AccesoService) { }

  ngOnInit() {

  }

  recuperar(){
    if(this.nombre==''){
      Swal.fire('Error','Ingrese el nombre','error');
    }else if(this.apellido==''){
      Swal.fire('Error','Ingrese el apellido','error');
    }else if(this.cedula==''){
      Swal.fire('Error','Ingrese la cédula','error');
    }else{
            let body={
              'accion':'recuperar_clave',
              'cedula': this.cedula,
              'nombre': this.nombre,
              'apellido': this.apellido,
              'clave': this.clave
            }
            return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                this.usuario=res;
                if(res.estado){
                    Swal.fire('Clave reseteada', 'Nueva clave: "123"');
                    this.router.navigateByUrl("login")
                }else{
                    Swal.fire('Clave no recuperada','error');
                }
              }, (err)=>{
                //Error
                console.log(err);
                Swal.fire('Error','Error de conexión','error');
              });
            });
    }
  }

}
