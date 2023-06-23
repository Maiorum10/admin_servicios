import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccesoService } from 'src/app/servicios/acceso.service';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  departamento:any;
  turnos:any;
  nuevo:any='';
  hoy:any;
  servicios:any='Nuevo servicio:';
  id_empleado:any;
  empleados:any;
  dropdown2:any='Seleccionar:';
  nombre_e:any='';
  apellido_e:any='';
  cargo_e:any='';
  tabla:any;
  id_servicio:any='0';
  public copy: string;
  constructor(private router: Router, private servicio:AccesoService) { }

  ngOnInit() {
    if(this.servicio.usuarioId=='0'){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login");
    }else if(this.servicio.rolSesion!='administrador'){
      Swal.fire('Pestaña administrativa');
      this.router.navigateByUrl("dashboard");
      this.pausar();
    }else{
      this.fechajs();
      this.departamento=this.servicio.departamentoSesion;
      this.turnos=this.servicio.turnosSesion;
      this.pausar();
      this.consultarEmpleados();
      this.consultarServicios();
      if(this.servicio.claveSesion=='123'){
        this.router.navigateByUrl("user-profile")
        Swal.fire('Actualice su clave','','warning');
      }
    }
  }

  pausar(){
    if(this.servicio.subscription!=undefined){
        this.servicio.subscription.unsubscribe();
        this.servicio.subscription=undefined;
    }
  }

  fechajs(){
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();

    this.hoy = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    console.log(this.hoy);
  }

  guardar(){
    if(this.dropdown2=='Seleccionar:'){
      Swal.fire('Error','Seleccione un encargado','error');
    }else if(this.nuevo==''){
      Swal.fire('Error','No se puede guardar servicios en blanco','error');
    }else{
      let body={
        'accion':'guardar_servicio',
        'nombre': this.nuevo,
        'id_empleado': this.id_empleado
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          let usuario=res;
          if(res.estado){
              Swal.fire('Servicio creado');
              this.nuevo='';
              this.dropdown2='Seleccionar:';
              this.consultarServicios();
          }else{
              Swal.fire('Error','','error');
          }
        }, (err)=>{
          //Error
          console.log(err);
          Swal.fire('Error','Error de conexión','error');
        });
      });
    }
  }

  consultarEmpleados(){
      let body={
        'accion':'consultar_empleados',
        'id_departamento': this.servicio.id_departamento
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.empleados=res.datos;
          }else{
              Swal.fire('No existen empleados en el departamento','','error');
          }
        }, (err)=>{
          //Error
          console.log(err);
          Swal.fire('Error','Error de conexión','error');
        });
      });
  }

  consultarEmpleado(){
    let body={
      'accion':'consultar_emp',
      'id_empleado': this.id_empleado
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let empleado=res.datos;
          this.nombre_e=empleado[0].nombre;
          this.apellido_e=empleado[0].apellido;
          this.cargo_e=empleado[0].cargo;
          this.dropdown2=this.nombre_e +' '+ this.apellido_e +' - '+ this.cargo_e;
        }else{
            Swal.fire('No existen empleados en el departamento','','error');
        }
      }, (err)=>{
        //Error
        console.log(err);
        Swal.fire('Error','Error de conexión','error');
      });
    });
}

consultarServicios(){
  let body={
    'accion': 'consultar_servicios',
    'id_departamento': this.servicio.id_departamento
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        this.tabla=res.datos;
      }else{
        Swal.fire('No existen servicios en este departamento','','error');
      }
    });
  });
}

removeIdE(tr){
  this.id_empleado=tr.id_empleado;
  this.nombre_e=tr.nombre;
  this.apellido_e=tr.apellido;
  this.cargo_e=tr.cargo;
  this.dropdown2=this.nombre_e +' '+ this.apellido_e +' - '+ this.cargo_e;
}

removeId(tr){
  this.id_servicio=tr.id_servicio;
  this.nuevo=tr.nombre;
  this.id_empleado=tr.id_empleado;
  this.consultarEmpleado();
  this.servicios='Actualizar servicio:';
}

actualizarServicio(){
  if(this.dropdown2=='Seleccionar:'){
    Swal.fire('Error','Seleccione un encargado','error');
  }else if(this.nuevo==''){
    Swal.fire('Error','No se puede guardar servicios en blanco','error');
  }else{
    let body={
      'accion':'actualizar_servicio',
      'nombre': this.nuevo,
      'id_empleado': this.id_empleado,
      'id_servicio':this.id_servicio
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          Swal.fire('Servicio actualizado');
          this.nuevo='';
          this.dropdown2='Seleccionar:';
          this.servicios='Nuevo servicio:';
          this.consultarServicios();
          this.id_servicio='0';
        }else{
          Swal.fire('Error','','error');
        }
      }, (err)=>{
        //Error
        console.log(err);
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }
}

si(){
  if(this.id_servicio=='0'){
  this.guardar();
  }else{
  this.actualizarServicio();
  }
}

}
