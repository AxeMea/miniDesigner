function miniDesigner(opts){

	function _isPC(){  
       var UA = navigator.userAgent,
       	   Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");   
       for (var v = 0; v < Agents.length; v++) {  
           if (UA.indexOf(Agents[v]) >= 0) { return false }  
       }  
       return true;  
	} 

	function _initDesignerForPC(){
		opacityBtn.on('mousedown',function(){
			opacitySlide.on('mousemove',function(e){
				var opacity = 0;

				if(e.pageX <= opacitySlide.width() - 85){
					
					opacity = Math.round((e.pageX / (opacitySlide.width() - 85)) * 100) / 100;

					opacityScroll.css({
						width:e.pageX - 10
					});

					mask.css({
						opacity: opacity
					});

					maskOpacity = opacity;
					_changehash();
				}
			});
		});

		opacitySlide.on('mouseup',function(){
			opacitySlide.off('mousemove');
		});

		mask.on('mousedown',function(e){
			$(this).on('mousemove',function(e){
				$(this).css({
					left:e.pageX - innerToLeft,
					top:e.pageY - innerToTop
				});

				maskLeft = e.pageX - innerToLeft;
				maskTop = e.pageY - innerToTop; 
				_changehash();
			});
			innerToLeft = e.pageX - parseInt($(this).css('left'));
			innerToTop = e.pageY - parseInt($(this).css('top'));
			e.preventDefault();
		});

		mask.on('mouseup',function(){
			$(this).off('mousemove');
		});

		mask.addClass('for-pc');
	}

	function _initDesignerForMobile(){
		opacityBtn.on('touchmove',function(e){
			e.preventDefault();
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
				opacity = 0;

			if(	  touch.pageX >= 0
				&&touch.pageX <= opacitySlide.width() - 85){
				opacity = Math.round((touch.pageX / (opacitySlide.width() - 85)) * 100) / 100;

				opacityScroll.css({
					width:touch.pageX
				});
				mask.css({
					opacity:opacity 
				});

				maskOpacity = opacity;
				_changehash();
			}
		});

		mask.removeClass('for-pc');
	}

	function _changehash(){
		window.location.href = '#opacity=' + maskOpacity + '&left=' + maskLeft + '&top=' + maskTop + '&scroll=' + scrollTop;
	}

	function _getHashValue(key){
		// var re =new RegExp( key +'=\\w{1,}&{0,}');
		var re =new RegExp( key +'=-?[0-9]+(\.[0-9]{0,2})?');
		var value = '0'; 

		if(value = re.exec(window.location.hash))
			value = value[0];
		else
			value = '0';

		return value.replace(key + '=','').replace('&','');
	}

	function _restoreStates(){
		mask.css({
			left:maskLeft - 0,
			top:maskTop - 0,
			opacity:maskOpacity
		});

		window.scrollTo(0,parseInt(scrollTop));

		opacityScroll.css({
							width:maskOpacity * (opacitySlide.width() - 85)
						});		
	}

	var args = $.extend({},{
		picture:'design.png',
		debug:true
	},opts);

	if(args.debug){
		var html = '<style>\
					.mini-designer-mask{position:absolute;left:0px;top:0px;width:100%;display:none;z-index:9999999;opacity:0}\
					.mini-designer-mask.for-pc{cursor:move;width:auto;}\
					.mini-designer-mask img{width:100%}\
					.mini-designer-mask.for-pc img{width:auto;}\
					.mini-designer-slide{z-index:9999999;position:fixed;bottom:0px;left:0px;width:100%;height:40px;background:#394049}\
					.mini-designer-scroll{min-width:20px;position:absolute;background:#66DBF1;display:inline-block;height:3px;top:0px}\
					.mini-designer-btn{cursor:pointer;width:20px;position:absolute;right:0px;top:-9px;height:20px;background:#28A4C0;border-radius:50%}\
					.mini-designer-btn:active{background:#2E8093}\
					.mini-designer-scroll-box{background:#E6FFFF;height:2px;margin-top:20px;position:relative}\
					.mini-designer-inner{padding:0px 80px 0px 20px}\
					.mini-designer-reset{background:rgb(154, 156, 159);border:0px;position:absolute;right:20px;top:9px;padding:5px;color:rgb(71, 67, 60);border-radius:4px}\
				</style>\
				<div class="mini-designer-mask for-pc">\
					<img src="' + opts.picture + '"/>\
				</div>\
				<div class="mini-designer-slide">\
					<div class="mini-designer-inner">\
						<div class="mini-designer-scroll-box">\
							<div class="mini-designer-scroll">\
								<div class="mini-designer-btn">\
								</div>\
							</div>\
						</div>\
						<button class="mini-designer-reset">重置</button>\
					</div>\
				</div>';

		$('body').append(html);

		var mask = $('.mini-designer-mask'),
			opacityBtn = $('.mini-designer-btn'),
			opacityScroll = $('.mini-designer-scroll'),
			opacitySlide = $('.mini-designer-slide'),
			maskOpacity = _getHashValue('opacity') ||  0,
			maskLeft = _getHashValue('left') ||  0,
			maskTop = _getHashValue('top') ||  0,
			scrollTop = _getHashValue('scroll') ||  0,
			resetBtn = $('.mini-designer-reset');

		var innerToTop = 0,
			innerToLeft = 0;

		setTimeout(function(){
			mask.fadeIn(function(){
				_restoreStates();
			});
		},200);
		

		$(window).on('scroll',function(){
			scrollTop = window.scrollY ||  window.scrollTop;
			_changehash();
		});

		resetBtn.on('click',function(){
			maskOpacity = 0;
			maskLeft = 0;
			maskTop = 0;
			scrollTop = 0;
			_changehash();
			window.location.href="";
		});

		if(_isPC())
			_initDesignerForPC();
		else
			_initDesignerForMobile();
	}
}
