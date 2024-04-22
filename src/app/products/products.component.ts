import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {log} from "util";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
   public products : Array<Product> =[];
  public keyword : String="";
  constructor(private productService : ProductService) {
  }
  ngOnInit(){
  this.getProducts();
  }
  getProducts(){

    this.productService.getProducts()
      .subscribe({
        next : data =>
        {this.products = data},
        error : err => {
          console.log(err);
        }
      })


  }

  handleCheckProduct(product : Product) {

    this.productService.checkProduct(product)
      .subscribe({

     next:updateProduct =>{
        product.checked = !product.checked;
        //this.getProducts();
      }
    })



  }

  handelDelete(product : Product) {
    if(confirm("are u sure"))
    this.productService.deleteProduct(product)
      .subscribe({
        next : value =>{
         // this.getProducts();
       this.products =   this.products.filter(p=>p.id!= product.id);
    },
        error: err => {
          console.log('Error deleting product:', err);
        }
      })

  }

  searchProduct() {

  }
}
