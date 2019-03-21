import angular from 'angular'
import _ from 'lodash'
import $ from 'jquery'
import * as dp from './data_processor'
import * as pie from './pie_chart_option'
import * as utils from './utils'
import echarts from './libs/echarts.min'
import {MetricsPanelCtrl} from 'app/plugins/sdk'
import './css/style.css!'
import './css/bootstrap-slider.css!'

const panelDefaults = {
  targets: [{}],
  pageSize: null,
  showHeader: true,
  styles: [],
  columns: [],
  fontSize: '100%',
};

export class ChartCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector, templateSrv, annotationsSrv, $sanitize, variableSrv) {
    super($scope, $injector);

    this.pageIndex = 0;

    if (this.panel.styles === void 0) {
      this.panel.styles = this.panel.columns;
      this.panel.columns = this.panel.fields;
      delete this.panel.columns;
      delete this.panel.fields;
    }

    _.defaults(this.panel, panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));

    this.hasData = false
  }

  issueQueries(datasource) {
    this.pageIndex = 0;

    if (this.panel.transform === 'annotations') {
      this.setTimeQueryStart();
      return this.annotationsSrv
        .getAnnotations({
          dashboard: this.dashboard,
          panel: this.panel,
          range: this.range,
        })
        .then(annotations => {
          return { data: annotations };
        });
    }

    return super.issueQueries(datasource);
  }

  onDataError(err) {
    this.dataRaw = [];
    this.render();
  }

  onDataReceived(dataList) {

    if (dataList.length === 0 || dataList === null || dataList === undefined) {
        // console.log('No data reveived')
        this.hasData = false
        return
    }else {
        this.hasData = true
    }

    if (dataList[0].type !== 'table') {
        console.log('To show the pie chart, please format data as a TABLE in the Metrics Setting')
        return
    }

    //dataList data is messy and with lots of unwanted data, so we need to filter out data that we want -
    let data = dp.restructuredData(dataList[0].columns, dataList[0].rows)

    if (dp.getCategories(data).length === 0) {
      this.hasData = false
      return
    }    

    this.render(data)
  }

  rendering(){
    this.render(this.globe_data)
  }

  link(scope, elem, attrs, ctrl) {
    const $panelContainer = elem.find('#reason-codes-pie-chart')[0];
    const myChart = echarts.init($panelContainer)
    
    function renderPanel(data) { 
      if (!myChart || !data) { return; }
      const option = pie.getOption(data, myChart)
      //make a new option for pre selection
      const newOption = utils.copyObject(option)
      myChart.off('click')
      //pre select the first category item
      newOption.series[0].data[0].selected = true
      //after the json parsing, newOption's formatter will be removed due to it being a function, so assign it back
      newOption.tooltip.formatter = option.tooltip.formatter
      newOption.legend.formatter = option.legend.formatter
      newOption.series[0].label.normal.formatter = option.series[0].label.normal.formatter
      newOption.series[1].label.normal.formatter = option.series[1].label.normal.formatter
      newOption.toolbox.feature.myTool1.onclick = option.toolbox.feature.myTool1.onclick

      myChart.setOption(newOption);
      setTimeout(() => {
        $('#reason-codes-pie-chart').height(ctrl.height - 51)
        myChart.resize();
        window.onresize = () => {
            myChart.resize();
        }
      }, 500);
      myChart.on('click', params => {
        if (params.data.type === 'Category') {
          let reasonsData = dp.getReasonsData(params.data.name, data)
          if (params.data.isDurationMode) {
           reasonsData = dp.toDuration(reasonsData)
          }
          option.series[1].data = reasonsData
          myChart.setOption(option);
        }
      })
    }

    ctrl.events.on('panel-size-changed', () => {
      if (myChart) { 
          const height = ctrl.height - 51
          if (height >= 280) {
            $('#reason-codes-pie-chart').height(height);
          }
          myChart.resize(); 
      }
    })

    ctrl.events.on('render', data => {
      renderPanel(data);
      ctrl.renderingCompleted();
    });
  }

}

ChartCtrl.templateUrl = 'partials/module.html';
