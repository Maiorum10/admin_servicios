import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { AccesoService } from 'src/app/servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, timer } from 'rxjs';


// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  focus;
  focus1;
  focus2;
  usuarios:any;
  id_usuario:any='0';
  reverso:any;
  txt:any='';
  departamento:any;
  hoy:any;
  hora:any;
  mensajes:any;
  mensaje:any;
  buscador:any='';
  nombre:any;
  apellido:any;

  constructor(private servicio: AccesoService,
    private router: Router) {}

  ngOnInit() {
    if(this.servicio.usuarioId=='0'){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login");
    }else{
      this.departamento=this.servicio.departamentoSesion;
      this.observableTimer();
      if(this.servicio.claveSesion=='123'){
        this.router.navigateByUrl("user-profile")
        Swal.fire('Actualice su clave','','warning');
      }
    }

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
  }

  pausar(){
    if(this.servicio.subscription!=undefined){
        this.servicio.subscription.unsubscribe();
        this.servicio.subscription=undefined;
    }
  }

  observableTimer() {
    const source = timer(1000, 5000);
    this.servicio.subscription = source.subscribe(val => {
      console.log(val, '-');
      if(this.id_usuario=='0'){
        this.consultarUsuarios();
      }else{
        this.cargarTabla();
        this.consultarUsuarios();
      }
    });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  fechajs(){
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    const currentHour =  this.addZero(currentDate.getHours());
    const currentMinutes = this.addZero(currentDate.getMinutes());

    this.hoy = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    this.hora = currentHour +':'+ currentMinutes;
    console.log(this.hoy +' '+ this.hora);
  }

  consultarUsuarios(){
    let body={
      'accion': 'consultar_usuarios',
      'id_empleado': this.servicio.usuarioId
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.usuarios=res.datos;
        }else{

        }
      });
    });
  }

  buscadorUsuarios(){
    if(this.buscador!=''){
      this.pausar();
      let body={
        'accion': 'buscador_usuarios',
        'id_empleado': this.servicio.usuarioId,
        'nombre': '%'+this.buscador+'%',
        'cedula': '%'+this.buscador+'%',
        'apellido': '%'+this.buscador+'%'
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.usuarios=res.datos;
          }else{

          }
        });
      });
    }else{
      if(this.servicio.subscription==undefined){
        this.observableTimer();
    }
    }
  }

  removeId(tr){
    this.id_usuario=tr.id_usuario;
    this.nombre=tr.nombre;
    this.apellido=tr.apellido;
    this.cargarTabla();
  }

  cargarTabla(){
    let body={
      'accion': 'consultar_mensajes',
      'id_empleado': this.servicio.usuarioId,
      'id_usuario': this.id_usuario
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.mensajes=res.datos;
          this.reverso=this.mensajes.reverse();
        }else{
          this.reverso=[];
        }
      });
    });
  }

  guardarMensaje(){
    this.fechajs();
    if(this.txt==''){
      Swal.fire('Error','Ingrese un mensaje','error');
    }else if(this.servicio.usuarioId=='0'){
      Swal.fire('Error','Seleccione un departamento antes de enviar mensajes','error');
    }else{
      let body={
        'accion':'guardar_mensaje',
        'id_empleado': this.servicio.usuarioId,
        'id_usuario': this.id_usuario,
        'remitente':'administrador',
        'mensaje':this.txt,
        'fecha': this.hoy,
        'hora': this.hora
      }
      console.log(body);
        return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          this.mensaje=res;
          if(res.estado){
          this.cargarTabla();
          this.txt='';
          }else{
              Swal.fire('Error','Error','error');
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
