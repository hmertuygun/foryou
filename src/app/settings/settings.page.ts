import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private http: HttpClient, private router: Router, private storage: Storage) { }
  logout(){
    console.log(2)
    this.storage.get('id').then((val) => {
    
    this.http.post("http://localhost:3000/logout", {email: val}, {responseType: 'text'})
    .subscribe(data => {
        this.router.navigate(['/home'])
     }, error => {
      console.log(error.message);
    });
    });
    
  
  }
  ngOnInit() {
    this.storage.get('id').then((val) => {
      
      this.http.post("http://localhost:3000/settings", {id: val}, {responseType: 'text'})
      .subscribe(data => {
        if(data){
          console.log(data)
        }

       }, error => {
        console.log(error.message);
      });
    });
  }

}
