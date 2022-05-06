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

    var data = {"OkPercent": 96.26288659793815, "KoPercent": 3.7371134020618557};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8157216494845361, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46153846153846156, 500, 1500, "POST create users"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "POST create groups"], "isController": false}, {"data": [1.0, 500, 1500, "GET single group"], "isController": false}, {"data": [0.4594594594594595, 500, 1500, "PUT update user password"], "isController": false}, {"data": [0.9962962962962963, 500, 1500, "POST add child to group"], "isController": false}, {"data": [0.9918032786885246, 500, 1500, "POST add user to group"], "isController": false}, {"data": [0.9956896551724138, 500, 1500, "GET all children groups"], "isController": false}, {"data": [0.9014084507042254, 500, 1500, "GET user availability"], "isController": false}, {"data": [0.6320754716981132, 500, 1500, "GET user groups"], "isController": false}, {"data": [0.8841463414634146, 500, 1500, "GET user status"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "PUT update user profile"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 776, 29, 3.7371134020618557, 425.403350515464, 89, 10407, 256.0, 832.2000000000003, 1527.9499999999998, 1886.4400000000005, 1.2922435412801871, 1.7858539558722146, 0.5241998518749188], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST create users", 39, 4, 10.256410256410257, 759.6410256410256, 221, 1272, 732.0, 1216.0, 1252.0, 1272.0, 0.06494522952310218, 0.02180940687936507, 0.03145134061941097], "isController": false}, {"data": ["POST create groups", 39, 4, 10.256410256410257, 1017.7179487179488, 429, 10407, 639.0, 1285.0, 1330.0, 10407.0, 0.06495355820588279, 0.035451540169612064, 0.041988207598233934], "isController": false}, {"data": ["GET single group", 98, 0, 0.0, 177.16326530612244, 95, 472, 161.5, 262.70000000000016, 289.15, 472.0, 0.16491569946974555, 0.09397460298228165, 0.058622377545886104], "isController": false}, {"data": ["PUT update user password", 37, 3, 8.108108108108109, 682.5135135135134, 199, 1268, 675.0, 874.4000000000002, 1013.3000000000004, 1268.0, 0.06285248352245702, 0.01992839116752735, 0.024797268889719375], "isController": false}, {"data": ["POST add child to group", 135, 0, 0.0, 180.5333333333334, 89, 547, 171.0, 243.40000000000012, 305.4, 474.99999999999727, 0.22567174957456695, 0.07061547215962849, 0.1082078408604613], "isController": false}, {"data": ["POST add user to group", 61, 0, 0.0, 196.0655737704918, 109, 507, 180.0, 291.20000000000005, 302.4, 507.0, 0.10300887227237572, 0.032262832625780585, 0.04748065206304818], "isController": false}, {"data": ["GET all children groups", 116, 0, 0.0, 172.36206896551727, 93, 534, 155.0, 254.2, 304.74999999999994, 511.0499999999998, 0.19455285548244913, 0.1199789561107207, 0.06820749523261645], "isController": false}, {"data": ["GET user availability", 71, 5, 7.042253521126761, 346.77464788732385, 222, 752, 297.0, 499.2, 669.0, 752.0, 0.11905320840012609, 0.03776087953492116, 0.03894315859061123], "isController": false}, {"data": ["GET user groups", 53, 0, 0.0, 584.3396226415095, 298, 1007, 565.0, 757.6, 805.2999999999997, 1007.0, 0.08941299525098902, 1.2820085738416378, 0.02925132168855598], "isController": false}, {"data": ["GET user status", 82, 7, 8.536585365853659, 373.0609756097562, 184, 1305, 321.0, 564.0000000000002, 704.2999999999997, 1305.0, 0.1393853784737981, 0.04457217984708404, 0.04627366151790677], "isController": false}, {"data": ["PUT update user profile", 45, 6, 13.333333333333334, 1681.622222222222, 672, 2455, 1652.0, 2014.3999999999999, 2122.4, 2455.0, 0.07602828252109785, 0.04885246131005178, 0.03370785182087737], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 26, 89.65517241379311, 3.350515463917526], "isController": false}, {"data": ["499/Unknown", 3, 10.344827586206897, 0.3865979381443299], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 776, 29, "500/Internal Server Error", 26, "499/Unknown", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST create users", 39, 4, "500/Internal Server Error", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["POST create groups", 39, 4, "500/Internal Server Error", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT update user password", 37, 3, "500/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET user availability", 71, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GET user status", 82, 7, "500/Internal Server Error", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["PUT update user profile", 45, 6, "500/Internal Server Error", 3, "499/Unknown", 3, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
