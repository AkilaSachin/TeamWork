import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @ViewChild('sidenav') sidenav: ElementRef;

  public username:any;
  public title:String;
  clicked: boolean;

  constructor() {
    
    this.clicked = this.clicked === undefined ? false : true;
  }

  ngOnInit() {
    this.username= localStorage.getItem("name");
  }

  setClicked(val: boolean): void {
    this.clicked = val;
  }

  usersignout(){
    localStorage.clear();
    window.location.reload();
  }

}
