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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 20.0, "minX": 0.0, "maxY": 51239.0, "series": [{"data": [[0.0, 20.0], [0.1, 20.0], [0.2, 20.0], [0.3, 20.0], [0.4, 20.0], [0.5, 20.0], [0.6, 20.0], [0.7, 20.0], [0.8, 20.0], [0.9, 20.0], [1.0, 20.0], [1.1, 20.0], [1.2, 20.0], [1.3, 20.0], [1.4, 20.0], [1.5, 20.0], [1.6, 20.0], [1.7, 20.0], [1.8, 20.0], [1.9, 20.0], [2.0, 20.0], [2.1, 20.0], [2.2, 20.0], [2.3, 20.0], [2.4, 20.0], [2.5, 20.0], [2.6, 20.0], [2.7, 20.0], [2.8, 20.0], [2.9, 20.0], [3.0, 20.0], [3.1, 20.0], [3.2, 20.0], [3.3, 20.0], [3.4, 20.0], [3.5, 21.0], [3.6, 21.0], [3.7, 21.0], [3.8, 21.0], [3.9, 21.0], [4.0, 21.0], [4.1, 21.0], [4.2, 21.0], [4.3, 21.0], [4.4, 21.0], [4.5, 21.0], [4.6, 21.0], [4.7, 22.0], [4.8, 22.0], [4.9, 22.0], [5.0, 22.0], [5.1, 22.0], [5.2, 22.0], [5.3, 22.0], [5.4, 22.0], [5.5, 22.0], [5.6, 22.0], [5.7, 22.0], [5.8, 22.0], [5.9, 23.0], [6.0, 23.0], [6.1, 23.0], [6.2, 23.0], [6.3, 23.0], [6.4, 23.0], [6.5, 23.0], [6.6, 23.0], [6.7, 23.0], [6.8, 23.0], [6.9, 23.0], [7.0, 24.0], [7.1, 24.0], [7.2, 24.0], [7.3, 24.0], [7.4, 24.0], [7.5, 24.0], [7.6, 24.0], [7.7, 24.0], [7.8, 24.0], [7.9, 24.0], [8.0, 24.0], [8.1, 24.0], [8.2, 25.0], [8.3, 25.0], [8.4, 25.0], [8.5, 25.0], [8.6, 25.0], [8.7, 25.0], [8.8, 25.0], [8.9, 25.0], [9.0, 25.0], [9.1, 25.0], [9.2, 25.0], [9.3, 25.0], [9.4, 25.0], [9.5, 25.0], [9.6, 25.0], [9.7, 25.0], [9.8, 25.0], [9.9, 25.0], [10.0, 25.0], [10.1, 25.0], [10.2, 25.0], [10.3, 25.0], [10.4, 25.0], [10.5, 26.0], [10.6, 26.0], [10.7, 26.0], [10.8, 26.0], [10.9, 26.0], [11.0, 26.0], [11.1, 26.0], [11.2, 26.0], [11.3, 26.0], [11.4, 26.0], [11.5, 26.0], [11.6, 26.0], [11.7, 26.0], [11.8, 26.0], [11.9, 26.0], [12.0, 26.0], [12.1, 26.0], [12.2, 26.0], [12.3, 26.0], [12.4, 26.0], [12.5, 26.0], [12.6, 26.0], [12.7, 26.0], [12.8, 26.0], [12.9, 26.0], [13.0, 26.0], [13.1, 26.0], [13.2, 26.0], [13.3, 26.0], [13.4, 26.0], [13.5, 26.0], [13.6, 26.0], [13.7, 26.0], [13.8, 26.0], [13.9, 26.0], [14.0, 27.0], [14.1, 27.0], [14.2, 27.0], [14.3, 27.0], [14.4, 27.0], [14.5, 27.0], [14.6, 27.0], [14.7, 27.0], [14.8, 27.0], [14.9, 27.0], [15.0, 27.0], [15.1, 27.0], [15.2, 27.0], [15.3, 27.0], [15.4, 27.0], [15.5, 27.0], [15.6, 27.0], [15.7, 27.0], [15.8, 27.0], [15.9, 27.0], [16.0, 27.0], [16.1, 27.0], [16.2, 27.0], [16.3, 27.0], [16.4, 27.0], [16.5, 27.0], [16.6, 27.0], [16.7, 27.0], [16.8, 27.0], [16.9, 27.0], [17.0, 27.0], [17.1, 27.0], [17.2, 27.0], [17.3, 27.0], [17.4, 27.0], [17.5, 27.0], [17.6, 27.0], [17.7, 27.0], [17.8, 27.0], [17.9, 27.0], [18.0, 27.0], [18.1, 27.0], [18.2, 27.0], [18.3, 27.0], [18.4, 27.0], [18.5, 27.0], [18.6, 27.0], [18.7, 27.0], [18.8, 27.0], [18.9, 27.0], [19.0, 27.0], [19.1, 27.0], [19.2, 27.0], [19.3, 27.0], [19.4, 27.0], [19.5, 27.0], [19.6, 27.0], [19.7, 27.0], [19.8, 27.0], [19.9, 27.0], [20.0, 27.0], [20.1, 27.0], [20.2, 27.0], [20.3, 27.0], [20.4, 27.0], [20.5, 27.0], [20.6, 27.0], [20.7, 27.0], [20.8, 27.0], [20.9, 27.0], [21.0, 29.0], [21.1, 29.0], [21.2, 29.0], [21.3, 29.0], [21.4, 29.0], [21.5, 29.0], [21.6, 29.0], [21.7, 29.0], [21.8, 29.0], [21.9, 29.0], [22.0, 29.0], [22.1, 30.0], [22.2, 30.0], [22.3, 30.0], [22.4, 30.0], [22.5, 30.0], [22.6, 30.0], [22.7, 30.0], [22.8, 30.0], [22.9, 30.0], [23.0, 30.0], [23.1, 30.0], [23.2, 30.0], [23.3, 30.0], [23.4, 30.0], [23.5, 30.0], [23.6, 30.0], [23.7, 30.0], [23.8, 30.0], [23.9, 30.0], [24.0, 30.0], [24.1, 30.0], [24.2, 30.0], [24.3, 30.0], [24.4, 30.0], [24.5, 30.0], [24.6, 30.0], [24.7, 30.0], [24.8, 30.0], [24.9, 30.0], [25.0, 30.0], [25.1, 30.0], [25.2, 30.0], [25.3, 30.0], [25.4, 30.0], [25.5, 30.0], [25.6, 30.0], [25.7, 30.0], [25.8, 30.0], [25.9, 30.0], [26.0, 30.0], [26.1, 30.0], [26.2, 30.0], [26.3, 30.0], [26.4, 30.0], [26.5, 30.0], [26.6, 30.0], [26.7, 30.0], [26.8, 30.0], [26.9, 30.0], [27.0, 30.0], [27.1, 30.0], [27.2, 30.0], [27.3, 30.0], [27.4, 30.0], [27.5, 30.0], [27.6, 30.0], [27.7, 30.0], [27.8, 30.0], [27.9, 30.0], [28.0, 30.0], [28.1, 30.0], [28.2, 30.0], [28.3, 30.0], [28.4, 30.0], [28.5, 30.0], [28.6, 30.0], [28.7, 30.0], [28.8, 30.0], [28.9, 30.0], [29.0, 30.0], [29.1, 31.0], [29.2, 31.0], [29.3, 31.0], [29.4, 31.0], [29.5, 31.0], [29.6, 31.0], [29.7, 31.0], [29.8, 31.0], [29.9, 31.0], [30.0, 31.0], [30.1, 31.0], [30.2, 31.0], [30.3, 31.0], [30.4, 31.0], [30.5, 31.0], [30.6, 31.0], [30.7, 31.0], [30.8, 31.0], [30.9, 31.0], [31.0, 31.0], [31.1, 31.0], [31.2, 31.0], [31.3, 31.0], [31.4, 31.0], [31.5, 31.0], [31.6, 31.0], [31.7, 31.0], [31.8, 31.0], [31.9, 31.0], [32.0, 31.0], [32.1, 31.0], [32.2, 31.0], [32.3, 31.0], [32.4, 31.0], [32.5, 31.0], [32.6, 31.0], [32.7, 31.0], [32.8, 31.0], [32.9, 31.0], [33.0, 31.0], [33.1, 31.0], [33.2, 31.0], [33.3, 31.0], [33.4, 31.0], [33.5, 31.0], [33.6, 31.0], [33.7, 31.0], [33.8, 31.0], [33.9, 31.0], [34.0, 31.0], [34.1, 31.0], [34.2, 31.0], [34.3, 31.0], [34.4, 31.0], [34.5, 31.0], [34.6, 31.0], [34.7, 31.0], [34.8, 31.0], [34.9, 32.0], [35.0, 32.0], [35.1, 32.0], [35.2, 32.0], [35.3, 32.0], [35.4, 32.0], [35.5, 32.0], [35.6, 32.0], [35.7, 32.0], [35.8, 32.0], [35.9, 32.0], [36.0, 32.0], [36.1, 32.0], [36.2, 32.0], [36.3, 32.0], [36.4, 32.0], [36.5, 32.0], [36.6, 32.0], [36.7, 32.0], [36.8, 32.0], [36.9, 32.0], [37.0, 32.0], [37.1, 32.0], [37.2, 32.0], [37.3, 33.0], [37.4, 33.0], [37.5, 33.0], [37.6, 33.0], [37.7, 33.0], [37.8, 33.0], [37.9, 33.0], [38.0, 33.0], [38.1, 33.0], [38.2, 33.0], [38.3, 33.0], [38.4, 33.0], [38.5, 33.0], [38.6, 33.0], [38.7, 33.0], [38.8, 33.0], [38.9, 33.0], [39.0, 33.0], [39.1, 33.0], [39.2, 33.0], [39.3, 33.0], [39.4, 33.0], [39.5, 33.0], [39.6, 33.0], [39.7, 33.0], [39.8, 33.0], [39.9, 33.0], [40.0, 33.0], [40.1, 33.0], [40.2, 33.0], [40.3, 33.0], [40.4, 33.0], [40.5, 33.0], [40.6, 33.0], [40.7, 34.0], [40.8, 34.0], [40.9, 34.0], [41.0, 34.0], [41.1, 34.0], [41.2, 34.0], [41.3, 34.0], [41.4, 34.0], [41.5, 34.0], [41.6, 34.0], [41.7, 34.0], [41.8, 34.0], [41.9, 35.0], [42.0, 35.0], [42.1, 35.0], [42.2, 35.0], [42.3, 35.0], [42.4, 35.0], [42.5, 35.0], [42.6, 35.0], [42.7, 35.0], [42.8, 35.0], [42.9, 35.0], [43.0, 35.0], [43.1, 35.0], [43.2, 35.0], [43.3, 35.0], [43.4, 35.0], [43.5, 35.0], [43.6, 35.0], [43.7, 35.0], [43.8, 35.0], [43.9, 35.0], [44.0, 35.0], [44.1, 35.0], [44.2, 36.0], [44.3, 36.0], [44.4, 36.0], [44.5, 36.0], [44.6, 36.0], [44.7, 36.0], [44.8, 36.0], [44.9, 36.0], [45.0, 36.0], [45.1, 36.0], [45.2, 36.0], [45.3, 36.0], [45.4, 36.0], [45.5, 36.0], [45.6, 36.0], [45.7, 36.0], [45.8, 36.0], [45.9, 36.0], [46.0, 36.0], [46.1, 36.0], [46.2, 36.0], [46.3, 36.0], [46.4, 36.0], [46.5, 36.0], [46.6, 37.0], [46.7, 37.0], [46.8, 37.0], [46.9, 37.0], [47.0, 37.0], [47.1, 37.0], [47.2, 37.0], [47.3, 37.0], [47.4, 37.0], [47.5, 37.0], [47.6, 37.0], [47.7, 38.0], [47.8, 38.0], [47.9, 38.0], [48.0, 38.0], [48.1, 38.0], [48.2, 38.0], [48.3, 38.0], [48.4, 38.0], [48.5, 38.0], [48.6, 38.0], [48.7, 38.0], [48.8, 38.0], [48.9, 43.0], [49.0, 43.0], [49.1, 43.0], [49.2, 43.0], [49.3, 43.0], [49.4, 43.0], [49.5, 43.0], [49.6, 43.0], [49.7, 43.0], [49.8, 43.0], [49.9, 43.0], [50.0, 44.0], [50.1, 44.0], [50.2, 44.0], [50.3, 44.0], [50.4, 44.0], [50.5, 44.0], [50.6, 44.0], [50.7, 44.0], [50.8, 44.0], [50.9, 44.0], [51.0, 44.0], [51.1, 44.0], [51.2, 46.0], [51.3, 46.0], [51.4, 46.0], [51.5, 46.0], [51.6, 46.0], [51.7, 46.0], [51.8, 46.0], [51.9, 46.0], [52.0, 46.0], [52.1, 46.0], [52.2, 46.0], [52.3, 46.0], [52.4, 46.0], [52.5, 46.0], [52.6, 46.0], [52.7, 46.0], [52.8, 46.0], [52.9, 46.0], [53.0, 46.0], [53.1, 46.0], [53.2, 46.0], [53.3, 46.0], [53.4, 46.0], [53.5, 48.0], [53.6, 48.0], [53.7, 48.0], [53.8, 48.0], [53.9, 48.0], [54.0, 48.0], [54.1, 48.0], [54.2, 48.0], [54.3, 48.0], [54.4, 48.0], [54.5, 48.0], [54.6, 48.0], [54.7, 50.0], [54.8, 50.0], [54.9, 50.0], [55.0, 50.0], [55.1, 50.0], [55.2, 50.0], [55.3, 50.0], [55.4, 50.0], [55.5, 50.0], [55.6, 50.0], [55.7, 50.0], [55.8, 50.0], [55.9, 51.0], [56.0, 51.0], [56.1, 51.0], [56.2, 51.0], [56.3, 51.0], [56.4, 51.0], [56.5, 51.0], [56.6, 51.0], [56.7, 51.0], [56.8, 51.0], [56.9, 51.0], [57.0, 52.0], [57.1, 52.0], [57.2, 52.0], [57.3, 52.0], [57.4, 52.0], [57.5, 52.0], [57.6, 52.0], [57.7, 52.0], [57.8, 52.0], [57.9, 52.0], [58.0, 52.0], [58.1, 52.0], [58.2, 53.0], [58.3, 53.0], [58.4, 53.0], [58.5, 53.0], [58.6, 53.0], [58.7, 53.0], [58.8, 53.0], [58.9, 53.0], [59.0, 53.0], [59.1, 53.0], [59.2, 53.0], [59.3, 53.0], [59.4, 54.0], [59.5, 54.0], [59.6, 54.0], [59.7, 54.0], [59.8, 54.0], [59.9, 54.0], [60.0, 54.0], [60.1, 54.0], [60.2, 54.0], [60.3, 54.0], [60.4, 54.0], [60.5, 54.0], [60.6, 54.0], [60.7, 54.0], [60.8, 54.0], [60.9, 54.0], [61.0, 54.0], [61.1, 54.0], [61.2, 54.0], [61.3, 54.0], [61.4, 54.0], [61.5, 54.0], [61.6, 54.0], [61.7, 56.0], [61.8, 56.0], [61.9, 56.0], [62.0, 56.0], [62.1, 56.0], [62.2, 56.0], [62.3, 56.0], [62.4, 56.0], [62.5, 56.0], [62.6, 56.0], [62.7, 56.0], [62.8, 57.0], [62.9, 57.0], [63.0, 57.0], [63.1, 57.0], [63.2, 57.0], [63.3, 57.0], [63.4, 57.0], [63.5, 57.0], [63.6, 57.0], [63.7, 57.0], [63.8, 57.0], [63.9, 57.0], [64.0, 72.0], [64.1, 72.0], [64.2, 72.0], [64.3, 72.0], [64.4, 72.0], [64.5, 72.0], [64.6, 72.0], [64.7, 72.0], [64.8, 72.0], [64.9, 72.0], [65.0, 72.0], [65.1, 72.0], [65.2, 74.0], [65.3, 74.0], [65.4, 74.0], [65.5, 74.0], [65.6, 74.0], [65.7, 74.0], [65.8, 74.0], [65.9, 74.0], [66.0, 74.0], [66.1, 74.0], [66.2, 74.0], [66.3, 92.0], [66.4, 92.0], [66.5, 92.0], [66.6, 92.0], [66.7, 92.0], [66.8, 92.0], [66.9, 92.0], [67.0, 92.0], [67.1, 92.0], [67.2, 92.0], [67.3, 92.0], [67.4, 92.0], [67.5, 168.0], [67.6, 168.0], [67.7, 168.0], [67.8, 168.0], [67.9, 168.0], [68.0, 168.0], [68.1, 168.0], [68.2, 168.0], [68.3, 168.0], [68.4, 168.0], [68.5, 168.0], [68.6, 168.0], [68.7, 172.0], [68.8, 172.0], [68.9, 172.0], [69.0, 172.0], [69.1, 172.0], [69.2, 172.0], [69.3, 172.0], [69.4, 172.0], [69.5, 172.0], [69.6, 172.0], [69.7, 172.0], [69.8, 183.0], [69.9, 183.0], [70.0, 183.0], [70.1, 183.0], [70.2, 183.0], [70.3, 183.0], [70.4, 183.0], [70.5, 183.0], [70.6, 183.0], [70.7, 183.0], [70.8, 183.0], [70.9, 183.0], [71.0, 186.0], [71.1, 186.0], [71.2, 186.0], [71.3, 186.0], [71.4, 186.0], [71.5, 186.0], [71.6, 186.0], [71.7, 186.0], [71.8, 186.0], [71.9, 186.0], [72.0, 186.0], [72.1, 193.0], [72.2, 193.0], [72.3, 193.0], [72.4, 193.0], [72.5, 193.0], [72.6, 193.0], [72.7, 193.0], [72.8, 193.0], [72.9, 193.0], [73.0, 193.0], [73.1, 193.0], [73.2, 193.0], [73.3, 217.0], [73.4, 217.0], [73.5, 217.0], [73.6, 217.0], [73.7, 217.0], [73.8, 217.0], [73.9, 217.0], [74.0, 217.0], [74.1, 217.0], [74.2, 217.0], [74.3, 217.0], [74.4, 217.0], [74.5, 247.0], [74.6, 247.0], [74.7, 247.0], [74.8, 247.0], [74.9, 247.0], [75.0, 247.0], [75.1, 247.0], [75.2, 247.0], [75.3, 247.0], [75.4, 247.0], [75.5, 247.0], [75.6, 543.0], [75.7, 543.0], [75.8, 543.0], [75.9, 543.0], [76.0, 543.0], [76.1, 543.0], [76.2, 543.0], [76.3, 543.0], [76.4, 543.0], [76.5, 543.0], [76.6, 543.0], [76.7, 543.0], [76.8, 27942.0], [76.9, 27942.0], [77.0, 27942.0], [77.1, 27942.0], [77.2, 27942.0], [77.3, 27942.0], [77.4, 27942.0], [77.5, 27942.0], [77.6, 27942.0], [77.7, 27942.0], [77.8, 27942.0], [77.9, 27942.0], [78.0, 28959.0], [78.1, 28959.0], [78.2, 28959.0], [78.3, 28959.0], [78.4, 28959.0], [78.5, 28959.0], [78.6, 28959.0], [78.7, 28959.0], [78.8, 28959.0], [78.9, 28959.0], [79.0, 28959.0], [79.1, 31307.0], [79.2, 31307.0], [79.3, 31307.0], [79.4, 31307.0], [79.5, 31307.0], [79.6, 31307.0], [79.7, 31307.0], [79.8, 31307.0], [79.9, 31307.0], [80.0, 31307.0], [80.1, 31307.0], [80.2, 31307.0], [80.3, 32462.0], [80.4, 32462.0], [80.5, 32462.0], [80.6, 32462.0], [80.7, 32462.0], [80.8, 32462.0], [80.9, 32462.0], [81.0, 32462.0], [81.1, 32462.0], [81.2, 32462.0], [81.3, 32462.0], [81.4, 34509.0], [81.5, 34509.0], [81.6, 34509.0], [81.7, 34509.0], [81.8, 34509.0], [81.9, 34509.0], [82.0, 34509.0], [82.1, 34509.0], [82.2, 34509.0], [82.3, 34509.0], [82.4, 34509.0], [82.5, 34509.0], [82.6, 41908.0], [82.7, 41908.0], [82.8, 41908.0], [82.9, 41908.0], [83.0, 41908.0], [83.1, 41908.0], [83.2, 41908.0], [83.3, 41908.0], [83.4, 41908.0], [83.5, 41908.0], [83.6, 41908.0], [83.7, 41908.0], [83.8, 42409.0], [83.9, 42409.0], [84.0, 42409.0], [84.1, 42409.0], [84.2, 42409.0], [84.3, 42409.0], [84.4, 42409.0], [84.5, 42409.0], [84.6, 42409.0], [84.7, 42409.0], [84.8, 42409.0], [84.9, 42907.0], [85.0, 42907.0], [85.1, 42907.0], [85.2, 42907.0], [85.3, 42907.0], [85.4, 42907.0], [85.5, 42907.0], [85.6, 42907.0], [85.7, 42907.0], [85.8, 42907.0], [85.9, 42907.0], [86.0, 42907.0], [86.1, 43406.0], [86.2, 43406.0], [86.3, 43406.0], [86.4, 43406.0], [86.5, 43406.0], [86.6, 43406.0], [86.7, 43406.0], [86.8, 43406.0], [86.9, 43406.0], [87.0, 43406.0], [87.1, 43406.0], [87.2, 43406.0], [87.3, 43908.0], [87.4, 43908.0], [87.5, 43908.0], [87.6, 43908.0], [87.7, 43908.0], [87.8, 43908.0], [87.9, 43908.0], [88.0, 43908.0], [88.1, 43908.0], [88.2, 43908.0], [88.3, 43908.0], [88.4, 44409.0], [88.5, 44409.0], [88.6, 44409.0], [88.7, 44409.0], [88.8, 44409.0], [88.9, 44409.0], [89.0, 44409.0], [89.1, 44409.0], [89.2, 44409.0], [89.3, 44409.0], [89.4, 44409.0], [89.5, 44409.0], [89.6, 44919.0], [89.7, 44919.0], [89.8, 44919.0], [89.9, 44919.0], [90.0, 44919.0], [90.1, 44919.0], [90.2, 44919.0], [90.3, 44919.0], [90.4, 44919.0], [90.5, 44919.0], [90.6, 44919.0], [90.7, 45405.0], [90.8, 45405.0], [90.9, 45405.0], [91.0, 45405.0], [91.1, 45405.0], [91.2, 45405.0], [91.3, 45405.0], [91.4, 45405.0], [91.5, 45405.0], [91.6, 45405.0], [91.7, 45405.0], [91.8, 45405.0], [91.9, 45906.0], [92.0, 45906.0], [92.1, 45906.0], [92.2, 45906.0], [92.3, 45906.0], [92.4, 45906.0], [92.5, 45906.0], [92.6, 45906.0], [92.7, 45906.0], [92.8, 45906.0], [92.9, 45906.0], [93.0, 45906.0], [93.1, 46407.0], [93.2, 46407.0], [93.3, 46407.0], [93.4, 46407.0], [93.5, 46407.0], [93.6, 46407.0], [93.7, 46407.0], [93.8, 46407.0], [93.9, 46407.0], [94.0, 46407.0], [94.1, 46407.0], [94.2, 46927.0], [94.3, 46927.0], [94.4, 46927.0], [94.5, 46927.0], [94.6, 46927.0], [94.7, 46927.0], [94.8, 46927.0], [94.9, 46927.0], [95.0, 46927.0], [95.1, 46927.0], [95.2, 46927.0], [95.3, 46927.0], [95.4, 47401.0], [95.5, 47401.0], [95.6, 47401.0], [95.7, 47401.0], [95.8, 47401.0], [95.9, 47401.0], [96.0, 47401.0], [96.1, 47401.0], [96.2, 47401.0], [96.3, 47401.0], [96.4, 47401.0], [96.5, 47401.0], [96.6, 47912.0], [96.7, 47912.0], [96.8, 47912.0], [96.9, 47912.0], [97.0, 47912.0], [97.1, 47912.0], [97.2, 47912.0], [97.3, 47912.0], [97.4, 47912.0], [97.5, 47912.0], [97.6, 47912.0], [97.7, 49898.0], [97.8, 49898.0], [97.9, 49898.0], [98.0, 49898.0], [98.1, 49898.0], [98.2, 49898.0], [98.3, 49898.0], [98.4, 49898.0], [98.5, 49898.0], [98.6, 49898.0], [98.7, 49898.0], [98.8, 49898.0], [98.9, 51239.0], [99.0, 51239.0], [99.1, 51239.0], [99.2, 51239.0], [99.3, 51239.0], [99.4, 51239.0], [99.5, 51239.0], [99.6, 51239.0], [99.7, 51239.0], [99.8, 51239.0], [99.9, 51239.0], [100.0, 51239.0]], "isOverall": false, "label": "getData Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 58.0, "series": [{"data": [[0.0, 58.0], [34500.0, 1.0], [42400.0, 1.0], [41900.0, 1.0], [42900.0, 1.0], [43400.0, 1.0], [44900.0, 1.0], [43900.0, 1.0], [44400.0, 1.0], [46400.0, 1.0], [45400.0, 1.0], [45900.0, 1.0], [46900.0, 1.0], [47900.0, 1.0], [47400.0, 1.0], [49800.0, 1.0], [200.0, 2.0], [51200.0, 1.0], [100.0, 5.0], [27900.0, 1.0], [28900.0, 1.0], [31300.0, 1.0], [500.0, 1.0], [32400.0, 1.0]], "isOverall": false, "label": "getData Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 51200.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 65.0, "series": [{"data": [[0.0, 65.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 1.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 20.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 8.393939393939396, "minX": 1.6466829E12, "maxY": 15.600000000000003, "series": [{"data": [[1.6466829E12, 8.393939393939396]], "isOverall": false, "label": "getHistory", "isController": false}, {"data": [[1.64668296E12, 15.600000000000003]], "isOverall": false, "label": "getData", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.64668296E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 25.333333333333336, "minX": 4.0, "maxY": 49083.0, "series": [{"data": [[8.0, 177.5], [10.0, 45.25], [12.0, 35.5], [13.0, 49083.0], [14.0, 45.2], [15.0, 45138.076923076915], [4.0, 273.6666666666667], [16.0, 8656.0], [17.0, 31307.0], [18.0, 16246.0], [19.0, 56.5], [20.0, 9501.666666666666], [21.0, 30.0], [22.0, 27.8], [23.0, 50.0], [6.0, 181.33333333333334], [24.0, 28.0], [25.0, 39.0], [26.0, 25.333333333333336], [27.0, 26.0], [28.0, 29.571428571428573], [29.0, 72.0], [30.0, 31.8]], "isOverall": false, "label": "getData Request", "isController": false}, {"data": [[18.674418604651162, 9815.802325581395]], "isOverall": false, "label": "getData Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 30.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 115.0, "minX": 1.6466829E12, "maxY": 191652.06666666668, "series": [{"data": [[1.64668296E12, 160.5], [1.6466829E12, 191652.06666666668]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.64668296E12, 115.0], [1.6466829E12, 211.2]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.64668296E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 60.89393939393942, "minX": 1.6466829E12, "maxY": 42007.00000000001, "series": [{"data": [[1.64668296E12, 42007.00000000001], [1.6466829E12, 60.89393939393942]], "isOverall": false, "label": "getData Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.64668296E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 55.00000000000001, "minX": 1.6466829E12, "maxY": 42004.05, "series": [{"data": [[1.64668296E12, 42004.05], [1.6466829E12, 55.00000000000001]], "isOverall": false, "label": "getData Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.64668296E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 2.363636363636363, "minX": 1.6466829E12, "maxY": 7.6499999999999995, "series": [{"data": [[1.64668296E12, 7.6499999999999995], [1.6466829E12, 2.363636363636363]], "isOverall": false, "label": "getData Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.64668296E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 20.0, "minX": 1.6466829E12, "maxY": 543.0, "series": [{"data": [[1.6466829E12, 543.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.6466829E12, 175.30000000000004]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.6466829E12, 543.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.6466829E12, 208.59999999999997]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.6466829E12, 20.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.6466829E12, 33.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6466829E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 30.5, "minX": 1.0, "maxY": 45405.0, "series": [{"data": [[5.0, 46.0], [10.0, 30.5], [6.0, 184.5], [7.0, 32.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[2.0, 30133.0], [1.0, 34509.0], [15.0, 45405.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 15.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 24.5, "minX": 1.0, "maxY": 45403.0, "series": [{"data": [[5.0, 40.0], [10.0, 24.5], [6.0, 172.5], [7.0, 27.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[2.0, 30131.0], [1.0, 34507.0], [15.0, 45403.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 15.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 1.4333333333333333, "minX": 1.6466829E12, "maxY": 1.4333333333333333, "series": [{"data": [[1.6466829E12, 1.4333333333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6466829E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 0.3333333333333333, "minX": 1.6466829E12, "maxY": 1.1, "series": [{"data": [[1.6466829E12, 1.1]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.64668296E12, 0.3333333333333333]], "isOverall": false, "label": "500", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.64668296E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 0.3333333333333333, "minX": 1.6466829E12, "maxY": 1.1, "series": [{"data": [[1.6466829E12, 1.1]], "isOverall": false, "label": "getData Request-success", "isController": false}, {"data": [[1.64668296E12, 0.3333333333333333]], "isOverall": false, "label": "getData Request-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.64668296E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 0.3333333333333333, "minX": 1.6466829E12, "maxY": 1.1, "series": [{"data": [[1.6466829E12, 1.1]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.64668296E12, 0.3333333333333333]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.64668296E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

