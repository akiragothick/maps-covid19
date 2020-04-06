
/* Example 1 */
//map = new OpenLayers.Map("map");
//map.addLayer(new OpenLayers.Layer.OSM());
//map.zoomToMaxExtent();


/* Example 2 */
//map = new OpenLayers.Map("map");
//var mapnik = new OpenLayers.Layer.OSM();
//var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
//var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
//var position = new OpenLayers.LonLat(13.41, 52.52).transform(fromProjection, toProjection);
//var zoom = 15;

//map.addLayer(mapnik);
//map.setCenter(position, zoom);


/* Example 3 */
function init() {

    var template = '<form id="popup-form">\
      <label for="input-speed">New speed:</label>\
      <input id="input-speed" class="popup-input" type="number" />\
      <table class="popup-table">\
        <tr class="popup-table-row">\
          <th class="popup-table-header">Arc numer:</th>\
          <td id="value-arc" class="popup-table-data"></td>\
        </tr>\
        <tr class="popup-table-row">\
          <th class="popup-table-header">Current speed:</th>\
          <td id="value-speed" class="popup-table-data"></td>\
        </tr>\
      </table>\
      <button id="button-submit" type="button">Save Changes</button>\
    </form>';

    var lat = -12.031213;
    var lon = -77.033409;
    var zoom = 17;

    var map = L.map('map', {
        center: L.latLng(lat, lon),
        zoom: zoom
    });//.fitWorld();

    //L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    //    maxZoom: zoom,
    //    attribution: 'Map data &copy; <a href="https://www.mediawiki.org">Wikimedia</a> contributors',
    //    crossOrigin: "https://www.mediawiki.org"
    //}).addTo(map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: zoom,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        crossOrigin: "https://wiki.openstreetmap.org"
    }).addTo(map);

    //L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWtpcmFnb3RoaWNrIiwiYSI6ImNrOG50amVrODA5eGgzZW15czBxNXp5NGgifQ.H1LlCO4aOYzwwiCrWw_PlA', {
    //    maxZoom: zoom,
    //    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    //        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //    id: 'mapbox/streets-v11',
    //    tileSize: 512,
    //    zoomOffset: -1
    //}).addTo(map);


    //L.geoJson({
    //    type: 'FeatureCollection',
    //    features: [{
    //        type: 'Feature',
    //        geometry: {
    //            type: 'Point',
    //            coordinates: [lon, lat]
    //        },
    //        properties: {
    //            arc: 321,
    //            speed: 123
    //        }
    //    }]
    //}, {
    //    onEachFeature: function (feature, layer) {
    //        layer.on('click', layerClickHandler);
    //    }
    //}).addTo(map);



    function layerClickHandler(e) {

        var marker = e.target,
            properties = e.target.feature.properties;

        if (marker.hasOwnProperty('_popup')) {
            marker.unbindPopup();
        }

        marker.bindPopup(template).openPopup();

        L.DomUtil.get('value-arc').textContent = properties.arc;
        L.DomUtil.get('value-speed').textContent = properties.speed;

        var inputSpeed = L.DomUtil.get('input-speed');
        inputSpeed.value = properties.speed;
        L.DomEvent.addListener(inputSpeed, 'change', function (e) {
            properties.speed = e.target.value;
        });

        var buttonSubmit = L.DomUtil.get('button-submit');
        L.DomEvent.addListener(buttonSubmit, 'click', function (e) {
            marker.closePopup();
        });

    }


    var markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        singleMarkerMode: true,
        polygonOptions: {
            color: 'rgba(0,0,0,0)'
        }
    });

    markers.on('clusterclick', function (a) {
        a.layer.zoomToBounds();
    });

    map.addLayer(markers);





    function populate() {
        for (var i = 0; i < 300; i++) {
            var m = L.marker(getRandomLatLng(map));
            markers.addLayer(m);
        }
        return false;
    }

    function getRandomLatLng(map) {
        var bounds = map.getBounds(),
            southWest = bounds.getSouthWest(),
            northEast = bounds.getNorthEast(),
            lngSpan = northEast.lng - southWest.lng,
            latSpan = northEast.lat - southWest.lat;

        return L.latLng(
            southWest.lat + latSpan * Math.random(),
            southWest.lng + lngSpan * Math.random());
    }

    populate();





    function onLocationFound(e) {

        var radius = e.accuracy / 16;

        L.geoJson({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [e.latlng.lng, e.latlng.lat]
                },
                properties: {
                    arc: 321,
                    speed: 123
                }
            }]
        }, {
            onEachFeature: function (feature, layer) {
                layer.on('click', layerClickHandler);
            }
        }).addTo(map);


        L.circle(e.latlng, radius).addTo(map);

    }

    function onLocationError(e) {
        //alert(e.message);
        //mostrar un aprox
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    function getCurrentLocation() {
        map.locate({ setView: true, maxZoom: zoom });
    }

    getCurrentLocation();



    //function populate2() {

    //    let options = {
    //        icon: new L.Icon({
    //            iconUrl: 'Drawing.png',
    //            iconSize: [30, 30]
    //        }),
    //    };

    //    let rand = Math.pow(-1, [1, 2][Math.round(Math.random())]) * Math.random() / 500;

    //    for (let mark of this.marks) {

    //        var m = new L.marker(new L.LatLng(mark.lat + rand, mark.lon + rand), options)

    //        markers.addLayer(m);
    //    }

    //}
}

init();



