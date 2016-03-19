define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');
	require('markercluster');

	var PersonListCollection = require('collections/PersonListCollection');
	var DataListView = require('views/DataListView');
	var DataCollection = require('collections/DataCollection');

	return DataListView.extend({
		uiTemplateName: 'mapViewTemplate',

		initialize: function(options) {
			console.log('MapView:initialize')
			this.options = options;

			this.collection = new DataCollection();
			this.collection.on('reset', this.render, this);
			this.collection.url = '/lebenslauf/api/locations';
			this.collection.fetch({
				reset: true
			});

			this.renderUI();

			this.renderMap();
		},

		renderMap: function() {
			this.map = L.map(this.$el.find('.map-container')[0]).setView([54.525961, 15.255119], 4);

			L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				subdomains: 'abcd',
				id: 'mapbox.outdoors',
				accessToken: 'pk.eyJ1IjoidHJhdXN0aWQiLCJhIjoib0tQVlcxRSJ9.886zIW04YDanKiDXRWG_SA'
			}).addTo(this.map);

			this.markers = new L.MarkerClusterGroup({
				showCoverageOnHover: false,
				maxClusterRadius: 40
			});
			this.map.addLayer(this.markers);
		},

		render: function() {
			console.log(this.collection.length)
			_.each(this.collection.models, _.bind(function(model) {
				var marker = L.marker([model.get('lat'), model.get('lng')], {
					title: model.get('name')
				}).bindPopup('<strong>'+model.get('name')+'</strong><br/>'+model.get('area')+'<br/><br/><a href="#place/'+model.get('id')+'">More information</a>');

				this.markers.addLayer(marker);
			}, this));
		}
	});
});