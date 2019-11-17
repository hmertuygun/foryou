import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  message: string;

  constructor(private geolocation: Geolocation, private http: HttpClient, private router: Router, private storage: Storage) { }

  register(form) {
    this.createUser(form.value)
  }
  createUser(form) {
    if(form.password != form.confirm){
      this.message = "Passwords do not match"
    }else{
      var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    this.geolocation.getCurrentPosition().then((resp) => {
     
      form.long = resp.coords.longitude
      form.lat = resp.coords.latitude
    this.http.post("http://localhost:3000/register", form, {responseType: 'text'})
      .subscribe(data => {
        console.log(data)
        if(data){
          this.storage.set('id', data);
          this.router.navigate(['/questions'])
        }else{
          this.message = "There is an account on that e-mail"
        }

       }, error => {
        console.log(error.message);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    }
    
    }
  
  ngOnInit() {
  }

}
