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

    var data = {"OkPercent": 57.449856733524356, "KoPercent": 42.550143266475644};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5677650429799427, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "POST create groups"], "isController": false}, {"data": [0.01125, 500, 1500, "PUT update user password"], "isController": false}, {"data": [0.9981572481572482, 500, 1500, "POST add child to group"], "isController": false}, {"data": [0.0, 500, 1500, "GET users"], "isController": false}, {"data": [0.9993622448979592, 500, 1500, "GET all children groups"], "isController": false}, {"data": [0.014893617021276596, 500, 1500, "GET user status"], "isController": false}, {"data": [0.010025062656641603, 500, 1500, "POST create users"], "isController": false}, {"data": [0.9993429697766097, 500, 1500, "GET single group"], "isController": false}, {"data": [0.9988584474885844, 500, 1500, "POST add user to group"], "isController": false}, {"data": [0.9870748299319728, 500, 1500, "GET all groups"], "isController": false}, {"data": [0.022172949002217297, 500, 1500, "GET user availability"], "isController": false}, {"data": [0.9812206572769953, 500, 1500, "GET user groups"], "isController": false}, {"data": [0.0, 500, 1500, "PUT update user profile"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6980, 2970, 42.550143266475644, 202.10401146131773, 29, 9849, 145.0, 316.0, 371.9499999999998, 977.799999999992, 11.62837189465828, 20.061108562430032, 4.555429396998948], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST create groups", 400, 398, 99.5, 112.2775, 29, 2074, 87.0, 117.0, 140.74999999999994, 1095.0, 0.6666011175567736, 0.2314258108369344, 0.43086420720712465], "isController": false}, {"data": ["PUT update user password", 400, 389, 97.25, 190.20749999999995, 99, 2164, 143.0, 233.90000000000003, 364.24999999999983, 1150.91, 0.6682146973822689, 0.23786224545196372, 0.2636315798265983], "isController": false}, {"data": ["POST add child to group", 814, 0, 0.0, 136.7923832923833, 70, 608, 119.0, 197.5, 233.5, 387.15000000000043, 1.3562236336130198, 0.42411763980016526, 0.6502986368203053], "isController": false}, {"data": ["GET users", 485, 485, 100.0, 368.78556701030914, 93, 9849, 161.0, 263.80000000000007, 805.6999999999985, 7730.579999999992, 0.8081070633555938, 0.2853042293991016, 0.24622012086615747], "isController": false}, {"data": ["GET all children groups", 784, 0, 0.0, 130.82397959183686, 76, 644, 112.0, 192.0, 232.5, 397.99999999999955, 1.3083609941540961, 0.8064968874275521, 0.45869296572394586], "isController": false}, {"data": ["GET user status", 470, 461, 98.08510638297872, 179.57446808510653, 100, 1438, 146.0, 256.90000000000003, 335.79999999999995, 802.3200000000002, 0.7836729249341381, 0.2747561052497749, 0.26012899860773003], "isController": false}, {"data": ["POST create users", 399, 390, 97.74436090225564, 244.19799498746855, 113, 1674, 197.0, 337.0, 698.0, 1089.0, 0.6647374287156573, 0.23751848488597005, 0.3219171135734718], "isController": false}, {"data": ["GET single group", 761, 0, 0.0, 134.53745072273315, 72, 682, 115.0, 202.80000000000007, 244.4999999999999, 384.41999999999996, 1.269450449729095, 0.7230630532994035, 0.4512499645521392], "isController": false}, {"data": ["POST add user to group", 438, 0, 0.0, 145.30593607305943, 83, 503, 127.5, 215.10000000000002, 282.14999999999986, 360.9100000000004, 0.7316290941162322, 0.22893587064279797, 0.33723528556920074], "isController": false}, {"data": ["GET all groups", 735, 1, 0.1360544217687075, 311.48707482993177, 170, 778, 297.0, 387.4, 451.19999999999993, 568.2399999999998, 1.2261791756405744, 10.197498651828509, 0.353244977357392], "isController": false}, {"data": ["GET user availability", 451, 439, 97.33924611973393, 190.88470066518852, 94, 1636, 145.0, 269.0000000000001, 380.99999999999955, 1142.2800000000002, 0.7540948520903977, 0.26775344212531016, 0.24662747379896602], "isController": false}, {"data": ["GET user groups", 426, 0, 0.0, 325.91314553990594, 217, 685, 312.0, 391.3, 479.2499999999999, 602.1100000000001, 0.7132070543878976, 5.939463320585734, 0.2333245734569782], "isController": false}, {"data": ["PUT update user profile", 417, 407, 97.60191846522781, 228.25659472422038, 104, 4394, 148.0, 250.2, 460.49999999999744, 2124.4999999999995, 0.6964032525538961, 0.2558899672423266, 0.3087569108002625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 2969, 99.96632996632997, 42.53581661891118], "isController": false}, {"data": ["499/Unknown", 1, 0.03367003367003367, 0.014326647564469915], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6980, 2970, "500/Internal Server Error", 2969, "499/Unknown", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST create groups", 400, 398, "500/Internal Server Error", 398, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["PUT update user password", 400, 389, "500/Internal Server Error", 389, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GET users", 485, 485, "500/Internal Server Error", 485, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GET user status", 470, 461, "500/Internal Server Error", 461, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["POST create users", 399, 390, "500/Internal Server Error", 390, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET all groups", 735, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GET user availability", 451, 439, "500/Internal Server Error", 439, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT update user profile", 417, 407, "500/Internal Server Error", 406, "499/Unknown", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
