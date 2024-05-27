import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-queue-monitoring',
  templateUrl: './queue-monitoring.component.html',
  styleUrls: ['./queue-monitoring.component.scss']
})
export class QueueMonitoringComponent implements OnInit {
  queueData: any = [];
  showAddUpdateDialog: boolean;
  queueName: string = '';
  isConnected: boolean;

  tableHeaders = [
    { field: 'queueName', header: 'Queue name', },
    { field: 'pendingMessages', header: 'Count' },
    { field: 'messageLimit', header: 'Limit' },
    { field: 'brokerUrl', header: 'Broker URL', },
    { field: '', header: 'Actions', },
  ];
  action: string = "Add";
  queueDataForm: FormGroup;
  selectedQueue: any;
  didSearch: boolean = true;
  allQueueData: any = [];
  constructor(private fb: FormBuilder, private apisService: HttpService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllQueData()
  }
  initForm() {
    this.queueDataForm = this.fb.group({
      queueName: ['', Validators.required],
      messageLimit: [1000, [Validators.required, Validators.min(1)]],
      userId: ["", Validators.required],
      password: ["", Validators.required],
      brokerUrl: ["", Validators.required],
      mails: [[]]
    })
  }
  //To get all list of queues initially to check queue is existed or not while addition
  getAllQueData() {
    this.apisService.getApi(environment.endPoints.queueTableData+'?queueName=' +this.queueName).subscribe((res) => {
      this.queueData = res.data;
      this.allQueueData = res.data;
    })
  }
  //To serch queues
  searchQueData() {
    this.didSearch = true;
    this.apisService.getApi(environment.endPoints.queueTableData+'?queueName=' +this.queueName).subscribe((res) => {
      this.queueData = res.data;      
    })
  }
  //To open the add queue form
  addQueue() {
    this.isConnected = true;
    this.action = 'Add';
    this.showAddUpdateDialog = true;
    this.initForm()
  }
  //To open update queue form
  updateQueue(data) {
    this.initForm();
    this.isConnected = true;
    this.selectedQueue = data.activeMqueue;
    this.action = 'Update';
    this.showAddUpdateDialog = true;
    this.queueDataForm.patchValue({ ...data.activeMqueue, mails: data.activeMqueue.mails ? data.activeMqueue.mails.split(",") : [] });
  }
  //To delete a queue
  deleteQueue(data) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <b>${data.activeMqueue.queueName} </b>queue?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: "positionDialog",
      accept: () => {
        this.apisService.deleteApi(environment.endPoints.deletedqueue +'/'+ data.activeMqueue.id)
          .subscribe((res) => {
            this.messageService.add({
              severity: res.success ? "success" : "error",
              detail: res.message,
            });
            if (res.success) {
              this.searchQueData();
            }
          });
      },
      reject: () => {
      }
    });
  }
  //to validate mail on every entry.
  validateEmail(data) {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.value))) {
      let too = this.queueDataForm.value.mails;
      this.queueDataForm.controls.mails.patchValue(too.slice(0, too.length - 1))
      this.messageService.add(
        { severity: 'error', summary: 'Error', detail: `${data.value} is not a valid email` }
      );
    }
  }
  //To save the queue data(Add&Edit)
  saveQueue() {
    if (!this.isInvalidForm()) {
      let formData = this.queueDataForm.value;
      let reqBody = { ...formData, mails: formData.mails.join(',') }
      if (this.action == "Add") {
        //To check the queue is already existed or not
        let isQueueExisted = this.allQueueData.every(queue => {
          if (queue.queueName == formData.queueName && queue.brokerUrl == formData.brokerUrl) {
            this.messageService.add(
              { severity: 'error', summary: 'Error', detail: `Queue already existed with given queue name and broker URL` }
            );
            return false;
          }
          return true;
        });
        if (isQueueExisted) {
          this.apisService.postApi(environment.endPoints.Addqueue, reqBody).subscribe(res =>
            this.handleSave(res));
        }
      }
      else {
        reqBody["id"] = this.selectedQueue?.id;
        this.apisService.putApi(`${environment.endPoints.queueupdate}/${reqBody["id"]}`, reqBody).subscribe(res =>
          this.handleSave(res)
        )
      }
    }
  }
  //To test the connection while adding new queue
  testConnection() {
    if (!this.isInvalidForm()) {
      let formData = this.queueDataForm.value;
      const reqBody = {
        "userId": formData.userName,
        "password": formData.password,
        "brokerUrl": formData.brokerUrl,
        "queueName": formData.queueName,
      }
      this.apisService.postApi(environment.endPoints.checkConnection, reqBody).subscribe(res => {
        this.messageService.add(
          { severity: res.success ? 'success' : 'error', summary: res.message });
        this.isConnected = res.success;
        this.selectedQueue = reqBody;
      })
    }
  }
  isInvalidForm() {
    if (this.queueDataForm.invalid) {
      Object.keys(this.queueDataForm.controls).forEach(formControlName => {
        this.queueDataForm.get(formControlName).markAsTouched();
      });
    }
    return this.queueDataForm.invalid;
  }
  //To show the error or success messages while saving the queue data
  handleSave(data) {
    this.messageService.add(
      { severity: data.success ? 'success' : 'error', summary: data.message });
    if (data.success) {
      this.searchQueData();
      this.showAddUpdateDialog = false;
    }
  }
  //shorthand sendMail Form validation code.
  get qData() {
    return this.queueDataForm.controls;
  }
  get connChanged() {
    let formData = this.queueDataForm.value;
    return formData.brokerUrl !== this.selectedQueue?.brokerUrl
  }

}
