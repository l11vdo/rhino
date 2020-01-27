import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {}
        };
      }
  render() {
    const mapHeight=document.getElementById("mapHolder").clientHeight
    const mapWidth=document.getElementById("mapHolder").clientWidth
    return (
      <Map
        google={this.props.google}
        zoom={18}
        style={{height: mapHeight, width: mapWidth}}
        initialCenter={{lat: this.props.item.location.latitude, lng: this.props.item.location.longitude}}
        onMapLoad={map => {
            new window.google.maps.Marker({
              position: { lat: this.props.item.location.latitude, lng: this.props.item.location.longitude },
              map: map,
              title: this.props.item.location.name
            });
          }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDl9gKN_uJtBrVUlsBb_8VI05otHx1Xq7w'
})(MapContainer);