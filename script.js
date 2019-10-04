var longitud, latitud;
const url = new URL("https://api.thingspeak.com/channels/783913/feeds/last.json?api_key=SLAKVOPPP3OSSQG9");//&results=2
var polyline;
var polylinePoints = [];
var polylineOptions = {
  color: 'red',
  weight: 6,
  opacity: 0.8
};

//incluir mapa de mapbox usando una capa de leaflet

var mymap = L.map('mapid').setView([8.263686, -62.790322], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

// empleando el metodo asincrono para obtener el objeto JSON de ThingSpeak 
// fetch(url)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     obj= JSON.parse(JSON.stringify(myJson));
//     longitud = obj.field1 / 1000;
//     latitud = obj.field2 / 1000;
//     velocidad = obj.field3;
//     //document.write('Velocidad actual del vehiculo: '+ velocidad);
//     console.log("hello");
//     var marker = L.marker([latitud, longitud]).addTo(mymap);  //marcador de ubicacion
//   })

fetch('https://api.thingspeak.com/channels/783913/feeds.json?api_key=SLAKVOPPP3OSSQG9&results=20')
  .then((response) => {
    return response.json()
  })
  .then((responseJson) => {
    data = JSON.parse(JSON.stringify(responseJson))
    data.feeds.forEach(function(dato) {
      latitud = dato.field2/1000;
      longitud = dato.field1/1000;
      var marker = L.marker([latitud, longitud]).addTo(mymap); //Agregar marcador al mapa
      polylinePoints.push(new L.LatLng(latitud, longitud));
    })
  })
  .catch(function(error) {
    console.log('Sucedio un error durante la solicitud')
    console.log(error.response)
  })
  .finally(function() {
    if(polylinePoints.length > 0){
      polyline = new L.Polyline(polylinePoints, polylineOptions).addTo(mymap)
      mymap.fitBounds(polyline.getBounds())   // zoom en polyline ubicado en el mapa
      return
    }
    console.log("No se han registrado ubicaciones con el GPS")
  })

//setInterval(location.reload(), 300000);