import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {
  que: any;
  ch: string[];
  rangeValue: number;
  i: 0;
  questions: { q: string; ch: string[]; }[];
  user: { a: string; as: string[]; }[]

  constructor(private http: HttpClient, private router: Router, private storage: Storage) {
    this.questions = [
      {q: "Age", ch:["age"]},
      {q: "müzik", ch: ["Pop", "Indie Rock", "Electro", "Country Music", "Techno", "Rhythm and Blues",
      "Dubstep", "Jazz", "Rock Music", "Electronic Dance Music"]},
      {q: "Loving Years", ch: ["50's","60's", "70's", "3000's", "90's", "00's"]},
      {q: "Preferred Gender", ch: ["Male", "Female"]},
      {q: "Do you use drugs?", ch: ["Yes", "No"]},
      {q: "Education", ch: ["College", "Bachelor's ", "Master's", "Doctoral"]},
      {q: "Relationship", ch: ["Casual Sex", "ONS", "Friends With Benefits", "Just Friends"]},
      {q: "Range in kilometers", ch:["range"]},
      {q: "Your gender", ch:["Male", "Female"]},
    ]
    this.i = 0
    this.user=[]
   }
   go(a, as){
    this.user.push({a, as})
    this.i++;
    if(this.i == 9){
      this.storage.get('id').then((val) => {
      
      this.http.post("http://localhost:3000/initialize", {id: val, data: this.user}, {responseType: 'text'})
      .subscribe(data => {
        if(data){
          this.router.navigate(['/feed'])
        }

       }, error => {
        console.log(error.message);
      });
    });
    }
    if(this.i <9){
    this.que = this.questions[this.i].q
      this.ch = this.questions[this.i].ch
      console.log(this.i)
    }
      
      
      
  }
  age(form) {
    this.go(0,form.value.age)
  }
  range(form) {
    console.log(form.value)
    this.go(7,this.rangeValue)
  }
  ngOnInit() {
    this.que = this.questions[this.i].q
      this.ch = this.questions[this.i].ch
  }
  save(){
console.log(this.user)
  }

}
