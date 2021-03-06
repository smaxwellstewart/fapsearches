// Portfolio
(function($) {
	"use strict";

	// PORTFOLIO STUFF
	var makePortfoltio = function() {
		var $container = $('.portfolio'),
			$items = $container.find('.portfolio-item'),
			portfolioLayout = 'fitRows';
			
			if( $container.hasClass('portfolio-centered') ) {
				portfolioLayout = 'masonry';
			}
					
			$container.isotope({
				filter: '*',
				animationEngine: 'best-available',
				layoutMode: portfolioLayout,
				animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false
			},
			masonry: {
			}
			}, refreshWaypoints());
			
			function refreshWaypoints() {
				setTimeout(function() {
				}, 1000);   
			}
					
			$('nav.portfolio-filter ul a').on('click', function() {
					var selector = $(this).attr('data-filter');
					$container.isotope({ filter: selector }, refreshWaypoints());
					$('nav.portfolio-filter ul a').removeClass('active');
					$(this).addClass('active');
					return false;
			});
			
			function getColumnNumber() { 
				var winWidth = $(window).width(), 
				columnNumber = 1;
			
				if (winWidth > 1200) {
					columnNumber = 5;
				} else if (winWidth > 950) {
					columnNumber = 4;
				} else if (winWidth > 600) {
					columnNumber = 3;
				} else if (winWidth > 400) {
					columnNumber = 2;
				} else if (winWidth > 250) {
					columnNumber = 1;
				}
					return columnNumber;
				}       
				
				function setColumns() {
					var winWidth = $(window).width(), 
					columnNumber = getColumnNumber(), 
					itemWidth = Math.floor(winWidth / columnNumber);
					
					var portfolio = $container.find('.portfolio-item');
					$.each(portfolio, function(index, value) { 
						$(this).css( { 
						width : itemWidth + 'px' 
					});
				});
			}
			
			function setPortfolio() { 
				setColumns();
				$container.isotope('reLayout');
			}
				
			$container.imagesLoaded(function () { 
				setPortfolio();
			});
			
			$(window).on('resize', function () { 
			setPortfolio(); 		         
		});
	}

	var apiCall = function(url, callback) {
		$.ajax({
			url: url,
			dataType: 'json',
		}).done(callback);
	}

	var blogItems = function(data) {
		$('#blogItems').html('');
		$.each(data.data, function(index, value) {
			var n = value.article.indexOf('.');
			var p = value.article.indexOf('\n', n+1);
			if(p !== -1) {
				var intro = value.article.substring(0, p);
			} else {
				var intro = value.article;	
			}
			
			var item = '<!-- Blog Post 1 --><p><img class="img-responsive" src="'+value.img+'"></p><a href="/blog/'+value.slug+'"><h3 class="ctitle">'+value.title+'</h3></a><p><csmall>Posted: '+value.timeCreated+'.</csmall> | <csmall2>By: '+value.author+'</csmall2></p>'+marked(intro)+'<p><a class="btn btn-primary" href="/blog/'+value.slug+'">Read More</a></p>';

	 		if(data.data.length !== (index+1)) {
	 			item += '<div class="hline"></div><div class="spacing"></div>';
	 		}

	 		$('#blogItems').append(item);
		});
	}

	var recentPosts = function(data) {
		$('.portfolio').html('');
		$('.popular-posts').html('');
		var home = $('html').hasClass('index');

		$.each(data.data, function(index, value) {
			if(home) {
				var item = '<div class="portfolio-item graphic-design"><div class="he-wrap tpl6"><img src="'+value.img+'" alt=""><div class="he-view"><div class="bg a0" data-animate="fadeIn"><h3 class="a1" data-animate="fadeInDown">'+value.title+'</h3><a href="/blog/'+value.slug+'" class="dmbutton a2" data-animate="fadeInUp"><i class="fa fa-link"></i></a></div><!-- he bg --></div><!-- he view --></div><!-- he wrap --></div><!-- end col-12 -->';
	 			$('.portfolio').append(item);
			} else {
				var item = '<li><a href="/blog/'+value.slug+'"><div class="pull-left thumb-div" style="background-image:url(\''+value.img+'\')">&nbsp;</div></a><h6 class="ctitle"><a href="/blog/'+value.slug+'">'+value.title+'</a></h6><em>Posted on '+value.timeCreated+'</em></li>';
	 			$('.popular-posts').append(item);
			}
		});
		makePortfoltio();
	}

	var blogPost = function(data) {
		$('.article-img').attr('src', data.img);
		$('.article-link').attr('href', '/blog/'+data.slug);
		$('.article-title').html(data.title);
		$('.article-text').html(marked(data.article));
		$('.article-author').html(data.author);
		$('.article-date').html(data.timeCreated);
	}


	if(window.location.pathname === '/' ||  window.location.pathname === '/blog' ||  window.location.pathname.substring(0, 6) === '/blog/') {
		apiCall('/api/blog', recentPosts);
	};

	if( window.location.pathname === '/blog' ) {
		apiCall('/api'+window.location.pathname + window.location.search, blogItems);
	}


})(jQuery);