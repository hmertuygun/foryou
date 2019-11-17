import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MessagePage } from '../message/message.page';
import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  data: any
  card: boolean;
  card_data = {'para2':String, 'para1':String, 'heading':String, rank:String}
  constructor(public navCtrl: NavController, public modalController: ModalController,private geolocation: Geolocation, private http: HttpClient, private router: Router, private storage: Storage) { }

  detail(id){
    console.log(id)
  }
  look(id){
    this.card=true
    this.data.forEach(element => {
      if(element.id == id){
        this.card_data.para2 = element.years
        this.card_data.heading = element.name
        this.card_data.para1 = element.music
      }
    });
  }
  close(){
    this.card=false
  }
  message(id, name){
    let navigationExtras: NavigationExtras = {
      state: {
        user: id,
        name: name
      }
    };
    this.router.navigate(['message'], navigationExtras);
  }
  ngOnInit(){
    this.card = false
    
    this.storage.get('id').then((val) => {
    let form = {id: val,long:0, lat:0}
    this.geolocation.getCurrentPosition().then((resp) => {
     
      form.long = resp.coords.longitude
      form.lat = resp.coords.latitude
    this.http.post("http://localhost:3000/find", form, {responseType: 'text'})
      .subscribe(data1 => {
        this.data = []
        JSON.parse(data1).forEach(element => {
          element.user.rank = element.rank
          this.data.push(element.user)
        });
       }, error => {
        console.log(error.message);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    });
  }
}
