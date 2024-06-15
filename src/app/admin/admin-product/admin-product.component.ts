import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interface/category/category.interface';
import { IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { ImageService } from 'src/app/shared/services/image/image.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent {

  public adminCategories: Array<ICategoryResponse> = [];
  public adminProduct: Array<IProductResponse> = [];

  public productForm !: FormGroup;

  public editStatus = false;

  public uploadPercent!: number;
  
  public isUploaded = false;

  private currentProductId!: number | string;
  public currentCategoryId!: number | string;

  public deleteIndex !: string;


  constructor(
    private fb: FormBuilder,
    private productServise: ProductService,
    private categoryServise: CategoryService,
    private ImageService: ImageService

  ){}

  ngOnInit():void{
    this.innitProductForm();
    this.loadCategories();
    this.loadProducts();
  }
  loadCategories(): void{
    this.categoryServise.getAllFirebase().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
      this.productForm.patchValue({
        category: this.adminCategories[0].id
      });
    });
  }

  innitProductForm(): void{
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path:[null, Validators.required],
      description: [null, Validators.required],
      imagePath: [null, Validators.required], 
      price: [null, Validators.required],
      matrix: [null, Validators.required],
      display: [null, Validators.required],
      memory: [null, Validators.required],
      bluetooth: [null, Validators.required],
      chargingMethod: [null, Validators.required],
      material: [null, Validators.required],
      produced: [null, Validators.required],
      count:[1]
    })
  }

  loadProducts(): void{
    this.productServise.getAllFirebase().subscribe(data => {
      this.adminProduct = data as IProductResponse[];
    });
  }

  addProduct():void{
    if(this.editStatus){
      this.productServise.updateFirebase(this.productForm.value, this.currentProductId as string).then(() => {
        this.productForm.value.count = 1;
        this.loadProducts();
        
      })
    }else{
       this.productServise.createFirebase(this.productForm.value).then(()=>{
        this.loadProducts();
      })
    }
    this.editStatus = false;
    this.productForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
   
    
  }

  editProduct(product: IProductResponse):void{
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      description: product.description,
      imagePath: product.imagePath,
      price: product.price,
      matrix: product.matrix,
      display:product.display,
      memory: product.memory,
      bluetooth: product.bluetooth,
      chargingMethod: product.chargingMethod,
      material: product.material,
      produced: product.produced
    });
    this.editStatus = true;
    this.currentProductId = product.id as number; //
    this.isUploaded = true;
  }

  deleteProduct(product: IProductResponse):void{
    this.deleteIndex = product.id as unknown as string;
  }
  confirmDelete():void{
    if (this.deleteIndex !== undefined) {
      this.productServise.deleteFirebase(this.deleteIndex).then(() => {
        this.loadProducts();
      })
    }
  }
  upload(event: any):void{
    const file = event.target.files[0];
    this.ImageService.uploadFile("images",file.name,file).then(data=>{
      this.productForm.patchValue({
        imagePath: data
      });
      this.isUploaded = true;
    })
    .catch(err=>{
      console.log(err);
      
    })
  }

  deleteImage(): void{
    this.ImageService.deleteUploadFile(this.valueByControle('imagePath')).then(()=> {
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.productForm.patchValue({
        imagePath : null
      })
    }).catch(err=>{
      console.log(err);
      
    })
  }
  
  valueByControle(control: string): string {
    return this.productForm.get(control)?.value;
  }
}
