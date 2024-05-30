import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interface/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {

  public discountForm !: FormGroup;
  public adminDiscount : IDiscountResponse[] = [];
  public description !: string;
  public editStatus = false;
  public editId !: number;
  public isUploaded = false;


  public uploadPercent!: number;

  public currentDiscountId!: number | string;
 

  public deleteIndex !: string;

  constructor(
    private discountService: DiscountService,
    private fb:FormBuilder,
    private storage: Storage
   
  ){}

  ngOnInit(): void {
    this.innitCategoryForm();
    this.loadDiscounts();
    
  }

  innitCategoryForm(): void{
    this.discountForm = this.fb.group({
      description: [null, Validators.required],
      imagePath: [null, Validators.required],
      name: [null, Validators.required]
    })
  }


 

  loadDiscounts(): void{
    this.discountService.getAllFirebase().subscribe(data => {
      this.adminDiscount = data as IDiscountResponse[];
    })
  }

  addDiscount():void{
    if(this.editStatus){
      this.discountService.updateFirebase(this.discountForm.value, this.currentDiscountId as string).then(() => {
        this.loadDiscounts();
      })
    }else{
      this.editStatus = false;
      this.discountService.createFirebase(this.discountForm.value).then(() => {
        this.loadDiscounts();
      })
    }
    this.discountForm.reset();
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editDiscount(discount:IDiscountResponse):void{
    this.discountForm.patchValue({
      name: discount.name,
      description: discount.description,
      imagePath: discount.imagePath
    });
    this.editStatus = true;
    this.currentDiscountId = discount.id;
    
  }

  deleteDiscount(discount: IDiscountResponse):void{
    this.deleteIndex = discount.id as unknown as string;

  }

  confirmDelete(): void {
    if (this.deleteIndex !== undefined) {
    this.discountService.deleteFirebase(this.deleteIndex).then(() => {
      this.loadDiscounts();
    })

    }
  }

  upload(event: any):void{
    const file = event.target.files[0];
    this.uploadFile("images",file.name,file).then(data=>{
      this.discountForm.patchValue({
        imagePath: data
      });
      this.isUploaded = true;
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
 
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

  valueByControle(control: string): string {
    return this.discountForm.get(control)?.value;
  }

  deleteImage():void{
    const task = ref(this.storage, this.valueByControle('imagePath'));
    deleteObject(task).then(()=>{
      console.log('File deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.discountForm.patchValue({
        imagePath : null
      })
      
    })
  }

}
