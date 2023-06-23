import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccesoService } from 'src/app/servicios/acceso.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  usuario:any;
  nombre:any;
  apellido:any;
  cedula:any;
  cargo:any;
  rol:any;
  departamento:any;
  clave:any='';

  constructor(private router: Router, private servicio:AccesoService) { }

  ngOnInit() {

    if(this.servicio.usuarioId=='0'){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login");
    }else{
      this.pausar();
      this.nombre=this.servicio.nombreSesion;
      this.apellido=this.servicio.apellidoSesion;
      this.cedula=this.servicio.cedulaSesion;
      this.cargo=this.servicio.cargoSesion;
      this.rol=this.servicio.rolSesion
      this.departamento=this.servicio.departamentoSesion;
    }
  }

  pausar(){
    if(this.servicio.subscription!=undefined){
        this.servicio.subscription.unsubscribe();
        this.servicio.subscription=undefined;
    }
  }

  guardar(){
    if(this.clave==''){
      Swal.fire('Error','No se puede guardar una clave en blanco','error');
    }else{
      let body={
        'accion':'actualizar_clave',
        'clave': this.clave,
        'id_empleado': this.servicio.usuarioId
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          this.usuario=res;
          if(res.estado){
              Swal.fire('Clave actualizada');
              this.servicio.claveSesion=this.clave;
              this.router.navigateByUrl("dashboard");
          }else{
              Swal.fire('Clave no actualizada','error');
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
