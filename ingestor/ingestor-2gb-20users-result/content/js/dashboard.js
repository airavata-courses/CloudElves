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

    var data = {"OkPercent": 43.75, "KoPercent": 56.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15, 500, 1500, "getimage_request"], "isController": false}, {"data": [0.0, 500, 1500, "getdata_request"], "isController": false}, {"data": [0.0, 500, 1500, "getdata_request-1"], "isController": false}, {"data": [0.6, 500, 1500, "getimage_request-1"], "isController": false}, {"data": [1.0, 500, 1500, "getimage_request-0"], "isController": false}, {"data": [1.0, 500, 1500, "getdata_request-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 64, 36, 56.25, 672.109375, 1, 4469, 4.0, 3104.5, 3682.75, 4469.0, 1.6860296635843937, 48.99874494520403, 0.22835081930503962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["getimage_request", 20, 17, 85.0, 6.100000000000001, 1, 48, 2.0, 17.50000000000001, 46.49999999999998, 48.0, 0.5972823652381662, 27.557377603777812, 0.05089149059280275], "isController": false}, {"data": ["getdata_request", 20, 15, 75.0, 1070.6999999999996, 1, 4469, 3.0, 3634.200000000001, 4429.799999999999, 4469.0, 0.5269120320362515, 1.0932395539689648, 0.06928584483757937], "isController": false}, {"data": ["getdata_request-1", 7, 2, 28.571428571428573, 3032.714285714286, 1683, 4440, 2945.0, 4440.0, 4440.0, 4440.0, 0.5142899125707149, 0.4798508559253545, 0.08071653901256337], "isController": false}, {"data": ["getimage_request-1", 5, 2, 40.0, 16.4, 2, 45, 11.0, 45.0, 45.0, 45.0, 0.7490636704119851, 132.55018141385767, 0.12801381086142322], "isController": false}, {"data": ["getimage_request-0", 5, 0, 0.0, 2.4, 2, 3, 2.0, 3.0, 3.0, 3.0, 0.749737591842855, 0.25259713787674315, 0.12739681736392264], "isController": false}, {"data": ["getdata_request-0", 7, 0, 0.0, 22.285714285714285, 5, 94, 8.0, 94.0, 94.0, 94.0, 0.5854311282094171, 0.22582548402609348, 0.12806305929580997], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 24, 66.66666666666667, 37.5], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 8, 22.22222222222222, 12.5], "isController": false}, {"data": ["500/Internal Server Error", 4, 11.11111111111111, 6.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 64, 36, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 24, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 8, "500/Internal Server Error", 4, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getimage_request", 20, 17, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 3, "500/Internal Server Error", 2, null, null, null, null], "isController": false}, {"data": ["getdata_request", 20, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 3, null, null, null, null, null, null], "isController": false}, {"data": ["getdata_request-1", 7, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getimage_request-1", 5, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
