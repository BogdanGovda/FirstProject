import { Injectable } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public uploadPercent = 0;

  constructor(
    private storage: Storage
  ) { }
  
  async uploadFile(folder: string, name: string, file: File | null): Promise<string>{
    const path = `${folder}/${name}`;
    let url = "";
    if(file){
      try{
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef,  file);
        percentage(task).subscribe(data =>{
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch(e: any){
        console.error(e);
      }
    }else{
      console.log("wrong format");
      
    }
    return Promise.resolve(url);
  }

  async deleteUploadFile(imagePath: string): Promise<void>{
    const task = ref(this.storage, imagePath);
    return deleteObject(task);
      
    
  }
  valueByControl(arg0: string): string | undefined {
    throw new Error('Method not implemented.');
  }

}
