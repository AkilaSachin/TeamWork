import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public people: any;
  projectID: any;
  public project: any;
  public taskprogress: any;
  public teammembers: any
  public mems: any
  public tasks: any;
  public displaytask: any
  waste: any;
  public taskid: any;
  public name: String;
  public description: String;
  public startdate: String;
  public enddate: String;
  public ctaskid: any;
  public cname: String;
  public cdescription: String;
  public cstartdate: String;
  public cenddate: String;
  public tname: String;
  public tdescription: String;
  public tstartdate: String;
  public tenddate: String;
  public userstatus: String;
  public loading: any;
  public chartType: string = 'doughnut';
  public status: boolean = false;
  public chartData: Array<any> = [];
  checktoken: any;
  headers: any;

  // Donut Chart data
  public chartLabels: Array<any> = ['Completed tasks', 'Pending tasks'];

  public chartColors: Array<any> = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 0,
    backgroundColor: ["#46BFBD", "#F7464A"],
    hoverBackgroundColor: ["#5AD3D1", "#FF5A5E"]
  }];

  public chartOptions: any = {
    maintainAspectRatio: false,
    responsive: true
  };

  public chartClicked(e: any): void {
    this.waste = e;
  }

  public chartHovered(e: any): void {
    this.waste = e;
  }

  constructor(public router: Router, private route: ActivatedRoute, public http: HttpClient) {

    this.checktoken = localStorage.getItem("token");
    this.headers = new HttpHeaders({ 'Authorization': this.checktoken, 'Content-Type': 'application/json; charset=utf-8' });

    // get the project id from the URL
    this.route.fragment.subscribe((fragment: string) => {
      this.projectID = fragment;
      if (this.projectID == null) {
        this.router.navigate(['dashboards']);
      }
      else {
        this.getproject();
        this.getprogress();
        this.getmembers();
        this.gettasks();
        this.getusers();
      }
    })

  }

  ngOnInit() {

  }

  // get project method
  getproject() {
    this.http.get('http://localhost:3000/project/one/' + this.projectID, { headers: this.headers })
      .subscribe((data) => {
        this.project = data;

        this.status = true;
        // set userstatus admin or member according to project details
        if (this.project.userid == localStorage.getItem("userID")) {
          this.userstatus = "Admin";
        }
        else {
          this.userstatus = "Member";
        }
      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )


  }

  // get progress info
  getprogress() {
    this.http.get('http://localhost:3000/tasks/progres/' + this.projectID, { headers: this.headers })
      .subscribe((data) => {
        this.taskprogress = data;

        // assign progress data to char Data
        this.chartData = [(this.taskprogress.totalcount - this.taskprogress.pendingcount), this.taskprogress.pendingcount];

      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )


  }

  // delete the project
  deleteproject() {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Project again',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {

      if (result.value) {
        this.http.delete('http://localhost:3000/project/' + this.projectID, { headers: this.headers })
          .subscribe((data) => {
            swal({
              title: "Deleted",
              text: ("Project Successfully Deleted"),
              type: "success"
            })
            this.router.navigate(['dashboards']);
            this.waste = data;
          },
            (err) => swal({
              title: "Error !",
              text: (err.error.message),
              type: "error"
            })
          )
      }
    })
  }

  //Update the project 
  updateproject() {

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

            swal({
              title: 'Are you sure?',
              text: 'You will not be able to recover this Previous details',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, Update it!',
              cancelButtonText: 'No, keep it'
            }).then((result) => {

              if (result.value) {
                this.http.put('http://localhost:3000/project/' + this.projectID, newProject, { headers: this.headers })
                  .subscribe((data) => {
                    swal({
                      title: "Updated",
                      text: ("Project Successfully Updated"),
                      type: "success"
                    })
                    this.getproject();
                    this.waste = data;
                  },
                    (err) => swal({
                      title: "Error !",
                      text: (err.error.message),
                      type: "error"
                    })
                  )
              }
            })
          }
        }
      }
    }

  }

  // get all project members
  getmembers() {

    this.http.get('http://localhost:3000/project_members/' + this.projectID, { headers: this.headers })
      .subscribe((data) => {
        this.teammembers = data;
        console.log(this.teammembers);
      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )
  }

  // add new project member
  addmem(memID: any) {

    const newmem = {
      projectID: this.projectID,
      memberID: memID,
      role: "member"
    }

    this.http.post('http://localhost:3000/project_members/' + localStorage.getItem("userID"), newmem, { headers: this.headers })
      .subscribe((data) => {
        this.getmembers();
        console.log(data);
        swal({
          title: "Added",
          text: ("Member Successfully Added"),
          type: "success"
        })
      },
        (err) => {
          swal({
            title: "Error !",
            text: (err.error.message),
            type: "error"
          })
          console.log(err);
        }
      )

    console.log(memID);
  }

  // remove projec member
  removemem(memID: any) {

    const s = {
      projectID: this.projectID,
      userID: localStorage.getItem("userID")
    }

    swal({
      title: 'Are you sure?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {

      if (result.value) {
        this.http.post('http://localhost:3000/project_members/delete/' + memID, s, { headers: this.headers })
          .subscribe((data) => {
            swal({
              title: "Done !",
              text: ("Successfully Removed"),
              type: "success"
            })
            console.log(data);
            this.getmembers();
          },
            (err) => swal({
              title: "Error !",
              text: (err.error.message),
              type: "error"
            })
          )
      }
    })

    console.log(memID);
  }

  // get all users
  getusers() {
    this.http.get('http://localhost:3000/user/getusers', { headers: this.headers })
      .subscribe((data) => {
        this.people = data;
      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )


  }

  // get all tasks
  gettasks() {
    this.http.get('http://localhost:3000/tasks/' + this.projectID, { headers: this.headers })
      .subscribe((data) => {
        this.tasks = data;

      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )
  }

  // create new task
  createtask() {

    if (this.cname == "" || this.cname == null) {
      swal({
        title: "Error !",
        text: ("Please insert Task Name"),
        type: "error"
      })
    }
    else {
      if (this.cdescription == "" || this.cdescription == null) {
        swal({
          title: "Error !",
          text: ("Please insert Description"),
          type: "error"
        })
      }
      else {
        if (this.cstartdate == "" || this.cstartdate == null) {
          swal({
            title: "Error !",
            text: ("Please insert Start Date"),
            type: "error"
          })
        }
        else {
          if (this.cenddate == "" || this.cenddate == null) {
            swal({
              title: "Error !",
              text: ("Please insert End Date"),
              type: "error"
            })
          }
          else {

            const newTask = {
              task: this.cname,
              description: this.cdescription,
              startdate: this.cstartdate,
              enddate: this.cenddate,
              projectID: this.projectID
            }
            console.log(newTask);
            this.http.post('http://localhost:3000/tasks/', newTask, { headers: this.headers })
              .subscribe((data) => {
                this.gettasks();
                console.log(data)
                swal({
                  title: "Created",
                  text: ("Task Successfully Created"),
                  type: "success"
                })
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

  // delete task
  deletetask(taskid: any) {

    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Task again',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {

      if (result.value) {
        this.http.delete('http://localhost:3000/tasks/' + taskid, { headers: this.headers })
          .subscribe((data) => {
            swal({
              title: "Deleted",
              text: ("Task Successfully Deleted"),
              type: "success"
            })
            this.gettasks();
            this.waste = data;
          },
            (err) => swal({
              title: "Error !",
              text: (err.error.message),
              type: "error"
            })
          )
      }
    })
  }

  // set task values to task update modal
  settaskvalues(taskid: any) {
    this.http.get('http://localhost:3000/tasks/one/' + taskid, { headers: this.headers })
      .subscribe((data) => {
        this.displaytask = data;
        this.tname = this.displaytask[0].task;
        this.tdescription = this.displaytask[0].description;
        this.tstartdate = this.displaytask[0].startdate;
        this.tenddate = this.displaytask[0].enddate;
        this.taskid = this.displaytask[0]._id;
        console.log(data);
      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )
  }

  // set project values to project update modal
  setprojectvalues() {
    this.http.get('http://localhost:3000/project/one/' + this.projectID, { headers: this.headers })
      .subscribe((data) => {
        this.project = data;
        this.name = this.project.name;
        this.description = this.project.description;
        this.startdate = this.project.startdate;
        this.enddate = this.project.enddate;
      },
        (err) => swal({
          title: "Error !",
          text: (err.error.message),
          type: "error"
        })
      )
  }

  // update task 
  updatetask() {

    if (this.tname == "" || this.tname == null) {
      swal({
        title: "Error !",
        text: ("Please insert Task Name"),
        type: "error"
      })
    }
    else {
      if (this.tdescription == "" || this.tdescription == null) {
        swal({
          title: "Error !",
          text: ("Please insert Description"),
          type: "error"
        })
      }
      else {
        if (this.tstartdate == "" || this.tstartdate == null) {
          swal({
            title: "Error !",
            text: ("Please insert Start Date"),
            type: "error"
          })
        }
        else {
          if (this.tenddate == "" || this.tenddate == null) {
            swal({
              title: "Error !",
              text: ("Please insert End Date"),
              type: "error"
            })
          }
          else {

            const newTask = {
              task: this.tname,
              description: this.tdescription,
              startdate: this.tstartdate,
              enddate: this.tenddate
            }
            console.log("daadas" + newTask);

            swal({
              title: 'Are you sure?',
              text: 'You will not be able to recover this Previous details',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, Update it!',
              cancelButtonText: 'No, keep it'
            }).then((result) => {

              if (result.value) {

                this.http.put('http://localhost:3000/tasks/' + this.taskid, newTask, { headers: this.headers })
                  .subscribe((data) => {
                    swal({
                      title: "Updated",
                      text: ("Project Successfully Updated"),
                      type: "success"
                    })
                    this.gettasks();
                    this.waste = data;
                  },
                    (err) => swal({
                      title: "Error !",
                      text: (err.error.message),
                      type: "error"
                    })
                  )
              }
            })
          }
        }
      }
    }
  }

  // complete a task
  completetask(taskid: any) {

    const complete = {
      completedby: localStorage.getItem("userID"),
      status: "complete"
    }

    swal({
      title: 'Are you sure?',
      text: 'You cannot undo the task status',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Complete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {

      if (result.value) {

        this.http.patch('http://localhost:3000/tasks/complete/' + taskid, complete, { headers: this.headers })
          .subscribe((data) => {
            this.gettasks();
            console.log(data)
            swal({
              title: "Completed",
              text: ("Marked as Complete"),
              type: "success"
            })
          },
            (err) => swal({
              title: "Error !",
              text: (JSON.parse(err._body).message),
              type: "error"
            })
          )
      }
    })


  }

}


