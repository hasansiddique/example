export const mapOptions = {
  backgroundColor: '#2b2b2b !important',
  draggable: false,
  panControl: true,
  mapTypeControl: false,
  maxZoom: 15,
  minZoom: 2,
  streetViewControl: false,
  styles: [
    {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "saturation": 36
        },
        {
          "color": "#000000"
        },
        {
          "lightness": 40
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#000000"
        },
        {
          "lightness": 18
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 17
        },
        {
          "weight": 1.2
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#666666"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#666666"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#333333"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 21
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 17
        }
      ]
    }
  ]
};

export const searchBoxStyle = {
  border: `1px solid transparent`,
  borderRadius: `2px`,
  boxShadow: `0 2px 4px rgba(0,0,0,0.5),0 -1px 0px rgba(0,0,0,0.02)`,
  background: `#fff`,
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  fontSize: `14px`,
  height: `36px`,
  outline: `none`,
  padding: `0 20px`,
  margin: `10px`,
  textOverflow: `ellipses`,
  width: `350px`
};

export const resetZoomStyles = {
  position: `absolute`,
  height: `28px`,
  width: `28px`,
  background: `white`,
  zIndex: `1`,
  bottom: `85px`,
  right: `10px`,
  borderRadius: `2px`,
  border: `1px solid #e1e1e1`,
  cursor: `pointer`,
  backgroundImage: `url("/images/ico-reset-zoom.svg")`,
  backgroundSize: `16px`,
  backgroundPosition: `center center`,
  backgroundRepeat: `no-repeat`,
  boxShadow: `rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px`
};
