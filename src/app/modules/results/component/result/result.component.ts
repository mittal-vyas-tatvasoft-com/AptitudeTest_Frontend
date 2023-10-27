import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


export interface TopicsData {
  name: string;
  universityName:string;
  startTime:string;
  points:string;
  pointsColor:string;
  correct:string;
  wrong:string;
  unanswered:string;
  undisplayed:string;
  status: string;
  action: string;
}

export interface StatisticsData {
  name: string;
  points: string;
  pointsColor:string;
  correct:string;
  wrong:string;
  unanswered:string;
  undisplayed:string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['name', 'startTime', 'points', 'correct', 'wrong', 'unanswered', 'undisplayed', 'status', 'action'];
  dataSource: MatTableDataSource<TopicsData>;
  
  displayedStatisticsColumns: string[] = ['name', 'points', 'correct','wrong', 'unanswered', 'undisplayed'];
  statisticsData: MatTableDataSource<StatisticsData>;   
  


  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "Ralph Edwards", universityName: "Columbia University", startTime:"17 Jun, 2020 02:57 pm", points:"30.00 (25%)", pointsColor:"green", correct:"5.000 (10%)", wrong:"1.000 (5%)", unanswered:"1.000 (5%)", undisplayed: "1.000 (5%)", status: "Active", action: "" },
      { name: "Savannah Nguyen", universityName: "Columbia University", startTime:"23 Jun, 2020 01:17 pm", points:"1.000 (5%)", pointsColor:"red", correct:"15.00 (15%)", wrong:"30.00 (25%)", unanswered:"30.00 (25%)", undisplayed: "30.00 (25%)", status: "Pending", action: "" },
      { name: "Arlene McCoy", universityName: "Columbia University", startTime:"26 Jun, 2020 12:30 am", points:"15.00 (15%)", pointsColor:"green", correct:"30.00 (25%)", wrong:"25.00 (18%)", unanswered:"25.00 (18%)", undisplayed: "25.00 (18%)", status: "Locked", action: "" },
      { name: "Wade Warren", universityName: "Brown University", startTime:"29 Jun, 2020 07:40 am", points:"25.00 (18%)", pointsColor:"green", correct:"1.000 (5%)", wrong:"5.000 (10%)", unanswered:"5.000 (10%)", undisplayed: "5.000 (10%)", status: "Locked", action: "" },
      { name: "Courtney Henry", universityName: "Brigham Young University", startTime:"04 Jun, 2020 04:51 am", points:"5.000 (10%)", pointsColor:"red", correct:"25.00 (18%)", wrong:"15.00 (15%)", unanswered:"15.00 (15%)", undisplayed: "15.00 (15%)", status: "Locked", action: "" },
      { name: "Robert Fox", universityName: "St. John's College", startTime:"24 Jun, 2020 09:20 am", points:"30.00 (25%)", pointsColor:"green", correct:"15.00 (15%)", wrong:"1.000 (5%)", unanswered:"1.000 (5%)", undisplayed: "1.000 (5%)", status: "Pending", action: "" },
      { name: "Bessie Cooper", universityName: "Standford University", startTime:"01 Jun, 2020 05:05 pm", points:"1.000 (5%)", pointsColor:"red", correct:"30.00 (25%)", wrong:"30.00 (25%)", unanswered:"30.00 (25%)", undisplayed: "30.00 (25%)", status: "Locked", action: "" },
      { name: "Darrell Steward", universityName: "Villanova University", startTime:"17 Jun, 2020 06:49 am", points:"15.00 (15%)", pointsColor:"green", correct:"1.000 (5%)", wrong:"15.00 (15%)", unanswered:"15.00 (15%)", undisplayed: "15.00 (15%)", status: "Locked", action: "" },
      { name: "Albert Flores", universityName: "Duke University", startTime:"04 Jun, 2020 07:00 am", points:"25.00 (18%)", pointsColor:"green", correct:"25.00 (18%)", wrong:"25.00 (18%)", unanswered:"25.00 (18%)", undisplayed: "25.00 (18%)", status: "Locked", action: "" },
      { name: "Jacob Jones", universityName: "Harvard University", startTime:"08 Jun, 2020 06:00 am", points:"5.000 (10%)", pointsColor:"red", correct:"5.000 (10%)", wrong:"5.000 (10%)", unanswered:"5.000 (10%)", undisplayed: "5.000 (10%)", status: "Locked", action: "" },
    ]);

    this.statisticsData = new MatTableDataSource([
      { name: "Maths", points: "30.00 (25%)", pointsColor:"green", correct:"5.000 (10%)", wrong:"1.000 (5%)", unanswered:"15.00 (15%)", undisplayed:"5.000 (10%)"},
      { name: "Average", points: "1.000 (5%)", pointsColor:"red", correct:"15.00 (15%)", wrong:"30.00 (25%)", unanswered:"30.00 (25%)", undisplayed:"30.00 (25%)"},
      { name: "Minimum", points: "15.00 (15%)", pointsColor:"green", correct:"30.00 (25%)", wrong:"25.00 (18%)", unanswered:"1.000 (5%)", undisplayed:"1.000 (5%)"},
      { name: "Maximum", points: "25.00 (18%)", pointsColor:"green", correct:"1.000 (5%)", wrong:"5.000 (10%)", unanswered:"25.00 (18%)", undisplayed:"15.00 (15%)"},
    ]);
  }

}
