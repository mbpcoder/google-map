var GoogleMap = function (options) {

    if (!options) {
        options = {};
    }
    // -1 equal unlimited
    var totalMarker = options.totalMarker || 0;
    // options
    var mapCenter = {};
    if (options.mapCenter) {
        mapCenter.latitude = options.mapCenter.latitude || 36.318577999999995;
        mapCenter.longitude = options.mapCenter.longitude || 59.58842000000004;
    } else {
        mapCenter.latitude = 36.318577999999995;
        mapCenter.longitude = 59.58842000000004;
    }
    var zoom = options.zoom || 13;
    var zoomControl = (options.zoomControl == undefined) ? true : options.zoomControl;

    var containerElement = options.containerElement || undefined;
    var scrollWheelZoom = (options.scrollWheelZoom == undefined) ? true : options.scrollWheelZoom;
    var markerIcon = options.markerIcon || undefined;
    var onMapClick = options.onMapClick || undefined;
    var onMarkerClick = options.onMarkerClick || undefined;

    // private variables
    var map = undefined;
    var markers = {};
    // private functions

    // initial the map
    var init = function () {
        if (googleIsAvailable()) {
            var zoomControlOptions = {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            };
            var mapOptions = {
                center: new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
                zoom: zoom,
                zoomControl: zoomControl,
                zoomControlOptions: zoomControlOptions,
                scrollwheel: scrollWheelZoom
            };
            map = new google.maps.Map(containerElement, mapOptions);

            if (onMapClick) {
                google.maps.event.addListener(map, 'click', function (event) {
                    var point = {
                        'latitude': event.latLng.lat(),
                        'longitude': event.latLng.lng(),
                    };
                    onMapClick(map, event, point);
                });
            }
        } else {
            console.log('google map is undefined');
            if (containerElement.classList.length == 0) {
                containerElement.className = 'offline';
            } else {
                containerElement.className = containerElement.className + ' offline';
            }
        }
    };

    var addMarker = function (latitude, longitude, title, icon) {
        if (totalMarker > getMarkerCount() || totalMarker == -1) {
            var latLng = new google.maps.LatLng(latitude, longitude);
            var option = {
                position: latLng,
                map: map
            };
            if (title) {
                option.title = title;
            }
            if (icon) {
                option.icon = icon;
            }
            else if (markerIcon) {
                option.icon = markerIcon;
            }
            var marker = new google.maps.Marker(option);
            if (onMarkerClick) {
                google.maps.event.addListener(marker, 'click', function (event) {
                    var point = {
                        'latitude': event.latLng.lat(),
                        'longitude': event.latLng.lng(),
                    };
                    onMarkerClick(map, marker, event, point)
                });
            }
            markers[latitude + ',' + longitude] = marker;
            return marker;
        }
        return false;
    };

    var clearMarkers = function () {
        for (var key in markers) {
            markers[key].setMap(null);
        }
        markers = {};
    };

    var addInfoWindow = function (marker, contect) {
        var infoWindow = new google.maps.InfoWindow({
            content: contect
        });
        google.maps.event.addListener(marker, 'click', function (event) {
            infoWindow.open(map, marker);
        });
    };

    var setMapCenter = function (latitude, longitude) {
        mapCenter = {
            latitude: latitude,
            longitude: longitude
        };
        map.setCenter(new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude));
    };

    var setMapZoom = function (value) {
        zoom = value;
        map.setZoom(zoom);
    };

    var refresh = function () {
        //refresh map
    };

    var resize = function () {
        google.maps.event.trigger(map, 'resize');
    };

    var getMarkerCount = function () {
        return Object.keys(markers).length;
    };

    var googleIsAvailable = function () {
        var result = false;
        if (typeof google !== "undefined" && typeof google !== undefined && typeof google.maps.LatLng === "function") {
            result = true;
        }
        return result;
    };

    // public function

    this.setMapCenter = setMapCenter;
    this.refresh = refresh;
    this.resize = resize;
    this.setMapZoom = setMapZoom;
    this.addMarker = addMarker;
    this.addInfoWindow = addInfoWindow;
    this.clearMarkers = clearMarkers;

    init();
};