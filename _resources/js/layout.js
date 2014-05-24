var pageId, pageIds, visibleBack, visibleTop, visibleDirections;
var loadedFiles = 0;
var indexHero = 0;
var widthPrevious;
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};
$(function() {
	$("body").hide();
	$("img.lazy").lazyload({event: "force", effect: "fadeIn", effectspeed: durationPage, threshold: 500});
	preloadFiles();
	readAnchor();
	initiateGrid();
	initiatePillExternal();
	initiatePages();
	initiateFade();
	initiateHeaderNavigation();
	selectHeaderNavigation();
	initiateDirections();
	initiateHero();
	$(window).hashchange(hashChange);
	$(window).scroll(scroll);
	$(window).resize(resize);
	updateDirections();
	console.log("updateDirections();");
});
function preloadFiles() {
	$(files).each(function(i, e) {
		preloadFile(e);
	});
}
function preloadFile(url) {
	jQuery.ajax({
		url: url,
		beforeSend: function(xhr) {
			xhr.overrideMimeType("application/octet-stream");
		}
	}).done(function(data) {
		fileLoaded();
	});
}
function fileLoaded() {
	console.log("function fileLoaded() {");
	loadedFiles++;
	if (loadedFiles == files.length) {
		initiatePage();
	}
}
function initiatePage() {
	console.log("function initiatePage() {");
	$("body").show();
	$("body, html").delay(delayLoad).animate({"opacity": 1}, durationPage, "linear", function() {
		var current = $(".page#"+pageId);
		triggerLazyLoad(current);
	});
}
function readAnchor() {
	pageId = parseArchor();
}
function parseArchor() {
	pageIds = $.map($(".page"), function(n, i){
		return n.id;
	});
	var split = $(location).attr("href").split("#/");
	if (split.length == 2) {
		var pageIndex = $.inArray(split[1], pageIds);
		if (pageIndex != -1) {
			return split[1];
		}
	}
	var id = "home";
	hash(id);
	return id;
}
function hash(id) {
	var url = "#/"+id;
	if (id == "home") {
		url = "#/";
	}
	$(location).attr("href", url);
}
function initiateFade() {
	$("a.fade").each(function(i, e) {
		initiateFadeElement($(this));
	});
}
function initiateFadeElement(e) {
	var up = e.find(".up");
	var over = e.find(".over");
	over.lazyload({skip_invisible: false});
	var fadeIn = function() {
		up.stop().animate({"opacity": 0}, durationHover);
		over.show();
	};
	var fadeOut = function() {
		up.stop().animate({"opacity": 1}, durationHover, "linear", function() {
			over.hide();
		});
	};
	over.hide();
	if (isMobile.any()) {
		e.click(function() {
			over.show();
			up.css({"opacity": 0});
			setTimeout(fadeOut, durationHover);
		});
	} else {
		e.hover(fadeIn, fadeOut);
	}
}
function initiateGrid() {
	$(".grid .item a").each(function(i, e) {
		$(this).prepend("<div class='view'></div>");
		var view = $(this).find(".view");
		view.css({"opacity": 0});
		view.hide();
		var fadeIn = function() {
			view.show();
			view.animate({"opacity": 1}, durationHover);
		}
		var fadeOut = function() {
			view.stop().animate({"opacity": 0}, durationHover, "linear", function() {
				view.hide();
			});
		}
		if (isMobile.any()) {
			$(this).click(function() {
				view.show();
				view.css({"opacity": 1});
				setTimeout(fadeOut, durationHover);
			});
		} else {
			$(this).hover(fadeIn, fadeOut);
		}
	});
}
function initiatePillExternal() {
	$(".pill, .external").each(function(i, e) {
		$(this).html("<div class='over'></div><div class='up'></div><span>"+$(this).text()+"</span>");
	});
}
function initiatePages() {
	$(".page").each(function(i, e) {
		var id = $(this).attr("id");
		if (id != pageId) {
			$(this).hide();
		}
	});
}
function initiateHeaderNavigation() {
	$(navigationToggles).each(function(i, e) {
		if (e == pageId) {
			$("header #"+e+" a").css({"opacity": 0});
		} else {
			$("header #"+e+" span").css({"opacity": 0});
		}
		$("header #"+e+" a").click(function(element) {
			element.preventDefault();
			goToPage(e);
		});
	});
	$("header a.logo").click(function(e) {
		e.preventDefault();
		goToPage("home");
	});
}
function selectHeaderNavigation() {
	$(".toggle").each(function(i, e) {
		var id = $(this).attr("id");
		var a = $("li#"+id+" a");
		var span = $("li#"+id+" span");
		if (id == pageId) {
			span.animate({"opacity": 1}, durationFadeBetween, "linear");
			a.animate({"opacity": 0}, durationFadeBetween, "linear", function() {
				a.hide();
			});
		} else {
			span.animate({"opacity": 0}, durationFadeBetween, "linear");
			a.show();
			a.animate({"opacity": 1}, durationFadeBetween, "linear");
		}
	});
}
function initiateDirections() {
	$(".navigation .back").click(function(e) {
		e.preventDefault();
		goToPage("work");
	});
	$(".navigation .top").click(function(e) {
		e.preventDefault();
		goToTop();
	});
	$(".navigation .previous").click(function(e) {
		e.preventDefault();
		goToDirection(-1);
	});
	$(".navigation .next").click(function(e) {
		e.preventDefault();
		goToDirection(1);
	});
}
function initiateHero() {
	var heroItems = $.map($(".hero .item"), function(n, i){
		return n;
	});
	$(heroItems).each(function(i, e) {
		if (i == 0) {
			fadeHeroIn($(e));
		} else {
			$(e).hide();
		}
	});
	var heroFade = function () {
		var current = $(heroItems[modulo(indexHero, heroItems.length)]);
		var next = $(heroItems[modulo(indexHero+1, heroItems.length)]);
		fadeHeroOut(current);
		fadeHeroIn(next);
		current.css({"zIndex": 1});
		next.show();
		next.css({"zIndex": 0, "opacity": 1});
		current.animate({"opacity": 0}, durationHero, easeHero, function() {
			current.hide();
			current.css({"zIndex": 0});
		});
		indexHero++;
	};
	setInterval(heroFade, intervalHero);
}
function fadeHeroOut(e) {
	var h1 = e.find(".heading h1");
	var h2 = e.find(".heading h2");
	var a = e.find(".heading a");
	var easing = "easeInSine";
	h1.animate({opacity: 0}, durationHeroElement, easing);
	h2.delay(intervalHeroElement).animate({opacity: 0}, durationHeroElement, easing);
	a.delay(intervalHeroElement*2).animate({opacity: 0}, durationHeroElement, easing);
}
function fadeHeroIn(e) {
	var h1 = e.find(".heading h1");
	var h2 = e.find(".heading h2");
	var a = e.find(".heading a");
	var start = -10;
	var easing = "easeOutSine";
	var delay = durationHero*0.75;
	h1.css({"marginTop": start, opacity: 0});
	h2.css({"marginTop": start, opacity: 0});
	a.css({"marginTop": start, opacity: 0});
	h1.delay(delay).animate({"marginTop": 0, opacity: 1}, durationHeroElement, easing);
	h2.delay(delay+intervalHeroElement).animate({"marginTop": 0, opacity: 1}, durationHeroElement, easing);
	a.delay(delay+(intervalHeroElement*2)).animate({"marginTop": 0, opacity: 1}, durationHeroElement, easing);
}
function hashChange() {
	goToPage(parseArchor());
}
function scroll() {
	parallax();
	updateDirections();
}
function parallax() {
	if (!isMobile.any()) {
		var height = $(".hero .item").height();
		var current = $(document).scrollTop();
		var y = current*(height/550);
		$(".hero .parallax").css("top", 0.5*y);
		$(".hero .width").css("margin-top", -0.25*y);
	}
}
function updateDirections() {
	var current = $(document).scrollTop();
	var back = $(".navigation .back");
	var top = $(".navigation .top");
	var previous = $(".navigation .previous");
	var next = $(".navigation .next");
	var width = back.width();
	var valueDirectionVisible = -width/2;
	var valueDirectionInvisible = -width;
	var closeBack = function() {
		if (visibleBack) {
			back.stop().animate({"marginTop": valueDirectionInvisible, "marginLeft": valueDirectionInvisible}, durationDirectionInvisible, easeDirectionInvisible, function() {
				back.hide();
			});
			visibleBack = false;
		}
	}
	if (current > limitTop) {
		if (!visibleTop) {
			top.show();
			top.stop().animate({"marginTop": valueDirectionVisible}, durationDirectionVisible, easeDirectionVisible);
			visibleTop = true;
		}
	} else {
		if (visibleTop) {
			top.stop().animate({"marginTop": valueDirectionInvisible}, durationDirectionInvisible, easeDirectionInvisible, function() {
				top.hide();
			});
			visibleTop = false;
		}
	}
	if (pageId != "home" && pageId != "work" && pageId != "about") {
		if (current > limitTop) {
			if (!visibleBack) {
				back.show();
				back.stop().animate({"marginTop": valueDirectionVisible, "marginLeft": valueDirectionVisible}, durationDirectionVisible, easeDirectionVisible);
				visibleBack = true;
			}
		} else {
			$(closeBack);
		}
		if (!visibleDirections) {
			previous.show();
			next.show();
			previous.stop().animate({"marginLeft": valueDirectionVisible}, durationDirectionVisible, easeDirectionVisible);
			next.stop().animate({"marginRight": valueDirectionVisible}, durationDirectionVisible, easeDirectionVisible);
			visibleDirections = true;
		}
	} else {
		$(closeBack);
		if (visibleDirections) {
			previous.stop().animate({"marginLeft": valueDirectionInvisible}, durationDirectionInvisible, easeDirectionInvisible, function() {
				previous.hide();
			});
			next.stop().animate({"marginRight": valueDirectionInvisible}, durationDirectionInvisible, easeDirectionInvisible, function() {
				next.hide();
			});
			visibleDirections = false;
		}
	}
}
function resize() {
	var width = $(".navigation .back").width();
	if (width != widthPrevious) {
		if (visibleTop || visibleDirections) {
			if (visibleBack) visibleBack = !visibleBack;
			if (visibleTop) visibleTop = !visibleTop;
			if (visibleDirections) visibleDirections = !visibleDirections;
			parallax();
			updateDirections();
		}
	}
	widthPrevious = width;
}
function triggerLazyLoad(e) {
	if (pageId == "about") {
		$(e).find("img.lazy").trigger("force");
	} else {
		$(e).find("img.lazy").lazyload();
	}
	$(window).resize();
	$(window).scroll();
}
function goToPage(id) {
	if (id != pageId && $.inArray(id, pageIds) != -1) {
		var fade = function() {
			var current = $(".page#"+pageId);
			var next = $(".page#"+id);
			current.delay(durationPage/2).animate({"opacity": 0}, durationPage/2, "linear", function() {
				current.hide();
				next.show();
				next.css({"opacity": 0.01});
				next.animate({"opacity": 1}, durationPage/2, "linear");
				triggerLazyLoad(next);
				updateDirections();
			});
			pageId = id;
			selectHeaderNavigation();
			hash(id);
			if ($.inArray(pageId, nonProjectPageIds) != -1) {
				updateDirections();
			}
		};
		if ($(window).scrollTop() == 0) {
			$(fade);
		} else {
			$("body, html").animate({"scrollTop": 0}, durationPage, easeScroll, fade);
		}
		customGoToPage(pageId);
	}
}
function goToTop() {
	$("body, html").animate({"scrollTop": 0}, durationPage, easeScroll);
}
function goToDirection(direction) {
	var projectIds = projectPageIds();
	var index = $.inArray(pageId, projectIds);
	var nextIndex = modulo(index+direction, projectIds.length);
	var nextId = projectIds[nextIndex];
	goToPage(nextId);
}
function projectPageIds() {
	var ids = [];
	for (var i = 0; i < pageIds.length; i++) {
		var index = pageIds[i];
		if ($.inArray(index, nonProjectPageIds) == -1) {
			ids.push(index);
		}
	}
	return ids;
}
function modulo(index, total) {
	return (index+total) % total;
}