import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { User } from './exportclasses';
import swal from 'sweetalert2';


@Component({
  selector: 'mdb-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']

})

export class AppComponent implements OnInit {
  values: string[] = ['Tag 1', 'Tag 2', 'Tag 4'];

  specialPage: boolean;
  Status: boolean;
  loginForm: FormGroup;

  users: User[] = [];
  user: User;
  remail: String;
  rpassword: String;
  rname: String;
  lemail: String;
  lpassword: String;

  constructor(
    private router: Router,
    private location: Location,
    public http: HttpClient,
    public fb: FormBuilder
  ) {


    this.loginForm = fb.group({
      defaultFormEmail: ['', Validators.required],
      defaultFormPass: ['', [Validators.required, Validators.minLength(8)]]
    });

    // check localStorage saved data length.If it is below 2 set status is false.
    if (localStorage.length < 2) {

      // this status is false user is not logged in. 
      this.Status = false;
    }
    else {

      // check the token validity
      const tokencheck = {
        token: localStorage.getItem("token")
      }
      console.log(tokencheck);
      const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:3000/user/start/authentication', tokencheck, { headers: headers })
        .subscribe((data) => {
          this.Status = true,
            console.log(data);
        },
          (err) => {
            this.Status = false,
              console.log(err);
          }
        )
    }
  }

  ngOnInit(): void {

  }

  goBack(): void {
    this.location.back();
  }

  // Login method
  UserLogin() {
    console.log(this.lemail == "" || this.lemail == null)
    if (this.lemail == "" || this.lemail == null) {

      swal({
        title: "Error !",
        text: ("Please insert email"),
        type: "error"
      })
    }
    else {

      if (this.lpassword == "" || this.lpassword == null) {
        swal({
          title: "Error !",
          text: ("Please insert password"),
          type: "error"
        })
      }
      else {

        const loginUser = {
          email: this.lemail,
          password: this.lpassword
        }
        console.log(loginUser)
        var data_: any;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

        headers.append('Content-Type', 'application/json');
        this.http.post('http://localhost:3000/user/login', loginUser, { headers: headers })
          .subscribe((data) => {
            data_ = data;
            console.log(data_);
            localStorage.setItem("token", "Bearer " + data_.token);
            localStorage.setItem("userID", data_.userID);
            localStorage.setItem("email", data_.email);
            localStorage.setItem("name", data_.name);
            this.Status = true;
            this.router.navigate(['dashboards']);
          },
            (err) => swal({
              title: "Error !",
              text: (err.error.message),
              type: "error"
            })
          )

      }

    }


  }

  // Register User method
  UserRegister() {

    if (this.rname == "" || this.rname == null) {
      swal({
        title: "Error !",
        text: ("Please insert Username"),
        type: "error"
      })
    }
    else {
      if (this.remail == "" || this.remail == null) {
        swal({
          title: "Error !",
          text: ("Please insert Email"),
          type: "error"
        })
      }
      else {
        if (this.rpassword == "" || this.rpassword == null) {
          swal({
            title: "Error !",
            text: ("Please insert Password"),
            type: "error"
          })
        }
        else {
          const newUser = {
            name: this.rname,
            email: this.remail,
            password: this.rpassword
          }

          const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

          headers.append('Content-Type', 'application/json');
          this.http.post('http://localhost:3000/user/signup', newUser, { headers: headers })
            .subscribe((data) => {
              swal({
                title: "Congradulations",
                text: "You are Registerd.Use Login to Sign In",
                type: "success"
              }), console.log(data)
            },
              (err) => {
                swal({
                  title: "Error !",
                  text: (err.error.message._message),
                  type: "error"
                })
                console.log(err);
              }
            )
        }
      }

    }

  }
}


