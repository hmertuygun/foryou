import {
  Component,
  OnInit
} from '@angular/core';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera/ngx';
import {
  ActionSheetController
} from '@ionic/angular';
import {
  File
} from '@ionic-native/file/ngx';
import {
  Crop
} from '@ionic-native/crop/ngx';
import {
  Router
} from '@angular/router';
import {
  HttpClient
} from '@angular/common/http';
import {
  Storage
} from '@ionic/storage';


@Component({
  selector: 'app-photopicker',
  templateUrl: './photopicker.page.html',
  styleUrls: ['./photopicker.page.scss'],
})
export class PhotopickerPage implements OnInit {

  croppedImagepath = "";
  isLoading = false;
  isLoaded = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  base64Image: string;

  constructor(
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    private file: File,
    private http: HttpClient, private router: Router, private storage: Storage
  ) {}


  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.isLoading = true;
      var copyPath = imageData;
      var splitPath = copyPath.split('/');
      var imageName = splitPath[splitPath.length - 1];
      var filePath = imageData.split(imageName)[0];
      this.file.readAsDataURL(filePath, imageName).then(base64 => {
        console.log(base64)
        this.croppedImagepath = base64;
        this.isLoading = false;
        this.isLoaded = true;
      }, error => {
        alert('Error in showing image' + error);
        this.isLoading = false;
      });
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  save() {
    this.storage.get('id').then((val) => {

      this.http.post("http://localhost:3000/addphoto", {
          id: val,
          data: this.croppedImagepath
        }, {
          responseType: 'text'
        })
        .subscribe(data => {
          if (data) {
            this.router.navigate(['/feed'])
          }

        }, error => {
          console.log(error.message);
        });
    });
  }


  ngOnInit() {}



}