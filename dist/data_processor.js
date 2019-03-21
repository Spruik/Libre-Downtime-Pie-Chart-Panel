'use strict';

System.register(['./utils', 'moment'], function (_export, _context) {
  "use strict";

  var utils, moment;


  /**
   * Expecting columns names, and rows values
   * Return {col-1 : value-1, col-2 : value-2 .....}
   * @param {*} rowCols 
   * @param {*} rows 
   */
  function restructuredData(rowCols, rows) {
    var data = [];
    var cols = rowCols.reduce(function (arr, c) {
      var col = c.text.toLowerCase();
      arr.push(col);
      return arr;
    }, []);
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var serise = {};
      for (var k = 0; k < cols.length; k++) {
        var col = cols[k];
        serise[col] = row[k];
      }
      data.push(serise);
    }

    return data;
  }

  /**
   * Expecting the restructured datalist
   * Return an array with distinct categories  --> ['category-1', 'category-2', ...]
   * @param {*} data 
   */

  _export('restructuredData', restructuredData);

  function getCategories(data) {

    var categories = data.reduce(function (arr, d) {
      if (d.category !== null && d.category !== undefined) {
        arr.push(d.category);
      }
      return arr;
    }, []);

    return Array.from(new Set(categories));
  }

  /**
   * Expecting categories-legends and the restructured datalist
   * For each legend, filter this legends data from the datalist, and then return an array of obj in this format
   * [{value: categoryData.length, type: 'Category', name: category}, .....]
   * 
   * Note: The first item will be set to be selected = true
   * 
   * @param {*} categories 
   * @param {*} data 
   */

  _export('getCategories', getCategories);

  function getCategoriesData(categories, data) {
    var categoriesData = [];

    var sum = 0;

    var _loop = function _loop(i) {
      var category = categories[i];
      var categoryData = data.filter(function (d) {
        return d.category === category;
      });

      var duration = 0.00;
      for (var _i = 0; _i < categoryData.length; _i++) {
        var c = categoryData[_i];
        if (c.durationint) {
          duration += c.durationint;
        }
      }

      var item = { value: categoryData.length, type: 'Category', name: category, duration: duration, isDurationMode: false };
      sum += item.value;

      categoriesData.push(item);
    };

    for (var i = 0; i < categories.length; i++) {
      _loop(i);
    }

    for (var i = 0; i < categoriesData.length; i++) {
      var percent = categoriesData[i].value / sum * 100;
      if (hasDecimal(percent)) {
        percent = parseFloat(percent.toFixed(2));
      }
      categoriesData[i].p = percent;
    }

    return categoriesData;
  }
  _export('getCategoriesData', getCategoriesData);

  function getReasonsData(category, data) {
    var reasonsData = [];

    var items = takeItems(category, data);

    var _loop2 = function _loop2(i) {
      var item = items[i];
      var reasonData = data.filter(function (d) {
        return d.category === category && d.parentreason === item;
      });

      var duration = 0.00;
      for (var _i2 = 0; _i2 < reasonData.length; _i2++) {
        var r = reasonData[_i2];
        if (r.durationint) {
          duration += r.durationint;
        }
      }

      var reason = { value: reasonData.length, type: 'Reason', name: item, duration: duration, isDurationMode: false };
      reasonsData.push(reason);
    };

    for (var i = 0; i < items.length; i++) {
      _loop2(i);
    }

    return reasonsData;
  }
  _export('getReasonsData', getReasonsData);

  function toDuration(data) {
    var d = utils.copyObject(data);
    for (var i = 0; i < d.length; i++) {
      d[i].value = d[i].duration / 1000000;
      d[i].isDurationMode = true;
    }
    return d;
  }

  /**
   * Expecting a duration int value, return (string) hours and mins like 2:35 meaning 2 hours and 35 mins
   * if val is under 1 hour,  return (string) mins like 55-mins 
   * @param {*} val 
   */

  _export('toDuration', toDuration);

  function toHrsAndMins(difference) {
    var daysDiff = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDiff * 1000 * 60 * 60 * 24;

    var hrsDiff = Math.floor(difference / 1000 / 60 / 60);
    difference -= hrsDiff * 1000 * 60 * 60;

    var minsDiff = Math.floor(difference / 1000 / 60);
    difference -= minsDiff * 1000 * 60;

    var secsDiff = Math.floor(difference / 1000);
    difference -= minsDiff * 1000;

    var timeToAdd = daysDiff * 24;
    hrsDiff = hrsDiff + timeToAdd;

    if (hrsDiff === 0 && minsDiff === 0) {
      return secsDiff + ' Seconds';
    } else if (hrsDiff === 0 && minsDiff !== 0) {
      return minsDiff + ' Minutes';
    }

    return hrsDiff + ' Hrs & ' + minsDiff + ' Mins';
  }

  //look for the distinct items that this category has

  _export('toHrsAndMins', toHrsAndMins);

  function takeItems(category, data) {
    return Array.from(new Set(data.reduce(function (arr, d) {
      if (d.reason !== null && d.reason !== undefined) {
        //because the reasons in the influxdb is stored like 'root reason | sub reason'
        //reasons.length === 1 meaning that there is no sub reasons for this item
        //because this chart only display categories and reasons up to reason level - 1
        if (d.category === category && d.parentreason !== null && d.parentreason !== undefined) {
          arr.push(d.parentreason);
        }
      }
      return arr;
    }, [])));
  }function hasDecimal(n) {
    return n - Math.floor(n) !== 0 ? true : false;
  }return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_moment) {
      moment = _moment.default;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=data_processor.js.map
