// Important line
	"use strict";

window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var _navigator = navigator.userAgent.toLowerCase();

window.is_safari  = ( _navigator.indexOf('safari') != -1 && _navigator.indexOf('chrome') == -1 );
window.is_firefox = _navigator.indexOf('firefox') > -1;
window.is_ie 	  = _navigator.indexOf('msie') > -1;

// SETTINGS
window.parallax_enabled  = true; // Turn on/off "Parallax Effect"
window.preloader_enabled = true; // Turn on/off "Preloader"

window.scrollTo(0, 0);

(function($) {

	// All jQuery scripts must be here
	
	var $window = $(window);
		window.windowWidth = 0,
		window.windowHeight = 0;
			
	window.addEventListener('DOMContentLoaded', function() {
		// TOUCH-DEVICES ON READY TOO
				
    	$('body').queryLoader2({ onLoadComplete: on_load });
	});
	
	$(document).ready(function() {
		// ON DOM READY

		init([ 'countdown', 'twitter' ]);
		
		window.exist_header = $('body > header').length > 0;
		window.exist_newsletter = $('#newsletter').length > 0;
		
		window.first_page_height = $('body > .page:first').height();
		window.lastScreen = $(document).height() - $(window).height();

		if ( true == isMobile ) {
			// Disable parallax for touch devices
			parallax_enabled = false;
		}

		// Init patterns
		$('.pattern').each(function() {
			
			var $this = $(this);
			
			if ( true == $this.hasClass('color-layout') ) {
				var color = $this.data('color');
				$this.css({ backgroundColor: color });
			}
		});
		
		// Init Parallax 
		if ( true == window.parallax_enabled ) {
			$.stellar({
				responsive: true,
				horizontalScrolling: false,
				hideDistantElements: false,
				positionProperty: 'transform'
			});
		}
		
		// Fonts fix
		if ( true == is_safari ) {
			$('body').addClass('fontfix');
		}
		
		// Enable Video
		if ( true == $('#home').data('video') ) {
			var video_params = $('#home').data();
			$('#home > .content').okvideo({
				video: video_params.url,
				volume: video_params.volume,
				loop: video_params.loop
			});
		}
		
		// Placeholder fix
		$('input, textarea').placeholder();
	});
	
	$(window).on({
		resize: on_resize,
		scroll: on_scroll
	}).scrollStopped( on_scroll_end );
	
	function init( objs ) {

		$.each( objs, function( index, obj_name ) {
						
			if ( 'object' == typeof window[obj_name] ) {
				window[obj_name].init();
			}	
		});
		
	}
	
	function on_load() {
	
		$('#preloader .wrapper').animate({ opacity: 0 }, function() {
			
			if ( false == isMobile ) {
				
				// Show homepage
				$('#home')
					.css({ opacity: 0, scale: 0.7 })
					.transition({ opacity: 1, scale: 1 }, 1000, 'easeOutQuint');
				
				// Show countdown 
				$('#countdown > div').each(function(k) {
					$(this)
						.css({ top: -100, opacity: 0 })
						.transition({ top: 0, opacity: 1, delay: k * 100 }, 1300, 'easeOutQuint');
				});
				
				// Show header
				$('body > header')
					.css({ top: - $('body > header').height(), opacity: 0 })
					.transition({ top: 0, opacity: 1 }, 1000, 'easeOutQuint');
			}
			
			// Hide preloader
			$('#preloader .half').transition({ width: 0 }, 800, 'easeOutQuint', function() {
				$('#preloader').hide();
				
				// Fix footer
				$('body > footer').css({ zIndex: 2 });
			});	
		});
		
		// FOOTER
		var $footer_sections = $('body > footer section');
		
		var footer_align = function() {
			if ( $footer_sections.length > 0 && windowWidth > 480 ) {
				$footer_sections
					.css({ left: '100%', opacity: 0 })
					.first().removeAttr('style');
				
				if ( $('#last-section').length > 0 ) {
					$('#last-section nav li:first-child a').trigger('click');
				}
			} else {
				$footer_sections.removeAttr('style');
			}
		}
		
		$(window).resize(function() {
			lastScreen = $(document).height() - $(window).height();
			footer_align();
		}).resize();
	}
	
	function on_resize() {
		
		windowWidth = $(window).width();
		windowHeight =	$(window).height();
		
		lastScreen = $(document).height() - $(window).height();
		align_triangle();
	}
		
	function on_scroll() {
		
		window.scroll_now = $window.scrollTop();
		
		// Show dark header
		
		if ( true == exist_header ) {
			
			var $header = $('body > header'),
				headerHeight = $header.height();
			
			if ( scroll_now >= first_page_height - headerHeight - 70 ) {
				
				if ( false == $header.hasClass('done') ) {
					$header
						.css({ marginTop: -headerHeight })
						.addClass('dark done')
						.stop(true, true)
						.transition({ marginTop: 0 });
				}
			} else {
				if ( true == $header.hasClass('done') ) {
					$header
						.removeClass('done')
						.stop(true, true)
						.transition({ marginTop: -headerHeight }, function() {
							$(this)
								.removeClass('done')
								.stop(true, true)
								.transition({ marginTop: 0 })
								.removeClass('dark');
						});
				}
			}
		}
		
		// Horizontal Parallax
		if ( true == exist_newsletter && true == parallax_enabled ) {
			
			$('#newsletter').css({ backgroundPosition: scroll_now * 0.15 + 'px 0' });
		}
	}

	function on_scroll_end() {
		
		$('.page').each(function() {
			
			var $this = $(this);
			
			if ( scroll_now > $this.offset().top - 175 ) {
				
				var id = $this.attr('id'),
					$a = $('header nav > ul > li a[href="#' + id + '"]');
				
				if ( $a.length > 0 ) {
					$a.parents('ul').find('a').removeClass('current');
					$a.addClass('current');
				}
			}
		});
		
		if ( scroll_now > lastScreen - 30 ) {
			$('body > header nav ul > li a')
				.removeClass('current')
				.parent()
				.last()
				.find('a')
				.addClass('current');
		}
	}
	
	// GO TO
	function goto_about(e) {
		
		e.preventDefault();
		
		if ( $('#about').length > 0 ) {
			
			var header_height = 0;
			
			if ( true == exist_header && windowWidth > 480 ) {
				header_height = $('body > header').height() * 1.5;
			}
		
			var about_top = $('#about').offset().top - header_height;
			$('html, body').animate({ scrollTop: about_top }, 1000, 'easeInOutQuint');
		}
	}
	
	function goto_subscribe(e) {
		
		e.preventDefault();
		
		if ( $('#subscribe').length > 0 ) {
			
			if ( $('#last-section nav').length > 0 ) {
				$('#last-section nav a[data-page="subscribe"]').trigger('click');
			}
							
			var page_height = ( windowWidth <= 480) ? $('#subscribe').offset().top : $(document).height();
			$('html, body').animate({ scrollTop: page_height }, 1500, 'easeInOutCubic', function() {
				$('#subscribe input[name="email"]').focus();
			});
		}
	}
	
	//  HEADER NAVIGATION (ON CLICK)
	function page_nav(e) {
		
		e.preventDefault();
		
		var $this = $(this),
			id = $this.attr('href'),
			offsetTop = $(id).offset().top;
		
		if ( true == exist_header ) {
			offsetTop -= $('body > header').height() * 1.5;
		}
		
		$('html, body').animate({ scrollTop: offsetTop }, 700);
		
		$this.parents('ul').find('a').removeClass('current');
		$this.addClass('current');
	}
	
	
	// LAST SECTION NAVIGATION (ON CLICK)
	function last_section_nav(e) {
		
		e.preventDefault();
		
		var $this = $(this),
			prev_id = '#' + $this.parents('ul').find('.current').data('page');
				
		if ( $this.hasClass('current') ) {
			return false;
		}
		
		$this.parents('ul').find('a').removeClass('current');
		$this.addClass('current');
		
		// Move triangle
		align_triangle();
		
		// Move block
		var id = '#' + $this.data('page');
		
		if ( $(id).index() > $(prev_id).index() ) {
			// Forward
			
			$(prev_id).transition({ left: - $(prev_id).width(), opacity: 0 });
			$(id).css({ left: '100%' }).transition({ left: 0, opacity: 1 });
			
		} else {
			// Back
			
			$(prev_id).transition({ left: '100%', opacity: 0 });
			$(id).css({ left: -$(id).width() }).transition({ left: 0, opacity: 1 });
		}
	}
	
	// TRIANGLE ALIGNMENT
	function align_triangle() {
		
		var $triangle = $('#last-section .triangle'),
			last_section_display = $('#last-section').css('display');
		
		if ( $triangle.length > 0 && last_section_display != 'none' ) {
		
			var $li_first = $('#last-section nav a.current').parent();
			
			if ( $li_first.length < 1 ) {
				$li_first = $('#last-section nav a:first-child').parent();
			}
			
			var triangle_left = $li_first.offset().left + $li_first.width() / 2 - 30;
			
			$triangle.stop(true, true).transition({ left: triangle_left });
		} 
	}
	
	// Send subscribe
	function send_subscribe(e) {
	
		e.preventDefault();
		
		var $form = $(this);
		
		if ( $form.hasClass('sent') ) {
			return false;
		}
		
		$form.addClass('sent').transition({ opacity: 0.5 })
			.find('input[type="submit"]').css({ cursor: 'default' });
		
		$.ajax({
			url: $form.attr('action'),
			type: $form.attr('method'),
			data: $form.serialize(),
			dataType: 'json',
			success: function(response) {
				
				var $status = $form.find('.status'),
					text = $status.data('error'),
					inputH = $form.height();
				
				if ( 1 == response.status ) {
					text = $status.data('success');
					$form.find('input[type=email]').val("");
				} else {
					text = response.data;
				}
				
				$form.removeClass('sent').transition({ opacity: 1 })
					.find('input[type="submit"]').css({ cursor: 'pointer' });
					
				$status.height( inputH ).text( text );
				$form.find('input').transition({ marginTop: -inputH });
				
				setTimeout(function() {
					$form.find('input').transition({ marginTop: 0 });
				}, 2000);
			}
		})
	}
	
	// Send feedback
	function send_feedback(e) {
		
		e.preventDefault();
		
		var $form = $(this);
		
		if ( $form.hasClass('sent') ) {
			return false;
		}
		
		$form.addClass('sent').transition({ opacity: 0.5 })
			.find('input[type="submit"]').css({ cursor: 'default' });
		
		$.ajax({
			url: $form.attr('action'),
			type: $form.attr('method'),
			data: $form.serialize(),
			success: function(response) {
				
				var $status = $form.find('.status'),
					text = $status.data('error');
				
				if ( 1 == response ) {
					text = $status.data('success');
					$form.find('input[type=text], input[type=email], textarea').val("");
				}
							
				$status.css({ opacity: 0 }).text( text )
					.transition({ opacity: 1 });
				
				$form.removeClass('sent').transition({ opacity: 1 })
					.find('input[type="submit"]').css({ cursor: 'pointer' });
				
				setTimeout(function() {
					$status.transition({ opacity: 0 });
				}, 2000);
			}
		})
	}

	// BINDS
	$(document)
		.on('click', '#home .learn-more', goto_about)
		.on('click', '#newsletter a.btn', goto_subscribe)
		.on('click', 'body > header nav li > a', page_nav)
		.on('click', '#last-section nav a', last_section_nav)
		.on('submit', '#subscribe form', send_subscribe)
		.on('submit', '#feedback form', send_feedback)
		.on('click', '#last-section nav a[data-page="contacts"]', map_init)
			
})(jQuery);