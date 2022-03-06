/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.37931034482759, "KoPercent": 8.620689655172415};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.603448275862069, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "getimage_request"], "isController": false}, {"data": [0.0, 500, 1500, "getdata_request"], "isController": false}, {"data": [0.0, 500, 1500, "getdata_request-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "getimage_request-1"], "isController": false}, {"data": [1.0, 500, 1500, "getimage_request-0"], "isController": false}, {"data": [1.0, 500, 1500, "getdata_request-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 116, 10, 8.620689655172415, 1218.3965517241384, 2, 7804, 15.0, 3313.7, 5529.2, 7802.64, 2.6499748709279483, 216.65190988086536, 0.6608874560241239], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["getimage_request", 20, 4, 20.0, 17.849999999999998, 5, 69, 13.5, 32.500000000000014, 67.19999999999997, 69.0, 0.48742444921037237, 115.16606893704915, 0.14951173779001756], "isController": false}, {"data": ["getdata_request", 20, 2, 10.0, 3516.1000000000004, 2500, 7804, 2769.5, 5779.000000000001, 7704.0999999999985, 7804.0, 0.45700706075908876, 0.42009838505129904, 0.19034522598999154], "isController": false}, {"data": ["getdata_request-1", 20, 2, 10.0, 3489.8999999999996, 2362, 7796, 2764.5, 5771.000000000001, 7696.0999999999985, 7796.0, 0.45719510801234425, 0.24391180420619502, 0.09041211852783176], "isController": false}, {"data": ["getimage_request-1", 18, 2, 11.11111111111111, 15.16666666666667, 2, 54, 12.0, 31.500000000000036, 54.0, 54.0, 0.4895694508662659, 128.25067528286235, 0.08366665420077786], "isController": false}, {"data": ["getimage_request-0", 18, 0, 0.0, 3.777777777777778, 2, 15, 3.0, 9.600000000000009, 15.0, 15.0, 0.4897292885321725, 0.16499668412460888, 0.08321571894980274], "isController": false}, {"data": ["getdata_request-0", 20, 0, 0.0, 25.799999999999997, 4, 138, 8.0, 88.80000000000001, 135.54999999999995, 138.0, 0.5268148772521336, 0.203214723158782, 0.11524075439890423], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 6, 60.0, 5.172413793103448], "isController": false}, {"data": ["500/Internal Server Error", 4, 40.0, 3.4482758620689653], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 116, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 6, "500/Internal Server Error", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getimage_request", 20, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 2, "500/Internal Server Error", 2, null, null, null, null, null, null], "isController": false}, {"data": ["getdata_request", 20, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getdata_request-1", 20, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getimage_request-1", 18, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
