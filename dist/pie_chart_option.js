'use strict';

System.register(['./data_processor', './utils'], function (_export, _context) {
  "use strict";

  var dp, utils;
  function getOption(data, myChart) {

    var categories = dp.getCategories(data); // legends are only for categories

    var categoriesData = dp.getCategoriesData(categories, data);
    console.log(categoriesData);

    var reasonsData = dp.getReasonsData(categories[0], data);
    console.log(reasonsData);

    var isDurationMode = false;

    var option = {
      toolbox: {
        show: true,
        feature: {
          show: true,
          myTool1: {
            show: true,
            title: 'duration',
            icon: 'image://public/plugins/smart-factory-pareto-reason-codes-pie-chart-panel/images/switch.png',
            onclick: function onclick() {
              if (!isDurationMode) {
                //change the series data to duration mode
                option.series[1].data = dp.toDuration(reasonsData);
                option.series[0].data = dp.toDuration(categoriesData);
                option.toolbox.feature.myTool1.title = 'frequency of occurrences';
              } else {
                //back to occurrences mode                  
                option.series[1].data = reasonsData;
                option.series[0].data = categoriesData;
                option.toolbox.feature.myTool1.title = 'duration';
              }
              var newOption = utils.copyObject(option);
              newOption.series[0].data[0].selected = true;
              newOption.series[0].label.normal.formatter = option.series[0].label.normal.formatter;
              newOption.series[1].label.normal.formatter = option.series[1].label.normal.formatter;
              myChart.setOption(newOption);
              isDurationMode = !isDurationMode;
            }
          },
          saveAsImage: {
            show: true,
            title: 'save as image'
          }
        },
        right: 45
      },
      tooltip: {
        trigger: 'item',
        formatter: function formatter(params) {
          var value = void 0;
          if (params.data.isDurationMode) {
            value = dp.toHrsAndMins(params.data.duration);
          } else {
            value = params.data.value;
          }
          var tooltip = '<p style="text-align:center;margin:0px;color:#999">' + params.data.type + '</p>';
          tooltip += '<div style="margin:5px 0px 5px 0px; width:100%; height:1px; background: #999"></div>';
          tooltip += '<p style="margin:0px;color:' + params.color + '"><strong style="font-size:large">' + params.data.name + ' :</strong> &nbsp;' + value + '&nbsp;&nbsp; <span style="color:#eee; border-radius:2px; padding: 2px 4px; background-color:#334455">' + params.percent + '%</span></p> ';
          return tooltip;
        },
        backgroundColor: '#eee',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 4
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: categories,
        formatter: function formatter(name) {
          return name;
        }
      },
      series: [{
        name: 'Category',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          normal: {
            formatter: function formatter(params) {
              return params.data.name + '\n' + params.percent + '%';
            }
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        },
        data: categoriesData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }, {
        name: 'Reasons',
        type: 'pie',
        radius: ['80%', '85%'],
        label: {
          normal: {
            formatter: function formatter(params) {
              return params.data.name + '\n' + params.percent + '%';
            }
          }
        },
        data: reasonsData
      }]
    };

    return option;
  }

  _export('getOption', getOption);

  return {
    setters: [function (_data_processor) {
      dp = _data_processor;
    }, function (_utils) {
      utils = _utils;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=pie_chart_option.js.map
