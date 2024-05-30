import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interface/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { ImageService } from 'src/app/shared/services/image/image.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  public adminCategory: Array<ICategoryResponse> = [];

  public categoryForm !: FormGroup;

  public editStatus = false;

  public uploadPercent!: number;
  
  public isUploaded = false;

  public currentCategoryId!: number | string;
  public deleteIndex !: string;

  constructor(
    private fb: FormBuilder,
    private categoryServise: CategoryService,
    private ImageService: ImageService,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.innitCategoryForm();
    this.loadCategories();
  }

  innitCategoryForm(): void{
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path:[null, Validators.required],
      imagePath: [null, Validators.required]
    })
  }

    loadCategories(): void{
      this.categoryServise.getAllFirebase().subscribe(data => {
        this.adminCategory = data as ICategoryResponse[];
      })

    }
  addCategory():void{
    if(this.editStatus){
      this.categoryServise.updateFirebase(this.categoryForm.value, this.currentCategoryId as string).then(() => {
        this.loadCategories();

      })
    }else{
      this.categoryServise.createFirebase(this.categoryForm.value).then(() => {
        this.loadCategories();
      })
    }
    this.editStatus = false;
    this.categoryForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
    
 
  }
  editCategory(category: ICategoryResponse):void{
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    this.editStatus = true;
    this.currentCategoryId = category.id;
    this.isUploaded = true;
  }
  
  deleteCategory(category: ICategoryResponse):void{
    this.deleteIndex = category.id as unknown as string;
  }

  confirmDelete(): void {
    if (this.deleteIndex !== undefined) {
      this.categoryServise.deleteFirebase(this.deleteIndex).then(() => {
        this.loadCategories();
       
      })
    }
  }

  upload(event: any):void{
    const file = event.target.files[0];
    this.ImageService.uploadFile("images",file.name,file).then(data=>{
      this.categoryForm.patchValue({
        imagePath: data
      });
      this.isUploaded = true;
    })
    .catch(err=>{
      console.log(err);
      
    })
  }

 
  deleteImage(): void{
    const task = ref(this.storage, this.valueByControle('imagePath'));
    deleteObject(task).then(()=>{
      
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.patchValue({
        imagePath : null
      })
      
    })
  }

  valueByControle(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
}
