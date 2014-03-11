// Important line
	"use strict";

(function($) {

// COUNTDOWN PLUGIN
	
	window.countdown = {
		config: {
			end: 	'December 1, 2014 00:00:00',
			server: true,
			expiry: 'http://google.com/'	
		},
	
		init: function() {
			
			if ( 0 == $('#countdown').length ) return false;
			
			var dataConf = $('#countdown').data();
						
			countdown.config.end 	= dataConf.end;
			countdown.config.server = dataConf.serversync;
			countdown.config.expiry = dataConf.expiryurl;
						
			// Create some HTML for countdown
			var __divTPL = '<div class="num"><div>-</div><div class="last">-</div></div>';
			
			$('#countdown > div').each(function(k){
				var m = ( 0 == k ) ? 3 : 2;
				
				$(this).empty();
				
				for ( var i = 0; i < m; i++ ) {
					$(this).append(__divTPL);
				}
				
				$('<span/>').text( $(this).data('label') ).appendTo( this );
			});
			
			$('#cd').countdown({
				until: 		new Date( countdown.config.end ),
				compact: 	true,
				onTick: 	countdown.tick,
				serverSync: countdown.serverTime,
				expiryUrl:  countdown.config.expiry,
				alwaysExpire: true
			});
		},
		
		tick: function(time) {
			// Every sec
			
			time.splice(0, 3);
						
			var arrOfNum = [];
			$.each(time, function(key, val){
				
				var strVal = val.toString();				
				var max = ( 0 == key ) ? 3 : 2;
				
				if ( strVal.length < max ) {
					for ( var i = 1; i = max - strVal.length; i++ ) {
						strVal = '0' + strVal;	
					}
				}
				
				var tempArr = strVal.split("");
				$.each(tempArr, function(k, num){
					arrOfNum.push(num);
				});
			});
						
			$('#countdown .num .last').each(function( key ) {
				
				var $curr = $(this).prev();
				var currH = $curr.height();
								
				if ( $curr.text() == arrOfNum[ key ] ) {
					return true;
				}
				
				$(this)
					.text( arrOfNum[ key ] )
					.css({ opacity: 0, rotateX: 120 })
					.transition({ opacity: 1, rotateX: 0 }, 800, 'easeInOutCubic');
				
				$curr.transition({ marginTop: -currH, opacity: 0, rotateX: 120 }, 800, 'easeInOutCubic', function() {
					
					$(this)
						.text( arrOfNum[ key ] )
						.css({ marginTop: 0, opacity: 1, rotateX: 0 });
				});
			});
			
		},
		
		serverTime: function() {
		
			// Sync time with server (local time)
		    var time = null;
		    
		    if ( false == countdown.config.server ) {
		    	return time;
		    }
		    
		    $.ajax({url: 'engine/time-sync.php', 
		        async: false, dataType: 'text', 
		        success: function( text ) { 
		            time = new Date( text ); 
		        }, error: function( http, message, exc ) { 
		            time = new Date();
				}
		    }); 
		    return time; 
		}
	};
	
})(jQuery);
