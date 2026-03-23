const url = "https://opensheet.elk.sh/1Da5Vi3Wssu5X3jp12171OYQtU8yVPojXyi7pQNXD9AU/Sheet1";

let chart;

function load(){

fetch(url)
.then(res => res.json())
.then(data => {

let table = document.getElementById("table-body");
table.innerHTML = "";

let latest = {};
let temps = [];
let times = [];

data.slice(-50).forEach(row => {

let cls = row.Status === "CRITICAL" ? "critical" : "normal";

table.innerHTML += `
<tr>
<td>${row.Time}</td>
<td>${row.Sensor}</td>
<td>${row.Value}</td>
<td class="${cls}">${row.Status}</td>
</tr>
`;

latest[row.Sensor] = row.Value;

// Graph data
if(row.Sensor.includes("DHT")){
temps.push(row.Value);
times.push(row.Time);
}

});

// Update cards
if(latest["DHT1"]) document.getElementById("dht1").innerText = "DHT1: " + latest["DHT1"] + "°C";
if(latest["DHT2"]) document.getElementById("dht2").innerText = "DHT2: " + latest["DHT2"] + "°C";
if(latest["DHT3"]) document.getElementById("dht3").innerText = "DHT3: " + latest["DHT3"] + "°C";
if(latest["DHT4"]) document.getElementById("dht4").innerText = "DHT4: " + latest["DHT4"] + "°C";
if(latest["MQ"]) document.getElementById("mq").innerText = "MQ: " + latest["MQ"];

// Draw graph
drawChart(times, temps);

});

}

function drawChart(times, temps){

const ctx = document.getElementById("tempChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"line",
data:{
labels:times,
datasets:[{
label:"Temperature Sensors",
data:temps,
borderColor:"red",
fill:false
}]
}
});

}

load();
setInterval(load,10000);
