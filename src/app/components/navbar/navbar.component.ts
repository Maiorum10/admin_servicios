import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/acceso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  nombre:any;
  apellido:any;
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router,
    private servicio:AccesoService) {
    this.location = location;
  }

  ngOnInit() {
    this.nombre=this.servicio.nombreSesion;
    this.apellido=this.servicio.apellidoSesion;
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    if(this.servicio.claveSesion=='123'){
      this.router.navigateByUrl("user-profile")
      Swal.fire('Actualice su clave','','warning');
    }
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  logout(){
    window.location.reload();
  }

}
