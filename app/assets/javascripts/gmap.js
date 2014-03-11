// Important line
	"use strict";

(function($) {
	
	var map,
		markers = [],
		markers_g = [],
		infowindow = [];

	window.map_init = function() {
		
		if ( $('#contacts').hasClass('done') ) {
			return false;
		}
		
		$('#contacts').addClass('done');
				
		var $map = $('#map'),
			latitude  = $map.data('latitude'),
			longitude = $map.data('longitude');
							
		// CENTERING THE MAP
		var myLatlng = new google.maps.LatLng(latitude, longitude);
		
		var bool_draggable = ( ! window.isMobile ),
			bool_panControl = bool_draggable;
				
		// MAIN OPTIONS OF MAP
		var mapOptions = {
			zoom: 15,
			center: myLatlng,
			scrollwheel: false,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			panControl: bool_panControl,
			panControlOptions: {
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			draggable: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		// Get Markers
		$map.find('div').each(function() {
			
			var $this = $(this);
			
			markers.push({
				position: new google.maps.LatLng( $this.data('latitude'), $this.data('longitude') ),
				title: $this.data('title'),
				content: $this.html()
			});
		});
		
		// DRAWING THE MAP
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		
		// Draw markers
		$.each(markers, function(index, marker) {
			markers_g[ index ] = new google.maps.Marker({
				position: marker.position,
				map: map,
				title: marker.title
			});
			
			if ( marker.content.length > 0 ) {
				infowindow[ index ] = new google.maps.InfoWindow({
					content: marker.content
				});
				
				google.maps.event.addListener(markers_g[ index ], 'click', function() {
					infowindow[ index ].open(map, this);
				});
			}
		});
	}
})(jQuery);