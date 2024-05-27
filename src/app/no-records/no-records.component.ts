import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-records',
  templateUrl: './no-records.component.html',
  styleUrls: ['./no-records.component.scss']
})
export class NoRecordsComponent implements OnInit {
  @Input() display:boolean;
  constructor() { }

  ngOnInit(): void {

  }

}
