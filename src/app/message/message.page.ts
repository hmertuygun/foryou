import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  HttpClient
} from '@angular/common/http';
import {
  Storage
} from '@ionic/storage';
import {
  ToastController
} from '@ionic/angular';
import {
  Socket
} from 'ngx-socket-io';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  toId: string;
  myId: any;
  name: any;
  data: any
  text: any
  message = '';
  currentUser = '';
  messages: {
    text: string;reciever: string;sender: string;date: Date;
  } [];
  room: unknown;
  constructor(private socket: Socket, private toastCtrl: ToastController, public http: HttpClient, private storage: Storage, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.toId = this.router.getCurrentNavigation().extras.state.user;
        this.name = this.router.getCurrentNavigation().extras.state.name;
      }
    });



  }

  ngOnInit() {
    this.socket.emit('set-name', name);
    this.messages = []
    this.storage.get('id').then(val => {
      this.myId = val
      this.http.post("http://localhost:3000/recieve", {
          to: this.toId,
          from: this.myId
        }, {
          responseType: 'text'
        })
        .subscribe(data => {
          JSON.parse(data).forEach(element => {
            this.messages.push(element)
          });
        }, error => {
          console.log(error.message);
        });

    })
    this.socket.connect();

    this.currentUser = this.myId;

    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
    this.socket.fromEvent('room').subscribe(data => {
      this.room = data
      console.log(this.room)
    });
    this.socket.fromEvent('message').subscribe(data => {
      let tt = {
        text: data['text'],
        reciever: data['reciever'],
        sender: data['sender'],
        date: data['date']
      }

      this.messages.push(tt)
    });
  }
  sendMessage() {
    this.socket.emit('send-message', {
      text: this.message,
      reciever: this.toId,
      sender: this.myId,
      date: new Date()
    });
    this.message = '';
    /*this.messages.push({
      text: this.message,
      reciever: this.toId,
      sender: this.myId,
      date: new Date()
    })*/
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
  }
}