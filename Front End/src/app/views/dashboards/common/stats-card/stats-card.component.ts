import { Component, OnInit, } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Project } from '../../../../exportclasses';


@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  projects: any;
  project: Project;
  otherprojects: any;
  tasks: any;
  task: any;
  name: String;
  description: String;
  startdate: String;
  enddate: String;
  public status: boolean;
  public presentage: Array<any> = [];
  public projectcount: String;
  pendingcount: String;
  totalcount: String;
  userid: Object;
  checktoken: any;
  headers: any;

  constructor(public http: HttpClient) {
    this.checktoken = localStorage.getItem("token");
    this.headers = new HttpHeaders({ 'Authorization': this.checktoken, 'Content-Type': 'application/json; charset=utf-8' });

  }

  ngOnInit() {
    // load all projects at Start of the page
    this.getprojects();

  }

  // get all projects according to userID
  getprojects() {

    this.http.get('http://localhost:3000/project/other/' + localStorage.getItem("userID"), { headers: this.headers })
      .subscribe((data) => {
        this.otherprojects = data;

        // get progress of each of the projects for progress bar
        for (var i = 0; i < this.otherprojects.length; i++) {
          this.getprogress(this.otherprojects[i].projectID, i);
        }
        this.status = true;

      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )
  }

  // get project progress method
  getprogress(pID: String, i: any) {

    this.http.get('http://localhost:3000/tasks/progres/' + pID, { headers: this.headers })
      .subscribe((data) => {
        this.tasks = data;
        if (this.tasks.totalcount == 0 || this.tasks.pendingcount == 0) {
          this.presentage[i] = 0;
        }
        else {
          // Math.round() use to remove decimals from values
          this.presentage[i] = Math.round(((this.tasks.totalcount - this.tasks.pendingcount) / this.tasks.totalcount) * 100);
          console.log(this.presentage[i]);

        }

      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )


  }

  // new project create method
  createproject() {

    if (this.name == "" || this.name == null) {
      swal({
        title: "Error !",
        text: ("Please insert Project Name"),
        type: "error"
      })
    }
    else {
      if (this.description == "" || this.description == null) {
        swal({
          title: "Error !",
          text: ("Please insert Description"),
          type: "error"
        })
      }
      else {
        if (this.startdate == "" || this.startdate == null) {
          swal({
            title: "Error !",
            text: ("Please insert Start Date"),
            type: "error"
          })
        }
        else {
          if (this.enddate == "" || this.enddate == null) {
            swal({
              title: "Error !",
              text: ("Please insert End Date"),
              type: "error"
            })
          }
          else {
            const newProject = {
              name: this.name,
              description: this.description,
              startdate: this.startdate,
              enddate: this.enddate,
              userid: localStorage.getItem("userID")
            }
            console.log(JSON.stringify(newProject));
            this.http.post('http://localhost:3000/project/',JSON.stringify(newProject), { headers: this.headers })
              .subscribe((data) => {
                  this.getprojects();
                console.log(data)
              },
                (err) => swal({
                  title: "Error !",
                  text: (JSON.parse(err._body).message),
                  type: "error"
                })
              )
          }
        }
      }
    }

  }

}
