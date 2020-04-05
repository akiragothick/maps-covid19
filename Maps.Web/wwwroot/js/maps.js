// Google mapper initialize function
function initialize() {

    //To find the current location and add the marker of current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else { $("#message").html("Geolocation is not supported by this browser."); }

    function ConvertCsvToJavascriptObject(csv) {

        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {

            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);

        }

        return result; //JavaScript object
        //return JSON.stringify(result); //JSON
    }

    function showPosition(position) {
        var currentLatLng = position.coords;

        //var latlon = "Latitude" + currentLatLng.latitude + "," + "Longitude" + currentLatLng.longitude;

        //Google map options like langitude, latitude and zoom level
        var mapOptions = {
            //center: new google.maps.LatLng(currentLatLng.latitude, currentLatLng.longitude),
            center: { lat: -12.031213, lng: -77.033409 },
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var geocoder = new google.maps.Geocoder;

        //Get the element of div to show google maps
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var FechaHoy = '';

        function GetFecha(days) {

            var today = new Date();
            today.setDate(today.getDate() + days);

            var dd = today.getDate();

            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            FechaHoy = mm + '-' + dd + '-' + yyyy;
        }

        GetFecha(0);

        function ShowMap() {

            var urlRequest = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/' + FechaHoy + '.csv';

            Promise.all([
                urlRequest
            ].map(function (url) {

                return fetch(url).then(response => {
                    return response.ok ? response.text() : Promise.reject(response.status);
                }).then(function (text) {
                    return ConvertCsvToJavascriptObject(text);
                }).catch(error => {
                    console.log(error);
                });

            }))
                .then(response => {

                    //console.log(response);

                    var json = response[0];

                    var maxConfirmed = 2200;
                    var heatmapData = [];

                    //var markerExamples = [];
                    //markerExamples.push({ lat: -12.031213, lng: -77.033409 }); //yo

                    for (var i = 0; i < json.length; i++) {

                        var latLng = new google.maps.LatLng(json[i].Lat, json[i].Long_);

                        var datoo = (json[i].Confirmed > maxConfirmed ? maxConfirmed : json[i].Confirmed)

                        var weightedLoc = {
                            location: latLng,
                            weight: Math.pow(1.002, datoo)
                        };

                        heatmapData.push(weightedLoc);

                        //var marker = new google.maps.Marker({
                        //    position: latLng,
                        //    map: map
                        //});
                    }

                    var heatmap = new google.maps.visualization.HeatmapLayer({
                        data: heatmapData,
                        dissipating: true,
                        maxIntensity: 50,
                        radius: 25,
                        map: map
                    });

                }).catch(error => {
                    console.log('Error para la fecha ' + FechaHoy);

                    GetFecha(-1);

                    console.log('Se mostrará data de la fecha ' + FechaHoy);

                    ShowMap();
                });

        }

        ShowMap();


        /* CON ARCHIVO LOCAL */
        //fetch("./json/04042020-COVID19.json")
        //    .then(response => {
        //        if (response.status === 200) {
        //            return response.json();
        //        } else {
        //            throw new Error('Something went wrong on api server!');
        //        }
        //    })
        //    .then(json => {

        //        //console.log(json)

        //        var maxConfirmed = 2200;
        //        var heatmapData = [];

        //        //var markerExamples = [];
        //        //markerExamples.push({ lat: -12.031213, lng: -77.033409 }); //yo

        //        for (var i = 0; i < json.length; i++) {

        //            var latLng = new google.maps.LatLng(json[i].Lat, json[i].Long_);

        //            var datoo = (json[i].Confirmed > maxConfirmed ? maxConfirmed : json[i].Confirmed)

        //            var weightedLoc = {
        //                location: latLng,
        //                weight: Math.pow(1.002, datoo )
        //            };

        //            heatmapData.push(weightedLoc);

        //            //var marker = new google.maps.Marker({
        //            //    position: latLng,
        //            //    map: map
        //            //});
        //        }

        //        var heatmap = new google.maps.visualization.HeatmapLayer({
        //            data: heatmapData,
        //            dissipating: true,
        //            maxIntensity: 50,
        //            radius: 25,
        //            map: map
        //        });

        //    }).catch(error => {
        //        console.error(error);
        //    });


        //directionsDisplay.setMap(map);
        //directionsDisplay.setPanel(document.getElementById('right-panel'));

        //var control = document.getElementById('floating-panel');
        //control.style.display = 'block';
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);



        // Ajax call to get the nearest locations from DB.

        //var dat = {
        //    "latitudActual": map.center.lat(),
        //    "logitudActual": map.center.lng()
        //};

        //_latitud = currentLatLng.latitude;
        //_longitud = currentLatLng.longitude;

        //$("#location").val("" + currentLatLng.latitude + "," + currentLatLng.longitude);

        //jQuery.ajax({
        //    cache: false,
        //    type: "POST",
        //    url: urlApi + "/hackaton/api/v1/localizaciones",
        //    data: JSON.stringify(dat),
        //    dataType: "json",
        //    contentType: "application/json; charset=utf-8",
        //    success: function (data) {
        //        //Adding the marker of nearest locations
        //        if (data != undefined) {
        //            $.each(data.contenido, function (i, item) {
        //                // addMarker(item["lat"], item["lng"], item["Name"] + " & Distance: " + (Math.round(0.0 + item["Distance"] / 1000)) + " KM");
        //                addMarker(item["latitud"], item["longitud"], '<a href="#" onclick="modalito(\'' + item["schoolId"] + '\',\'' + item["schoolName"] + '\');">' + item["schoolName"] + '</a>', false);

        //            })
        //        }
        //    },
        //    failure: function (errMsg) {
        //        alert(errMsg);
        //    },
        //    complete: function () {
        //        // adding the user current location to teh marker
        //        addMarker(map.center.lat(), map.center.lng(), "Tú estás aquí", true);
        //    }
        //});

        // Add marker function to add the markers and information window settings
        function addMarker(x, y, locationName, option) {
            var infowindow = new google.maps.InfoWindow({
                content: locationName
            });

            var location = new google.maps.LatLng(x, y);

            var icono = "/Images/logo-location.png";
            if (option) {
                icono = "/Images/personita2.png"
            }

            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: locationName,
                icon: icono
            });

            infowindow.open(map, marker);

            // Call the funtion to draw the route map on the clicking on the map marker
            marker.addListener('click', function () {
                infowindow.open(map, marker);
                calculateAndDisplayRoute(directionsService, directionsDisplay, x, y);
            });
        }

        //function to draw the route from the current location to the clicked location on the map
        function calculateAndDisplayRoute(directionsService, directionsDisplay, x, y) {

            // Origin is user current location
            var latlngSource = { lat: parseFloat(currentLatLng.latitude), lng: parseFloat(currentLatLng.longitude) };

            //destination is clicked marker on the map
            var latlangDestination = { lat: parseFloat(x), lng: parseFloat(y) };
            directionsService.route({
                origin: latlngSource, //Source
                destination: latlangDestination, //destination
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
    }

    //show error formats incase the location is not found.
    function showError(error) {
        if (error.code == 1) {
            $("#message").html("User denied the request for Geolocation.");
        }
        else if (error.code == 2) {
            $("#message").html("Location information is unavailable.");
        }
        else if (error.code == 3) {
            $("#message").html("The request to get user location timed out.");
        }
        else {
            $("#message").html("An unknown error occurred.");
        }
    }
}

// Google maper - starting point
google.maps.event.addDomListener(window, 'load', initialize);


