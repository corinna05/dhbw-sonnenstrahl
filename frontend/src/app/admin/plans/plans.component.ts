import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  public results: PlanData[] = [];
  public loading = false;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Daten Import',
        function: () => {
        },
      },
      {
        title: 'Daten Export',
        function: () => {
        },
      }
    ]
  };

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.get<PlanData[]>('/plans', {
      order: '-cost_fix'
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

}
