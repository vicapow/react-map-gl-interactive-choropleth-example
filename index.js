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
var mapStyle = Immutable.fromJS(rasterTileStyle([tileSource]));

var App = React.createClass({
  getInitialState: function getInitialState() {
    return {
      map: {
        latitude: 37.78,
        longitude: -122.45,
        zoom: 11,
        mapStyle: mapStyle,
        width: window.innerWidth,
        height: window.innerHeight
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

var reactContainer = document.createElement('div');
document.body.style.margin = '0';
document.body.appendChild(reactContainer);
ReactDOM.render(r(App), reactContainer);
