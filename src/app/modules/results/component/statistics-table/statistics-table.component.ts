import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatisticsData } from '../../interfaces/result.interface';
import { DisplayedStatisticsColumns } from '../../static/results.static';

@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
})
export class StatisticsTableComponent {
  displayedStatisticsColumns = DisplayedStatisticsColumns;
  @Input() statisticsData: MatTableDataSource<StatisticsData>;
}
