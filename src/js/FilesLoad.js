/**
 * 文件模块化加载
 * 依赖LABjs组件
 * @authors Petrus.Law (Petrus.law@outlook.com)
 * @github http://www.github.com/pyrinelaw
 * @date    2015-07-27 14:29:14
 * @version 0.0.1
 */
(function(win){

	var regCss = /^.+(\.css\?*.*)$/i;
	var regJs = /^.+(\.js\?*.*)$/i;

	/**
	 * 把dataObj中的属性添加给targetObj,isReplace表示是否替换原有属性，默认为false
	 * 可以简单的理解为jQuery中的extend方法
	 */
	var objValueCopy = function(targetObj, dataObj, isReplace) {
	    if(!targetObj || !dataObj) return;
	    isReplace = isReplace || false;
	    for(var key in dataObj){
	        //标记key是否已经存在在在targetObj中
	        var flag = targetObj.hasOwnProperty(key);
	        if(flag &&! isReplace) continue;
	        targetObj[key] = dataObj[key];
	    }
	}

	/**
	 * 加载单张图片
	 * @param url String 图片路径
	 * @param cb Function 加载成功回调方法
	 * @param errorCb Function 加载失败回调方法
	 */
	var loadImage = function(url, cb, errorCb){
		
		var img = new Image();
		
		img.src = url;
		
		// 图片已加载过的情况下直接调用回调函数
	    if (img.complete) {
	        if(cb) cb();
	    } else {
	        img.onload = function() {
	            if(cb) cb();
	        };
	        img.onerror = function(a) {
	        	if(errorCb) errorCb();
	        };
	    }
	}

	/**
	 * 加载多张图片
	 * 循环加载单张图片
	 */
	var loadImages = function(images, cb, errorCb){
		var images = images || [];

		for(var i=0; i<images.length; i++){
			loadImage(images[i], cb, errorCb);
		}
	}
	
	/**
	 * 加载js文件
	 * 加载顺序上处理不是太好，后续改进
	 */
	var loadJs = function(file, callback) {
		
		var js = js || [];
		
		$LAB.script(file).wait(function() {
			if(callback) callback();
		});

	}

	/**
	 * 加载css文件
	 * IE可以通过attachEvent方法判断css加载成功与否
	 * 其他浏览器判断css加载完成方法比较蹩脚
	 * 加载css文件不做失败处理,一律成功处理
	 */
	var loadCss = function(file, callback) {

		var head = document.getElementsByTagName('head')[0];
		var cssEl = document.createElement('link');

		cssEl.setAttribute('rel', 'stylesheet');
		cssEl.setAttribute('charset', 'utf-8');
		cssEl.setAttribute('media', 'all');
		cssEl.setAttribute('type', 'text/css');
		cssEl.href = file;

		head.appendChild(cssEl);

		if(callback) callback();
	}

	/**
	 * 模块化加载
	 * 目前暂未考虑css加载
	 */
	var FilesLoad = function(settings) {

		var counts = 0,
			errorCounts = 0;
		
		var options = {
			files: [],	// 预加载文件列表
			reTimes: 0,	// 重新加载次数
			// 回调函数
			callbacks: {	
				before: null,	// 加载前
				loading: null,	// 加载中
				after: null,	// 全部加载完成
				success: null,	// 全部加载成功、与after不同的是，success表示所有文件都加载成功，after有可能文件加载失败也会回调
				error: null		// 加载失败
			}
		};

		settings = settings || {};
		// 已重复加载次数
		settings.times = settings.times || 0;
		objValueCopy(settings, options);

		var	counts = settings.files.length;
			callbacks = settings.callbacks;

		var loadedCb = function(){
			
			if(counts == 0) {
				if(callbacks.after && (settings.times == settings.reTimes || errorCounts == 0)) {
					callbacks.after();
				}
				if(errorCounts ==0 && callbacks.success){
					callbacks.success();
				}
				if(errorCounts > 0) {
					if(settings.times < settings.reTimes){
						settings.times++;
						// 重新加载
						FilesLoad(settings);
					} else if(callbacks.error) {
						callbacks.error();
					}
				}
			}
			else if(counts > 0 && callbacks.loading) {
				callbacks.loading.call(null, counts);
			}
		}

		if(settings.callbacks.before){
			settings.callbacks.before();
		}

		// 开始loading，loading回调
		loadedCb();

		/**
		 * 加载文件
		 */
		var loadFile = function(file, cb, errorCb) {

			if(callbacks.beforeLoading) callbacks.beforeLoading.call(null, file);

			if(regCss.test(file)) {
				loadCss(file, function() {
					counts--;
					loadedCb();
				});
				return;
			}

			if(regJs.test(file)) {
				loadJs(file, function() {
					counts --; 
					loadedCb();
				});
				return;
			}

			// 匹配经过css与js筛选后，雨下文件当做图片文件处理
			loadImage(file, function() {
				counts--;
				loadedCb();
			}, function() {
				counts--;
				errorCounts++;
				loadedCb();
			});

		}

		for(var i=0; i<settings.files.length; i++) {
			loadFile(settings.files[i]);
		}

		return {
			/**
			 * 获取剩余未加载文件
			 */
			getCounts: function() {
				return counts;
			},
			/**
			 * 获取错误加载文件
			 * LABjs未提供错误加载，不能获取js加载错误数据,后续扩展
			 * 图片加载大部分浏览器不能区分404错误或者连接超时错误
			 */
			getErrorCounts: function(){
				return errorCounts;
			},

			/**
			 * 重新加载
			 * 加载过程中请勿重新加载
			 * 加载失败后可以使用重新加载
			 * 加载未失败使用重新加载待后续开发
			 * 慎重使用此方法，操作不当可能造成死循环
			 */
			renew: function(){
				FilesLoad(settings);
			}
		}
	}

	window.FilesLoad = window.FilesLoad || FilesLoad;

})(window);
