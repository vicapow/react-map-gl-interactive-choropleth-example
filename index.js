'use strict';

var assign = require('object-assign');
var MapGL = require('react-map-gl');
var React = require('react');
var ReactDOM = require('react-dom');
var Immutable = require('immutable');
var r = require('r-dom');
var document = require('global/document');
var window = require('global/window');
var rasterTileStyle = require('raster-tile-style');
var tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';
var mapStyle = rasterTileStyle([tileSource]);

var geoJSON = require('./features-example-sf.json');

mapStyle.sources['our-choropleth-source'] = {type: 'geojson', data: geoJSON};

geoJSON.features.forEach(function each(feature) {
  feature.properties.foobar = Math.random();
});

mapStyle.layers.push({
  id: 'geojson-sf-boobar-low',
  type: 'fill',
  source: 'our-choropleth-source',
  interactive: true,
  filter: ['>=', 'foobar', 0.5],
  paint: {
    'fill-color': '#e74c3c',
    'fill-opacity': 0.4
  }
});

mapStyle.layers.push({
  id: 'geojson-sf-boobar-hi',
  type: 'fill',
  source: 'our-choropleth-source',
  interactive: true,
  filter: ['<', 'foobar', 0.5],
  paint: {
    'fill-color': '#2ecc71',
    'fill-opacity': 0.4
  }
});

var App = React.createClass({
  getInitialState: function getInitialState() {
    return {
      map: {
        latitude: 37.78,
        longitude: -122.45,
        zoom: 11,
        mapStyle: Immutable.fromJS(mapStyle),
        width: window.innerWidth,
        height: window.innerHeight
      },
      hoveredFeatures: []
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

  _onHoverFeatures: function _onHoverFeatures(features) {
    this.setState({hoveredFeatures: features});
  },

  render: function render() {
    return r.div({}, [
      r.code({
        style: {
          position: 'absolute',
          left: 10,
          top: 10,
          color: 'white',
          zIndex: 1
        }
      }, r.pre(JSON.stringify(this.state.hoveredFeatures, null, 2))),
      r(MapGL, assign({
        onChangeViewport: this._onChangeViewport,
        onHoverFeatures: this._onHoverFeatures
      }, this.state.map)),
      r.div({
        style: {
          position: 'absolute',
          right: 10,
          bottom: 10,
          fontFamily: 'Helvetica',
          background: 'white',
          padding: 4
        }
      }, [
        'Map tiles by ',
        r.a({href: 'http://stamen.com'}, 'Stamen'),
        ' under ',
        r.a({href: 'http://creativecommons.org/licenses/by/3.0'}, 'CC BY 3.0'),
        '. Data by ',
        r.a({href: 'http://openstreetmap.org'}, 'OpenStreetMap'),
        ', under ',
        r.a({href: 'http://www.openstreetmap.org/copyright'}, 'ODbL'),
        '.'
      ])
    ]);
  }
});

var reactContainer = document.createElement('div');
document.body.style.margin = '0';
document.body.appendChild(reactContainer);
ReactDOM.render(r(App), reactContainer);
