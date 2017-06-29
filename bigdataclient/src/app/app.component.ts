import {Component, OnInit} from '@angular/core';
import {Jsonp, Http, Headers, Response} from "@angular/http";
import {NG_TABLE_DIRECTIVES} from 'ng2-table/ng2-table';

class YearRank {
  public year: number;
  public goodRank: number;
  public badRank: number;


  constructor(year: number) {
    this.goodRank = 0;
    this.badRank = 0;
    this.year = year;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private SERVER_ADDR: string = "http://localhost:3000";

  public rows: Array<any> = [];
  public columns: Array<any> = [
    // {title: 'Name', name: 'name', filtering: {filterString: '', placeholder: 'Filter by name'}},
    // {
    //   title: 'Position',
    //   name: 'position',
    //   sort: false,
    //   filtering: {filterString: '', placeholder: 'Filter by position'}
    // },

    {title: 'actor_1_facebook_likes', className: ['text-success'], name: 'actor_1_facebook_likes', sort: false},
    // {title: 'actor_1_name', className: ['text-success'], name: 'actor_1_name', sort: false},
    {title: 'actor_2_facebook_likes', className: ['text-success'], name: 'actor_2_facebook_likes', sort: false},
    // {title: 'actor_2_name', className: ['text-success'], name: 'actor_2_name', sort: false},
    {title: 'actor_3_facebook_likes', className: ['text-success'], name: 'actor_2_facebook_likes', sort: false},
    // {title: 'actor_3_name', className: ['text-success'], name: 'actor_2_name', sort: false},
    {title: 'budget', className: ['text-success'], name: 'budget', sort: false},
    // {title: 'color', className: ['text-success'], name: 'color', sort: false},
    {title: 'country', className: ['text-success'], name: 'country', sort: false},
    // {title: 'director_name', className: ['text-success'], name: 'director_name', sort: false},
    {title: 'duration', className: ['text-success'], name: 'duration', sort: true},
    {
      title: 'genres',
      className: ['text-success'],
      name: 'genres',
      filtering: {filterString: '', placeholder: 'Filter by genres'}
    },
    {title: 'imdb_score', className: ['text-success'], name: 'imdb_score', sort: false},
    {title: 'language', className: ['text-success'], name: 'language', sort: false},
    {title: 'movie_facebook_likes', className: ['text-success'], name: 'movie_facebook_likes', sort: false},
    // {title: 'movie_imdb_link', className: ['text-success'], name: 'movie_imdb_link', sort: false},
    {
      title: 'movie_title',
      className: ['text-success'],
      name: 'movie_title',
      filtering: {filterString: '', placeholder: 'Filter by title'}
    },
    {title: 'num_critic_for_reviews', className: ['text-success'], name: 'num_critic_for_reviews', sort: false},
    {title: 'num_user_for_reviews', className: ['text-success'], name: 'num_user_for_reviews', sort: false},
    {title: 'num_voted_users', className: ['text-success'], name: 'num_voted_users', sort: false},
    {
      title: 'plot_keywords',
      className: ['text-success'],
      name: 'plot_keywords',
      filtering: {filterString: '', placeholder: 'Filter by keyword'}
    },
    {title: 'title_year', className: ['text-success'], name: 'title_year', sort: true},
  ];

  public data: Array<any> = [];

  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };

  constructor(private http: Http, private jsonp: Jsonp) {
    this.loadRemoteData();
  }


  ngOnInit(): void {
    this.onChangeTable(this.config);
  }

  public onChangeTable(config: any, page: any = {page: this.page, itemsPerPage: this.itemsPerPage}): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public changePage(page: any, data: Array<any> = this.data): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }


  public changeFilter(data: any, config: any): any {
    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].toString().match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        String(item[config.filtering.columnName]).match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  loadRemoteData() {


    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let dataUrl = this.SERVER_ADDR + '/?callback=JSONP_CALLBACK';  // URL to web API
    this.jsonp.request(dataUrl, {method: 'Get', headers: headers})
    // .subscribe((res) => {
    //   // this.result = res.json()
    //   // this.onResult(res.json());
    //   console.log(res);
    // });
      .subscribe(
        (data) => {
          console.log(data);
          let jdata = data.json();
          let movieTitle: string[] = [];
          let imdbRank: number[] = [];
          let faceboolLikes: number[] = [];
          let counter: number = 0;

          var years: {[key: number]: YearRank;} = {};
          let minYear = -1;
          let maxYear = -1;

          console.log(jdata);
          for (let i = 0; i < jdata.length; i++) {
            this.data.push(jdata[i]);
            counter++;
            if (counter < 10) {
              faceboolLikes.push(jdata[i].movie_facebook_likes);
              imdbRank.push(jdata[i].imdb_score * 1000);
              movieTitle.push(jdata[i].movie_title);
              this.barChartLabels.push("m: " + jdata[i].movie_title);
            }
            let cYear = jdata[i].title_year;
            let cnYear = +cYear;

            if (cnYear < 1980) {
              continue;
            }

            if (years[cnYear] == null) {
              years[cnYear] = new YearRank(cnYear);
            }
            if (jdata[i].imdb_score < 7) {
              years[cnYear].badRank += 1;
            } else {
              years[cnYear].goodRank += 1;
            }
            if (cnYear < minYear || minYear == -1) {
              minYear = cnYear;
            }
            if (cnYear > maxYear || maxYear == -1) {
              maxYear = cnYear;
            }
          }

          this.onChangeTable(this.config);
          let yearTitle: string[] = [];
          let totalGood: number[] = [];
          let totalBad: number[] = [];
          for (let i: number = minYear; i <= maxYear; i++) {
            this.lineChartLabels.push(i + "");
            if (years[i] != null) {
              totalGood.push(years[i].goodRank);
              totalBad.push(years[i].badRank);
            }
          }

          console.log("min Y : " + minYear + " max Y: " + maxYear);
          let clone = JSON.parse(JSON.stringify(this.barChartData));
          clone[0].data = imdbRank;
          clone[1].data = faceboolLikes;
          this.barChartData = clone;

          let lineChartData: Array<any> = [
            {data: totalBad, label: 'Bad Rank'},
            {data: totalGood, label: 'Good Rank'}
          ];

          this.lineChartData = lineChartData;

        },
        (error) => {
          console.log(error);
        });
  }


  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    {data: [], label: 'Imdb rate'},
    {data: [], label: 'movie facebook likes'}
  ];


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public randomize(): void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }


  // graph 2

  // lineChart
  public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public currentSelection : number = 0;
  public setSelection(selection : number) : void {
    this.currentSelection = selection;
  }

}
