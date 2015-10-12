'use strict';

var assign = require('object-assign');
var MapGL = require('react-map-gl');
var React = require('react');
var Immutable = require('immutable');
var r = require('r-dom');
var document = require('global/document');
var window = require('global/window');
var process = require('global/process');
var d3 = require('d3');
/* eslint-disable no-process-env */
var mapboxApiAccessToken = process.env.MapboxAccessToken;
// With the OSM raster tile style below, we don't actually even need to provide
// an access token but for convience, we'll leave the above line.
/* eslint-enable no-process-env */

var mapStyle = Immutable.Map({
  version: 8,
  name: 'Testing OSM raster source',
  sources: {
    'raster-osm-source': {
      type: 'raster',
      url: 'raster-osm-source.json',
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'raster-osm',
      type: 'raster',
      source: 'raster-osm-source',
      'source-layer': 'rastor_osm_full',
      paint: {
        'raster-opacity': 1
      }
    }
  ]
});

var App = React.createClass({
  getInitialState: function getInitialState() {
    return {
      map: {
        latitude: 37.78,
        longitude: -122.45,
        zoom: 11,
        mapStyle: mapStyle,
        width: window.innerWidth,
        height: window.innerHeight,
        mapboxApiAccessToken: mapboxApiAccessToken
      }
    };
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', function resize() {
      this.setState({
        map: assign({}, this.state.map, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    }.bind(this));
  },

  _onChangeViewport: function _onChangeViewport(opt) {
    this.setState({map: assign({}, this.state.map, opt)});
  },

  render: function render() {
    return r(MapGL, assign({
      onChangeViewport: this._onChangeViewport
    }, this.state.map));
  }
});

React.render(r(App), document.body);

d3.select('body').style('margin', 0);

