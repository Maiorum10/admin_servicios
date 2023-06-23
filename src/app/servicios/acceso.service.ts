import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs';
import { map } from 'rxjs';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  usuarioId:string='0';
  nombreSesion: any;
  apellidoSesion:any;
  cedulaSesion:string='0';
  claveSesion:string='0';
  rolSesion:string;
  cargoSesion:any;
  departamentoSesion:any;
  id_departamento:any;
  turnosSesion:any;
  subscription:any=undefined;

  //server : string='http://localhost:1023/api/api_turnos/crud.php';
  server : string= environment.URL + 'api_servicios/admin_servicios.php';
  constructor(public http:HttpClient) { }

  private refresh=new Subject<void>();

  get Refreshrequired(){
    return this.refresh;
  }

  postData(body){
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset=UTF-8'
    });
    let options={
      headers:headers
    }
    return this.http.post(this.server, JSON.stringify(body), options);
  }
  getData(){
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset=UTF-8'
    });
    let options={
      headers:headers
    }
    return this.http.get(this.server,options);
  }

}
