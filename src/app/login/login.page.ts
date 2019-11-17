import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  message: string;
  constructor(private geolocation: Geolocation, private http: HttpClient, private router: Router, private storage: Storage) { }

  login(form) {
    this.loginUser(form.value)
  }
  loginUser(form) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    this.geolocation.getCurrentPosition().then((resp) => {
     
      form.long = resp.coords.longitude
      form.lat = resp.coords.latitude
    this.http.post("http://localhost:3000/login", form, {responseType: 'text'})
      .subscribe(data => {
        if(data.charAt(0) == 'k'){
          
          this.storage.set('id', data);
          this.router.navigate(['/feed'])
        }else{
          this.message = "Your e-mail or password is wrong"
        }
        console.log(data)
       }, error => {
        console.log(error.message);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    }
  
  ngOnInit() {
    
  }

}
