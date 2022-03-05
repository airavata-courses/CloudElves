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

    var data = {"OkPercent": 75.0, "KoPercent": 25.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "getimage_request"], "isController": false}, {"data": [0.0, 500, 1500, "getdata_request"], "isController": false}, {"data": [0.0, 500, 1500, "getdata_request-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "getimage_request-1"], "isController": false}, {"data": [1.0, 500, 1500, "getimage_request-0"], "isController": false}, {"data": [1.0, 500, 1500, "getdata_request-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88, 22, 25.0, 1222.5909090909097, 1, 8184, 13.5, 4272.700000000007, 5637.999999999997, 8184.0, 2.3178633514196916, 157.1073666240847, 0.4746228533424643], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["getimage_request", 20, 10, 50.0, 10.950000000000001, 1, 47, 11.5, 19.800000000000004, 45.64999999999998, 47.0, 0.6082170118298208, 90.34769699578808, 0.11401099162181065], "isController": false}, {"data": ["getdata_request", 20, 9, 45.0, 2843.75, 2, 8184, 2815.0, 6073.300000000002, 8083.999999999998, 8184.0, 0.5268148772521336, 0.780267366781688, 0.13857186248814668], "isController": false}, {"data": ["getdata_request-1", 13, 2, 15.384615384615385, 3845.538461538462, 2536, 8176, 2956.0, 7344.4, 8176.0, 8176.0, 0.43162123576479966, 0.2812087573458614, 0.08024808883097048], "isController": false}, {"data": ["getimage_request-1", 11, 1, 9.090909090909092, 14.363636363636362, 9, 44, 11.0, 38.40000000000002, 44.0, 44.0, 0.6071645415907712, 162.66614014116576, 0.10376347146326655], "isController": false}, {"data": ["getimage_request-0", 11, 0, 0.0, 2.6363636363636362, 1, 6, 2.0, 5.400000000000002, 6.0, 6.0, 0.6073656893600574, 0.20463004182540998, 0.1032047167467285], "isController": false}, {"data": ["getdata_request-0", 13, 0, 0.0, 24.23076923076923, 6, 87, 12.0, 87.0, 87.0, 87.0, 0.5406079760469081, 0.20853530326028194, 0.11825799476026115], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 8, 36.36363636363637, 9.090909090909092], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 12, 54.54545454545455, 13.636363636363637], "isController": false}, {"data": ["500/Internal Server Error", 2, 9.090909090909092, 2.272727272727273], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88, 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 12, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 8, "500/Internal Server Error", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getimage_request", 20, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 4, "500/Internal Server Error", 1, null, null, null, null], "isController": false}, {"data": ["getdata_request", 20, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused", 4, null, null, null, null, null, null], "isController": false}, {"data": ["getdata_request-1", 13, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getimage_request-1", 11, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
