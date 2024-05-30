import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { IProductRequest, IProductResponse } from '../../interface/product/product.interface';
import { Observable } from 'rxjs';
import { CollectionReference, Firestore, addDoc, collectionData, deleteDoc, doc, docData, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getOne(id: number) {
    throw new Error('Method not implemented.');
  }

  // private url = environment.BACKEND_URL;
  // private api = { products: `${this.url}/products`};
  public productCollection!: CollectionReference<DocumentData>;

  constructor(
    public http: HttpClient,
    private afs: Firestore
  ) { 
    this.productCollection = collection(this.afs, 'products');
  }


  getAllFirebase() {
    return collectionData(this.productCollection, { idField: 'id' });
  }

  getAllByCategoryFirebase(name: string) {
    const productDocumentReference = query(collection(this.afs, 'products'), where('category.path', '==', name));
    return collectionData(productDocumentReference, { idField: 'id' });
  }
  getOneFirebase(id: string) {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return docData(productDocumentReference, { idField: 'id' });
  }

  createFirebase(dproduct: IProductRequest) {
    return addDoc(this.productCollection, dproduct);
  }

  updateFirebase(product: IProductRequest, id: string) {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return updateDoc(productDocumentReference, { ...product });
  }

  deleteFirebase(id: string) {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return deleteDoc(productDocumentReference);
  }
}
