'use strict';

/**
 * @ngdoc function
 * @name reportApp.controller:DebitCtrl
 * @description
 * # DebitCtrl
 * Controller of the reportApp
 */
angular.module('reportApp')
  .controller('DebitCtrl', function ($scope, $http, $filter) {
    $scope.chartTypes = [
      {'id': 'line', 'title': 'Line'},
      {'id': 'spline', 'title': 'Smooth line'},
      {'id': 'area', 'title': 'Area'},
      {'id': 'areaspline', 'title': 'Smooth area'},
      {'id': 'column', 'title': 'Column'},
      {'id': 'bar', 'title': 'Bar'},
      {'id': 'pie', 'title': 'Pie'},
      {'id': 'scatter', 'title': 'Scatter'}
    ];

    $scope.dashStyles = [
      {'id': 'Solid', 'title': 'Solid'},
      {'id': 'ShortDash', 'title': 'ShortDash'},
      {'id': 'ShortDot', 'title': 'ShortDot'},
      {'id': 'ShortDashDot', 'title': 'ShortDashDot'},
      {'id': 'ShortDashDotDot', 'title': 'ShortDashDotDot'},
      {'id': 'Dot', 'title': 'Dot'},
      {'id': 'Dash', 'title': 'Dash'},
      {'id': 'LongDash', 'title': 'LongDash'},
      {'id': 'DashDot', 'title': 'DashDot'},
      {'id': 'LongDashDot', 'title': 'LongDashDot'},
      {'id': 'LongDashDotDot', 'title': 'LongDashDotDot'}
    ];

    $scope.chartSeries = [];

    $scope.chartStack = [
      {'id': '', 'title': 'No'},
      {'id': 'normal', 'title': 'Normal'},
      {'id': 'percent', 'title': 'Percent'}
    ];

    $scope.toggleHighCharts = function () {
      this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
    }

    $scope.reflow = function () {
      $scope.$broadcast('highchartsng.reflow');
    };

    $scope.chartConfig = { loading: true };
    $scope.chartConfig_debit = { loading: true };

    /* ----------------------------- */

    $scope.datepickers = {
        dt: false,
        dtSecond: false
      }
      $scope.today = function() {
        var date = new Date();
        $scope.dt = Date.UTC(2014,9,1);
        $scope.dtSecond = Date.UTC(date.getFullYear(), date.getUTCMonth(), date.getUTCDate());
      };
      $scope.today();

      $scope.showWeeks = false;

      $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
      };

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which]= true;
      };

      $scope.getData = function(){
        var date_start = $filter('date')($scope.dt, 'yyyy-MM-dd');
        var date_end   = $filter('date')($scope.dtSecond, 'yyyy-MM-dd');

        $http.get('http://127.0.1.1/report/debt_contractor?type=json&is_group=0&date_start='+date_start+'&date_end='+date_end).
        success(function(data) {
            console.log('debit', data);

            var raw_partners = [];
            var raw_data     = [];
            var raw_begin    = [];
            var raw_end      = [];

            $.each(data.items, function(i, e){
              raw_partners.push(e.contractor_title);
              raw_begin.push( parseInt(e.debt_0) );
              raw_end.push(   parseInt(e.debt_1) );
            });
            
            raw_data = [
              {name:  "Долг начало периода", data: raw_begin},
              {name:  "Долг нонец периода",  data: raw_end}
            ];

            $scope.chartConfig = {
                options: {
                  chart: {
                    type: "bar"
                  },
                  plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    //stacked
                    //series: {
                    //   stacking: "normal"
                    //}
                  }
                },
                //useHighStocks: true,

                xAxis: {
                  categories: raw_partners,
                  title: {
                    text: null
                  }
                },

                yAxis: {
                  min: 0,
                  title: {
                    text: "Долги",
                    align: "high"
                  },
                  labels: {
                    overflow: "justify",
                    valueSuffix: ".p"
                  }
                },

                tooltip: {
                  valueSuffix: ".p"
                },

                series: raw_data,
                title: {
                  text: "Отчет \"Задолженность клиентов\""
                },
                subtitle: {
                  text: "за период "+date_start+" -> "+date_end
                },
                credits: {
                  enabled: false
                },
                loading: false
              }
        });
        

        var start = new Date(date_start.split('-')[1]+"/"+date_start.split('-')[2]+"/"+date_start.split('-')[0]);
        var end = new Date(date_end.split('-')[1]+"/"+date_end.split('-')[2]+"/"+date_end.split('-')[0]);

        console.log(start, end);

        while(start < end){
          var newDate = start.setDate(start.getDate() + 1);
          start = new Date(newDate);
          console.log( $filter('date')(newDate, 'yyyy-MM-dd') );
        }
        
        
        $http.get('http://127.0.1.1/report/contractor_debit_credit?date_start='+date_start+'&date_end='+date_end+'&contractor_id=&type=credit&page=1&start=0&limit=5').
        success(function(data) {
            
            var debit_data = {};
            var debit_data_series = [];

            if (data.items.length > 0) {
              var contact = '';
              for (var i = data.items.length - 1; i >= 0; i--) {
                contact = data.items[i];
                
                if ( !debit_data.hasOwnProperty(contact.contractor_title) ) {
                  debit_data[contact.contractor_title] = []
                }
                var date = contact.doc_date.split('.');
                debit_data[contact.contractor_title].push([ Date.UTC(date[2],  date[1]-1, date[0]), parseInt(contact.amount_credit)]);  
                

              };
            };
            
            for (var key in debit_data) {
              debit_data_series.push({name: key, data: debit_data[key]});
            }

            console.log( 'data', debit_data_series );

            for (var i = 0; i < debit_data_series.length; i++) {
              var data = debit_data_series[i].data;
              data.sort(function(a,b) {
                  return a[0] - b[0];
              });
            };

            $scope.chartConfig_debit = {
              chart: {
                  type: 'spline'
              },
              title: {
                  text: 'Snow depth at Vikjafjellet, Norway'
              },
              subtitle: {
                  text: 'Irregular time data in Highcharts JS'
              },
              xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: { // don't display the dummy year
                      month: '%e. %b',
                      year: '%b'
                  },
                  title: {
                      text: 'Date'
                  }
              },
              yAxis: {
                  title: {
                      text: 'Snow depth (m)'
                  },
                  min: 0
              },
              tooltip: {
                  headerFormat: '<b>{series.name}</b><br>',
                  pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
              },

              series: debit_data_series
            }
        });
        


      };
      $scope.getData();

      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];
  });
