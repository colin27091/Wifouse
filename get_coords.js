var trans = {
    France: "France",
    France2: "france",
    OpenKey: "55f3c34bb9a3424d96a72154deca11ea",
    AlgoKey: "8b85377ef90e71e2d5096d015d1ecad8",
    AlgoApp: "plJ14NII6Y3C",
    ElevationKey: "hc2962-wQ54R8e9agp9247hljNBNCg",
    InvalidCoordinatesShort: "Invalid coordinates",
    Locale: "en",
    InvalidCoordinates: "Invalid coordinates or connection problems",
    DefaultLat: 40.741895,
    DefaultLng: -73.989308,
    DefaultHeading: 182,
    DefaultPitch: 5,
    DefaultSvZoom: 1,
    DefaultZoom: 14,
    DefaultAddress: "New York",
    Geolocation: "Geolocation:",
    Latitude: "Latitude:",
    Longitude: "Longitude:",
    GetAltitude: "Get Altitude",
    NoResolvedAddress: "No resolved address",
    GeolocationError: "Geolocation error.",
    GeocodingError: "Geocode was not successful ",
    Altitude: "Altitude: ",
    Meters: " meters",
    NoResult: "No result found",
    ElevationFailure: "Elevation service failed ",
    SetOrigin: "Set as Origin",
    Origin: "Origin: ",
    NewOrigin: "This location is your new starting point.",
    SetDestination: "Set as Destination",
    Destination: "Destination: ",
    NewDest: "This location is your new destination.",
    Address: "Address: ",
    Bicycling: "Bicycling",
    Transit: "Transit",
    Walking: "Walking",
    Driving: "Driving",
    Kilometer: "Kilometer",
    Mile: "Mile",
    Avoid: "Avoid",
    DirectionsError: "Calculating error or invalid route.",
    North: "N",
    South: "S",
    East: "E",
    West: "W",
    Type: "type",
    Lat: "latitude",
    Lng: "longitude",
    Dd: "DD",
    Dms: "DMS",
    CheckMapDelay: 7e3
};


var map;
var geocoder;
var autocomplete;
var infowindow = new google.maps.InfoWindow;
var marker = null;
var elevator;
var fromPlace = 0;
var locationFromPlace;
var addressFromPlace;
var placeName = "";
var defaultLatLng = new google.maps.LatLng(trans.DefaultLat, trans.DefaultLng);
var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false
};
var mapLoaded = 0;
var geoloc = 0;
var geolocLat = 0;
var geolocLng = 0;
var geolocAddr = "";
var autocompleteLoaded = 0;
var badQueries = [];

function isGoodQuery(query) {
    var goodQuery = true;
    for (var i = 0; i < badQueries.length; i++) {
        if (query.startsWith(badQueries[i])) goodQuery = false
    }
    return goodQuery
}

function hasNoNumbers(t) {
    return !/\d/.test(t)
}

function myFocus(el) {
    el.focus();
    var valLength = el.value.length;
    valLength = valLength * 2;
    el.setSelectionRange(valLength, valLength);
    return false
}

function updateAll(text1, text2, lat, lng) {
    var infoText = "<strong>" + text1 + '</strong> <span id="geocodedAddress">' + text2 + "</span>";
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;
    document.getElementById("latlong").value = lat + "," + lng;
    document.getElementById("address").value = text2;
    ddversdms();
    if (text1 != -1) {
        bookUp(text2, lat, lng);
        infowindow.setContent(infowindowContent(infoText, lat, lng));
        infowindow.open(map, marker)
    }
}

function myReverseGeocode(latToGeocode, lngToGeocode, intro) {
    latToGeocode = parseFloat(latToGeocode);
    lngToGeocode = parseFloat(lngToGeocode);
    if (latToGeocode >= -90 && latToGeocode <= 90 && lngToGeocode >= -180 && lngToGeocode <= 180) {
        $.ajax({
            type: "GET",
            url: "https://api.opencagedata.com/geocode/v1/json?q=" + latToGeocode + "+" + lngToGeocode + "&key=" + trans.OpenKey + "&no_annotations=1&language=" + trans.Locale,
            dataType: "json",
            success: function(data) {
                if (data.status.code == 200) {
                    if (data.total_results >= 1) {
                        if (intro == -1) geolocAddr = data.results[0].formatted;
                        updateAll(intro, data.results[0].formatted, latToGeocode, lngToGeocode)
                    } else {
                        if (intro == -1) geolocAddr = trans.NoResolvedAddress;
                        updateAll(intro, trans.NoResolvedAddress, latToGeocode, lngToGeocode)
                    }
                } else {
                    if (intro == -1) geolocAddr = trans.GeocodingError;
                    updateAll(intro, trans.InvalidCoordinates, latToGeocode, lngToGeocode)
                }
            },
            error: function(xhr, err) {
                updateAll(trans.Geolocation, trans.InvalidCoordinates, latToGeocode, lngToGeocode)
            }
        }).always(function() {
            if (intro == -1) initializeMap()
        });
        return false
    } else alert(trans.InvalidCoordinatesShort)
}

function myForwardGeocode(addr) {
    $.ajax({
        type: "GET",
        url: "https://api.opencagedata.com/geocode/v1/json?q=" + encodeURIComponent(addr) + "&key=" + trans.OpenKey + "&no_annotations=1&language=" + trans.Locale,
        dataType: "json",
        success: function(data) {
            if (data.status.code == 200) {
                if (data.total_results >= 1) {
                    var latres = data.results[0].geometry.lat;
                    var lngres = data.results[0].geometry.lng;
                    var pos = new google.maps.LatLng(latres, lngres);
                    map.setCenter(pos);
                    if (marker != null) marker.setMap(null);
                    marker = new google.maps.Marker({
                        map: map,
                        position: pos
                    });
                    updateAll("", data.results[0].formatted, latres, lngres)
                } else {
                    alert(trans.GeolocationError)
                }
            } else {
                alert(trans.GeolocationError)
            }
        },
        error: function(xhr, err) {
            alert(trans.GeolocationError)
        }
    }).always(function() {});
    return false
}

function initialize() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            geoloc = 1;
            geolocLat = position.coords.latitude;
            geolocLng = position.coords.longitude;
            $("#statusinfo").removeClass("bg-orange").addClass("bg-green");
            $("#statusinfo").html("Geolocation on — Scroll page to load map");
            myReverseGeocode(position.coords.latitude, position.coords.longitude, -1)
        }, function() {
            geoloc = 2;
            $("#statusinfo").removeClass("bg-orange").addClass("bg-green");
            $("#statusinfo").html("Geolocation off — Scroll page to load map");
            initializeMap()
        })
    } else {
        geoloc = 2;
        $("#statusinfo").removeClass("bg-orange").addClass("bg-green");
        $("#statusinfo").html("Geolocation off — Scroll page to load map");
        initializeMap()
    }
}

function initializeMap() {
    if (mapLoaded == 0 && appeared == 1 && geoloc != 0) {
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        var input = document.getElementById("address");
        var options = {};
        if (geoloc == 1) {
            var pos = new google.maps.LatLng(geolocLat, geolocLng);
            marker = new google.maps.Marker({
                map: map,
                position: pos
            });
            map.setCenter(pos);
            mapLoaded = 1;
            updateAll(trans.Geolocation, geolocAddr, geolocLat, geolocLng)
        } else {
            defaultMap()
        }
        google.maps.event.addListener(map, "click", codeLatLngfromclick);
        elevator = new google.maps.ElevationService
    }
}

function codeAddress() {
    var address = document.getElementById("address").value;
    if (fromPlace == 1) {
        map.setCenter(locationFromPlace);
        if (marker != null) marker.setMap(null);
        marker = new google.maps.Marker({
            map: map,
            position: locationFromPlace
        });
        latres = locationFromPlace.lat();
        lngres = locationFromPlace.lng();
        if (placeName != "") {
            document.getElementById("address").value = addressFromPlace;
            var addressForInfoWindow = "<strong>" + placeName + "</strong> " + addressFromPlace
        } else {
            document.getElementById("address").value = addressFromPlace;
            var addressForInfoWindow = "<strong>" + placeName + "</strong> " + addressFromPlace
        }
        infowindow.setContent(infowindowContent(addressForInfoWindow, latres, lngres));
        infowindow.open(map, marker);
        document.getElementById("latitude").value = latres;
        document.getElementById("longitude").value = lngres;
        document.getElementById("latlong").value = latres + "," + lngres;
        bookUp(document.getElementById("address").value, latres, lngres);
        ddversdms()
    } else {
        myForwardGeocode(address)
    }
}

function codeLatLng(origin) {
    var lat = parseFloat(document.getElementById("latitude").value) || 0;
    var lng = parseFloat(document.getElementById("longitude").value) || 0;
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        var latlng = new google.maps.LatLng(lat, lng);
        if (origin == 1) ddversdms();
        map.setCenter(latlng);
        if (marker != null) marker.setMap(null);
        marker = new google.maps.Marker({
            map: map,
            position: latlng
        });
        myReverseGeocode(lat, lng, "");
        fromPlace = 0
    } else alert(trans.InvalidCoordinatesShort)
}

function codeLatLngfromclick(event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var latlng = event.latLng;
    if (marker != null) marker.setMap(null);
    marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
    map.panTo(latlng);
    fromPlace = 0;
    myReverseGeocode(lat, lng, "")
}

function getElevation() {
    var elevationButton = document.getElementById("altitude");
    elevationButton.innerHTML = '<img src="' + loaderUrl + '"/>';
    $.ajax({
        type: "GET",
        url: "https://elevation-api.io/api/elevation?points=(" + marker.position.lat() + "," + marker.position.lng() + ")&resolution=90&key=" + trans.ElevationKey,
        dataType: "json",
        success: function(data) {
            if (data.elevations.length >= 1) {
                document.getElementById("altitude").innerHTML = "<strong>" + trans.Altitude + "</strong> " + Math.floor(data.elevations[0].elevation) + trans.Meters
            } else {
                document.getElementById("altitude").innerHTML = trans.NoResult
            }
        },
        error: function(xhr, err) {
            document.getElementById("altitude").innerHTML = trans.ElevationFailure
        }
    })
}

function ddversdms() {
    var lat, lng, latdeg, latmin, latsec, lngdeg, lngmin, lngsec;
    lat = parseFloat(document.getElementById("latitude").value) || 0;
    lng = parseFloat(document.getElementById("longitude").value) || 0;
    if (lat >= 0) document.getElementById("nord").checked = true;
    if (lat < 0) document.getElementById("sud").checked = true;
    if (lng >= 0) document.getElementById("est").checked = true;
    if (lng < 0) document.getElementById("ouest").checked = true;
    lat = Math.abs(lat);
    lng = Math.abs(lng);
    latdeg = Math.floor(lat);
    latmin = Math.floor((lat - latdeg) * 60);
    latsec = Math.round((lat - latdeg - latmin / 60) * 1e3 * 3600) / 1e3;
    lngdeg = Math.floor(lng);
    lngmin = Math.floor((lng - lngdeg) * 60);
    lngsec = Math.floor((lng - lngdeg - lngmin / 60) * 1e3 * 3600) / 1e3;
    document.getElementById("latitude_degres").value = latdeg;
    document.getElementById("latitude_minutes").value = latmin;
    document.getElementById("latitude_secondes").value = latsec;
    document.getElementById("longitude_degres").value = lngdeg;
    document.getElementById("longitude_minutes").value = lngmin;
    document.getElementById("longitude_secondes").value = lngsec
}

function dmsversdd() {
    var lat, lng, nordsud, estouest, latitude_degres, latitude_minutes, latitude_secondes, longitude_degres, longitude_minutes, longitude_secondes;
    if (document.getElementById("sud").checked) nordsud = -1;
    else nordsud = 1;
    if (document.getElementById("ouest").checked) estouest = -1;
    else estouest = 1;
    latitude_degres = parseFloat(document.getElementById("latitude_degres").value) || 0;
    latitude_minutes = parseFloat(document.getElementById("latitude_minutes").value) || 0;
    latitude_secondes = parseFloat(document.getElementById("latitude_secondes").value) || 0;
    longitude_degres = parseFloat(document.getElementById("longitude_degres").value) || 0;
    longitude_minutes = parseFloat(document.getElementById("longitude_minutes").value) || 0;
    longitude_secondes = parseFloat(document.getElementById("longitude_secondes").value) || 0;
    lat = nordsud * (latitude_degres + latitude_minutes / 60 + latitude_secondes / 3600);
    lng = estouest * (longitude_degres + longitude_minutes / 60 + longitude_secondes / 3600);
    document.getElementById("latitude").value = Math.round(lat * 1e7) / 1e7;
    document.getElementById("longitude").value = lng;
    setTimeout(codeLatLng(2), 1e3)
}

function infowindowContent(text, latres, lngres) {
    return '<div id="info_window">' + text + "<br/><strong>" + trans.Latitude + "</strong> " + Math.round(latres * 1e6) / 1e6 + " | <strong>" + trans.Longitude + "</strong> " + Math.round(lngres * 1e6) / 1e6 + '<br/><br/><span id="altitude"><button type="button" class="btn btn-primary" onclick="getElevation()">' + trans.GetAltitude + "</button></span>" + bookmark() + "</div>"
}

function defaultMap() {
    map.setCenter(defaultLatLng);
    mapLoaded = 1;
    bookUp(trans.DefaultAddress, trans.DefaultLat, trans.DefaultLng);
    if (marker != null) marker.setMap(null);
    marker = new google.maps.Marker({
        map: map,
        position: defaultLatLng
    });
    infowindow.setContent(infowindowContent(trans.DefaultAddress, defaultLatLng.lat(), defaultLatLng.lng()));
    infowindow.open(map, marker);
    document.getElementById("latitude").value = defaultLatLng.lat();
    document.getElementById("longitude").value = defaultLatLng.lng();
    document.getElementById("address").value = trans.DefaultAddress;
    ddversdms()
}
$(document).ready(function() {
    $("#address").keydown(function(e) {
        fromPlace = 0
    });
    $("#map_canvas").appear();
    $(document.body).one("appear", "#map_canvas", function(e, $affected) {
        appeared = 1;
        initializeMap()
    });
    $("#address").keyup(function() {
        if (autocompleteLoaded == 1 && this.value.length < 10) {
            autocomplete.destroy();
            setTimeout(myFocus(document.getElementById("address")), 10);
            autocompleteLoaded = 0
        }
        if (autocompleteLoaded == 0 && this.value.length >= 10 && isGoodQuery(this.value) && mapLoaded == 1) {
            autocomplete = places({
                appId: trans.AlgoApp,
                apiKey: trans.AlgoKey,
                container: document.getElementById("address")
            }).configure({
                language: trans.Locale
            });
            autocompleteLoaded = 1;
            setTimeout(myFocus(document.getElementById("address")), 10);
            autocomplete.on("change", function resultSelected(e) {
                if (e.suggestion.countryCode == "fr" || hasNoNumbers(e.suggestion.name)) {
                    fromPlace = 1;
                    locationFromPlace = new google.maps.LatLng(e.suggestion.latlng.lat, e.suggestion.latlng.lng);
                    addressFromPlace = e.suggestion.value
                } else fromPlace = 0
            });
            autocomplete.on("suggestions", function suggestions(e) {
                if (e.suggestions.length == 0) {
                    badQueries.push(e.query);
                    autocomplete.destroy();
                    setTimeout(myFocus(document.getElementById("address")), 10);
                    autocompleteLoaded = 0
                }
            });
            autocomplete.on("clear", function suggestions(e) {
                autocomplete.destroy();
                setTimeout(myFocus(document.getElementById("address")), 10);
                autocompleteLoaded = 0
            })
        }
    })
});