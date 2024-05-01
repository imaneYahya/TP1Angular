import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {log} from "util";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
   public products : Array<Product> =[];
  public keyword : string="";
  totalPages: number =0 ;
  pageSize: number=3;
  currentPage : number=1;



  constructor(private productService : ProductService,private router:Router, public appStat : AppStateService) {
  }
  ngOnInit(){
  this.getProducts();
  }
  getProducts(){

    this.productService.getProducts(this.currentPage, this.pageSize)
      .subscribe({
        next : (resp) =>
        {
          this.products = resp.body as Product[];
          let totalProducts : number=parseInt(resp.headers.get('x-total-count')!);
          if (Number.isNaN(totalProducts)) {
            console.log('Invalid totalProducts value:', resp.headers.get('x-total-count'));
            return; // Arrêter le traitement ou gérer l'erreur ici
          }
          console.log('x-total-count header value:', resp.headers.get('x-total-count'));
          console.log('Parsed totalProducts:', totalProducts);

          this.totalPages = Math.floor( totalProducts / this.pageSize);
          console.log(this.totalPages);
          if(totalProducts % this.pageSize !=0){
            this.totalPages=this.totalPages+1;
          }
          },
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
       this.appStat.productState.products =   this.appStat.productState.products.filter((p : any)=>p.id!= product.id);
    },
        error: err => {
          console.log('Error deleting product:', err);
        }
      })

  }

  searchProduct() {
    this.productService.searchProducts(
      this.appStat.productState.keyword,
      this.appStat.productState.currentPage,
      this.appStat.productState.pageSize,
      )
      .subscribe({
      next : (resp) => {
        this.appStat.productStateé.products = resp.body as Product[];
      let totaleProducts : number = parseInt(resp.headers.get('x-total-count')!);
      this.appStat.productState.totalPages =
        Math.floor(totaleProducts / this.appStat.productState.pageSize);
      if(totaleProducts % this.appStat.productState.pageSize !=0 ){
        this.totalPages = this.totalPages+1;
      }
      },
        error :err => {
        console.log(err);
        }
    })

  }

  handleGotoPage(page : number) {
    this.appStat.productState.currentPage = page;
    this.getProducts();

  }

  handleEdit(product : Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)

  }
}
