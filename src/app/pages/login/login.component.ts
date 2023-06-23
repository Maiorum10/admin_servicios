import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService } from 'src/app/servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  usuario: any;
  departamento:any;
  clave: string='';
  cedula: string='';

  constructor(private servicio: AccesoService,
    private router: Router) {}

  ngOnInit() {
    this.pausar();
  }

  ngOnDestroy() {}

  verificar(){
    if(this.cedula==''){
      Swal.fire('Error','Ingrese la cédula','error');
    }else if(this.clave==''){
      Swal.fire('Error','Ingrese la clave','error');
    }else{
      let body={
        'accion': 'login_admin',
        'cedula': this.cedula,
        'clave' : this.clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.usuario=res.datos;
            this.servicio.usuarioId=this.usuario[0].id_empleado;
            this.servicio.cedulaSesion=this.usuario[0].cedula;
            this.servicio.nombreSesion=this.usuario[0].nombre;
            this.servicio.apellidoSesion=this.usuario[0].apellido;
            this.servicio.id_departamento=this.usuario[0].id_departamento;
            this.servicio.rolSesion=this.usuario[0].rol;
            this.servicio.cargoSesion=this.usuario[0].cargo;
            this.servicio.claveSesion=this.clave;
            if(this.servicio.rolSesion=='administrador'){
              this.consultarDepartamento();
            }else{
              Swal.fire('Sistema administrativo','','error');
            }
          }else{
            Swal.fire('Error','Datos incorrectos','error');
          }
        },(err)=>{
          Swal.fire('Error','Error de conexión','error');
          console.log('Error de conexión, login');
        });
      });
    }
  }

  pausar(){
    if(this.servicio.subscription!=undefined){
        this.servicio.subscription.unsubscribe();
        this.servicio.subscription=undefined;
    }

  }

  consultarDepartamento(){
    let body={
      'accion': 'consultar_departamento',
      'id_departamento': this.servicio.id_departamento
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.departamento=res.datos;
          this.servicio.departamentoSesion = this.departamento[0].nombre;
          this.servicio.turnosSesion = this.departamento[0].turnos_diarios;
          Swal.fire('Bienvenido','' +this.servicio.nombreSesion+ '');
          this.router.navigateByUrl("dashboard")
        }else{
          Swal.fire('Error');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }

}
