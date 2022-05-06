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

    var data = {"OkPercent": 59.539602028872416, "KoPercent": 40.460397971127584};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5655481857198595, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04271356783919598, 500, 1500, "POST create groups"], "isController": false}, {"data": [0.06306306306306306, 500, 1500, "PUT update user password"], "isController": false}, {"data": [0.9952830188679245, 500, 1500, "POST add child to group"], "isController": false}, {"data": [0.0, 500, 1500, "GET users"], "isController": false}, {"data": [1.0, 500, 1500, "GET all children groups"], "isController": false}, {"data": [0.13709677419354838, 500, 1500, "GET user status"], "isController": false}, {"data": [1.0, 500, 1500, "GET single group"], "isController": false}, {"data": [0.0678391959798995, 500, 1500, "POST create users"], "isController": false}, {"data": [1.0, 500, 1500, "POST add user to group"], "isController": false}, {"data": [0.9873417721518988, 500, 1500, "GET all groups"], "isController": false}, {"data": [0.1303030303030303, 500, 1500, "GET user availability"], "isController": false}, {"data": [0.9552238805970149, 500, 1500, "GET user groups"], "isController": false}, {"data": [0.02459016393442623, 500, 1500, "PUT update user profile"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2563, 1037, 40.460397971127584, 392.40928599297735, 39, 16493, 199.0, 425.5999999999999, 801.0, 6015.720000000153, 4.269780846792666, 6.4137200080381165, 1.7062532407561661], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST create groups", 199, 181, 90.95477386934674, 191.62814070351772, 39, 2175, 107.0, 476.0, 909.0, 1774.0, 0.3316141610911606, 0.12131054510119231, 0.21434594470458843], "isController": false}, {"data": ["PUT update user password", 111, 96, 86.48648648648648, 303.7657657657657, 130, 2266, 195.0, 778.4, 878.8, 2171.6799999999967, 0.19321249719319683, 0.06791096983535162, 0.07622836803325345], "isController": false}, {"data": ["POST add child to group", 318, 0, 0.0, 199.5597484276729, 96, 721, 173.0, 318.20000000000005, 342.1, 498.6100000000002, 0.5298692989062699, 0.1659258684941048, 0.25406818922165864], "isController": false}, {"data": ["GET users", 200, 196, 98.0, 1861.5449999999998, 120, 16493, 256.5, 9775.000000000004, 12787.55, 16280.42000000001, 0.3333761166016306, 0.17318791588670546, 0.10157553552705931], "isController": false}, {"data": ["GET all children groups", 285, 0, 0.0, 160.40701754385964, 90, 418, 145.0, 230.2000000000001, 310.19999999999993, 375.2999999999994, 0.47587402195365486, 0.29347847525789034, 0.16683474011851768], "isController": false}, {"data": ["GET user status", 186, 157, 84.40860215053763, 238.43548387096783, 125, 1153, 179.0, 385.1000000000002, 668.8500000000004, 1099.0599999999997, 0.31687405448870837, 0.10956764260184264, 0.10517382341341501], "isController": false}, {"data": ["GET single group", 260, 0, 0.0, 175.51153846153866, 94, 418, 162.0, 241.50000000000003, 305.5999999999999, 382.39, 0.4358160319956016, 0.2483958224728537, 0.15491898012343652], "isController": false}, {"data": ["POST create users", 199, 161, 80.90452261306532, 496.6984924623115, 173, 2928, 314.0, 897.0, 1622.0, 2926.0, 0.33152024522502566, 0.11687383645140063, 0.16055246172523802], "isController": false}, {"data": ["POST add user to group", 147, 0, 0.0, 176.29251700680277, 108, 400, 165.0, 250.20000000000002, 292.4, 382.72000000000037, 0.25224099825662005, 0.07900126131223661, 0.11626733513391081], "isController": false}, {"data": ["GET all groups", 237, 0, 0.0, 345.03375527426164, 228, 640, 330.0, 430.20000000000005, 478.1, 580.0400000000002, 0.39638669278024286, 3.100666500913195, 0.11419343200212076], "isController": false}, {"data": ["GET user availability", 165, 140, 84.84848484848484, 288.81818181818176, 121, 1626, 203.0, 518.6000000000007, 883.8999999999992, 1625.34, 0.2836674592163557, 0.09926850059828045, 0.09276275128209095], "isController": false}, {"data": ["GET user groups", 134, 0, 0.0, 384.8507462686566, 234, 1161, 349.0, 474.0, 622.0, 1143.1500000000003, 0.23068765580024514, 1.8414108847345028, 0.07546910614558802], "isController": false}, {"data": ["PUT update user profile", 122, 106, 86.88524590163935, 464.50819672131166, 126, 3136, 193.5, 1463.5, 1802.35, 3051.5899999999983, 0.21063899583901655, 0.08446433542965175, 0.09338877354581397], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1036, 99.90356798457088, 40.42138119391338], "isController": false}, {"data": ["499/Unknown", 1, 0.09643201542912247, 0.03901677721420211], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2563, 1037, "500/Internal Server Error", 1036, "499/Unknown", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST create groups", 199, 181, "500/Internal Server Error", 181, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["PUT update user password", 111, 96, "500/Internal Server Error", 96, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GET users", 200, 196, "500/Internal Server Error", 196, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GET user status", 186, 157, "500/Internal Server Error", 157, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["POST create users", 199, 161, "500/Internal Server Error", 161, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET user availability", 165, 140, "500/Internal Server Error", 140, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT update user profile", 122, 106, "500/Internal Server Error", 105, "499/Unknown", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
