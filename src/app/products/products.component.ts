import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products : Array<any>=[
    {id : 1, name :  "computer" , price : 40559 , checked : false},
    {id : 2, name :  "appleWatch" , price : 2000 , checked : true},
    {id : 3, name :  "phone" ,  price : 4559 , checked : false},
  ]

  handleCheckProduct(product : any) {
    product.checked = !product.checked;

  }
}
