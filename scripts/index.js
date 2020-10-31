var mymap = L.map('mapid').setView([51.505, -0.09], 13);

var app = new Vue({
    el: '#app',
    data: { 
        isDMS: false,

        d1: "",
        m1: "",
        s1: "",
        d1: "",
        m1: "",
        s1: "",

        lat1: "51.5",
        lon1: "-0.1",
        lat2: "51.5",
        lon2: "-0.0",
    },

    methods: {
        blurHandler(e){
            this.lat1 = parseFloat(this.lat1).toFixed(4);
            this.lat2 = parseFloat(this.lat2).toFixed(4);
            this.lon1 = parseFloat(this.lon1).toFixed(4);
            this.lon2 = parseFloat(this.lon2).toFixed(4);
            marker1.setLatLng(L.latLng(this.lat1, this.lon1));
            marker2.setLatLng(L.latLng(this.lat2, this.lon2));
        }
    }
  });

function dms2deg(d,m,s){
    return d + (parseFloat(m)/60) + (parseFloat(s)/3600);
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


let p1 = {
    "lat": 51.5, "lon": -0.1, "h": 187.275
};
let p2 = {
    "lat": 51.5, "lon": -0.2, "h": 292.285
};

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}); 

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}); 

let marker1 = L.marker([parseFloat(app.lat1).toFixed(4), parseFloat(app.lon1).toFixed(4)], {icon: greenIcon}).addTo(mymap);
let marker2 = L.marker([parseFloat(app.lat2).toFixed(4), parseFloat(app.lon2).toFixed(4)], {icon: redIcon}).addTo(mymap);

let method = "mean";
let coords = "latlon";

let selecting = 1;

function changeSelection(n){
    selecting = n;
}

function selectPoint(point){
    console.log(point);
    if(selecting == 1){
        marker1.setLatLng(point);
        app.lat1 = point['lat'].toFixed(4);
        app.lon1 = point['lng'].toFixed(4);

    } else {
        marker2.setLatLng(point);
        app.lat2 = point['lat'].toFixed(4);
        app.lon2 = point['lng'].toFixed(4);
    }

    //p1_lat.innerText = p1["lat"];
    //p1_lon.innerText = p1["lon"];
    //p2_lat.innerText = p2["lat"];
    //p2_lon.innerText = p2["lon"];
}

let response_dom = document.getElementById("response");

//let p1_lat = document.getElementById("lat1");
//let p1_lon = document.getElementById("lon1");

//let p2_lat = document.getElementById("lat2");
//let p2_lon = document.getElementById("lon2");

//p1_lat.innerText = p1["lat"];
//p1_lon.innerText = p1["lon"];
//p2_lat.innerText = p2["lat"];
//p2_lon.innerText = p2["lon"];

function calculateDistance(){
    let url = "http://juanpduque.pythonanywhere.com/calculator/sphereDistance";
    //console.log(p1, p2);
    let body = {
        "p1": {"lat": app.lat1, "lon": app.lon1, "h": 0},
        "p2": {"lat": app.lat2, "lon": app.lon2, "h": 0},
        "coords": coords,
        "method": method
    }
    fetch(url, {
        method: 'post',
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        response_dom.innerText = parseFloat(data.dist).toFixed(4) + "m";
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
    
}

function onMapClick(e) {
    selectPoint(e.latlng);
}
mymap.on('click', onMapClick);