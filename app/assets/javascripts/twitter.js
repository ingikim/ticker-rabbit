// Important line
	"use strict";

(function($) {

// TWITTER PLUGIN

	window.twitter = {
	
		init: function() {
			
			$('.twitter').each(function() {
				
				if ( $(this).data('username').length < 1 || $(this).data('count').length < 1 ) {
					return true;
				}
				
				twitter.get_tweets( $(this) );
			});
		},
		
		get_tweets: function( $twi_block ) {
						
			var username = $twi_block.data('username'),
				count 	 = $twi_block.data('count');
			
			$.ajax({
				url: 'engine/twitter/get_tweets.php',
				data: {
					screen_name: username,
					count: count
				},
				dataType: 'json',
				success: function( data ) {
					
					var tpl = '';
					
					$.each(data, function( index, tweet ) {
						
						var date = twitter.str_tweet_date( tweet.created_at );
					
						tpl += '<li><div class="text">' + tweet.text + '</div>';
						tpl += '<div class="actions">';
						tpl += '<a href="http://twitter.com/intent/tweet?in_reply_to=' + tweet.id_str + '" target="_blank"><span class="fa fa-reply"></span>Reply</a>';
						tpl += '<a href="http://twitter.com/intent/retweet?tweet_id=' + tweet.id_str + '" target="_blank"><span class="fa fa-retweet"></span>Retweet</a>';
						tpl += '<a href="http://twitter.com/intent/favorite?tweet_id=' + tweet.id_str + '" target="_blank"><span class="fa fa-star"></span>Favourite</a>';
						tpl += '</div><div class="date"><a href="https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '" target="_blank">' + date + '</a></div></li>';
					});
								
					$twi_block.empty().html( tpl );
					
					$twi_block.find('li > div.text').tweetLinkify();
					twitter.enable( $twi_block );
				}
			});
		},
		
		enable: function( $twi_block ) {
			
			$twi_block.find('li:first').addClass('current');
			
			var $ul = $twi_block; 
			
			setInterval(function() {
				var $li   = $ul.children('li'),
					$curr = $ul.children('.current');
				
				if ( $curr.next().length < 1 ) {
					$li.animate({ marginTop: 0 }, function(){
						$li.removeClass('current')
							.first().addClass('current');
					});	
				} else {
				
					var mt = ( windowWidth <= 768 ) ? 185 : 140;
				
					$curr.animate({ marginTop: -mt, opacity: 0 }, function() {
						$(this)
							.css('opacity', 1)
							.removeClass('current')
						.next().addClass('current');
					});
				}	
			}, 5000);
		},
		
		str_tweet_date: function( tweet_d ) {
			//  Localize the date (Twitter widget)
			var n = 1000,
				o = n * 60,
				p = o * 60,
				s = p * 24,
				m = s * 7;
			
			var u = new Date() - new Date( tweet_d );	
	
			if ( isNaN( u ) || u < 0 ) return "";
			if ( u < n * 2 ) return "right now";
			if ( u < o ) return Math.floor( u / n ) + " seconds ago";
			if ( u < o * 2 ) return "about 1 minute ago";
			if ( u < p ) return Math.floor( u / o ) + " minutes ago";
			if ( u < p * 2 ) return "about 1 hour ago";
			if ( u < s ) return Math.floor( u / p ) + " hours ago";
			if ( u > s && u < s * 2 ) return "yesterday";
			if ( u < s * 365 ) { return Math.floor( u / s ) + " days ago" } else { return "over a year ago" }
		}
	};

})(jQuery);