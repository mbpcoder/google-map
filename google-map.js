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
    var polygans = {};
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

    var addMarker = function (latitude, longitude, key, title, icon) {
        if (totalMarker > getMarkersCount() || totalMarker == -1) {
            var latLng = new google.maps.LatLng(latitude, longitude);
            if (!key) {
                key = guid();
            }
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
            markers[key] = marker;
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

    var getMarkers = function () {
        return markers;
    };

    var getMarkersPoint = function () {
        var points = [];
        for (var index in markers) {
            var marker = markers[index];
            var point = {
                'latitude': marker.position.lat(),
                'longitude': marker.position.lng()
            };

        }
        return points;
    };

    var getMarkersCount = function () {
        return Object.keys(markers).length;
    };

    var addInfoWindow = function (marker, content) {
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', function (event) {
            infoWindow.open(map, marker);
        });
    };

    var addPolygon = function (points, key) {
        key = '';

        for (var index in points) {
            var point = points[index];
            points[index] = new google.maps.LatLng(points[index]['latitude'], points[index]['longitude']);
            key = key + points[index]['latitude'] + '-' + points[index]['longitude'];
        }

        var polygan = new google.maps.Polygon({
            path: points,
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#0000FF",
            fillOpacity: 0.4
        });
        polygan.setMap(map);
        polygans[key] = polygans;
    };

    var clearPolygans = function () {
        for (var key in polygans) {
            polygans[key].setMap(null);
        }
        polygans = {};
    };

    var getPolygansCount = function () {
        return Object.keys(polygans).length;
    };

    var setMapCenter = function (latitude, longitude) {
        mapCenter = {
            latitude: latitude,
            longitude: longitude
        };
        map.setCenter(new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude));
    };

    var getCurrentMapCenter = function () {
        var center = {
            latitude: map.getCenter().lat(),
            longitude: map.getCenter().lng()
        };
        return center;
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

    var googleIsAvailable = function () {
        var result = false;
        if (typeof google !== "undefined" && typeof google !== undefined && typeof google.maps.LatLng === "function") {
            result = true;
        }
        return result;
    };

    var guid = function () {
        return guidHelperV4() + guidHelperV4() + '-' + guidHelperV4() + '-' + guidHelperV4() + '-' + guidHelperV4() + '-' + guidHelperV4() + guidHelperV4() + guidHelperV4();
    }
    var guidHelperV4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    // public function

    this.setMapCenter = setMapCenter;
    this.getCurrentMapCenter = getCurrentMapCenter;
    this.refresh = refresh;
    this.resize = resize;
    this.setMapZoom = setMapZoom;
    this.addMarker = addMarker;
    this.clearMarkers = clearMarkers;
    this.getMarkers = getMarkers;
    this.getMarkersPoint = getMarkersPoint;
    this.getMarkersCount = getMarkersCount;
    this.addInfoWindow = addInfoWindow;
    this.addPolygon = addPolygon;

    init();
};