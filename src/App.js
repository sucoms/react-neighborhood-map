import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';
import * as dataLocations from './locations.json';
import FilterLocations from './FilterLocations';
import InfoWindow from './InfoWindow';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: '',
      locations: dataLocations,
      markers: [],
      infoWindowIsOpen: false,
      currentMarker: {},
      infoContent: ''
    };
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCR_bkCTk9XmnchVWGYzIV9w8Hl4_5vaHo&callback=initMap');
  }

  initMap = () => {
    var containesThis = this;
    const { locations, markers } = this.state;

    var map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: 45.561386, lng: 18.676702 }
    });

    this.setState({
      map
    });

    for (var i = 0; i < locations.length; i++) {
      var position = locations[i].position;
      var title = locations[i].title;
      var id = locations[i].key

      var marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: id
      });

      markers.push(marker);

      marker.addListener('click', function () {
        containesThis.openInfoWindow(marker);
      });
    }

     map.addListener('click', function () {
      containesThis.closeInfoWindow();
     });
  }

  openInfoWindow = (marker) => {
    this.setState({
      infoWindowIsOpen: true,
      currentMarker: marker
    });

    this.getInfos(marker);
  }

  closeInfoWindow = () => {
    this.setState({
      infoWindowIsOpen: false,
      currentMarker: {}
    });
  }

  getInfos = (marker) => {
    var containesThis = this;
    var place = marker.title;
    var srcUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' +
    place;
    srcUrl = srcUrl.replace(/ /g, '%20');
    
    fetchJsonp(srcUrl)
      .then(function(response) {
        return response.json();
      }).then(function (data) {
        var pages = data.query.pages;
        var pageId = Object.keys(data.query.pages)[0];
        var pageContent = pages[pageId].extract;

        containesThis.setState({
          infoContent: pageContent
        });
      }).catch(function (error) {
        var pageError = 'Parsing failed ' + error;
        containesThis.setState({
          infoContent: pageError
        });
      })
  }

  render() {
    return (
      <div className="App">
        <FilterLocations
          locationsList={this.state.locations}
          markers={this.state.markers}
          openInfoWindow={this.openInfoWindow}
        />

        {
          this.state.infoWindowIsOpen &&
          <InfoWindow
            currentMarker={this.state.currentMarker}
            infoContent={this.state.infoContent}
          />
        }
        
        <div id="map" role="application"></div>
      </div>
    );
  }
}

export default App;

function loadJS(src) {
  var ref = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');

  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);

  script.onerror = function () {
    document.write('Load error: Google Maps')
  };
}
