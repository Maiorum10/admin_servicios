import { AccesoService } from 'src/app/servicios/acceso.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/icons', title: 'Servicios',  icon:'ni-building text-blue', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  departamento:any;
  nombre:any;
  apellido:any;
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit() {

    this.departamento=this.servicio.departamentoSesion;
    this.nombre=this.servicio.nombreSesion;
    this.apellido=this.servicio.apellidoSesion;
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout(){
    window.location.reload();
  }
}
