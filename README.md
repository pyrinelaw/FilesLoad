# FilesLoad

### 多文件文件加载
偶尔翻出之前的代码库使用，小巧的多文件加载插件

### 引入JS
```html
<script type="text/javascript" src="src/js/lib/LAB.js"></script>
<script type="text/javascript" src="src/js/FilesLoad.js"></script>
```

### 使用
```javascript
var re = FilesLoad({
    files: [],	// 预加载文件列表
	reTimes: 0,	// 重新加载次数
	reTimes： 1,    // 重复加载次数,失败后会重新加载
	// 回调函数
	callbacks: {	
	    before: null,	// 加载前
		loading: null,	// 加载中
		after: null,	// 全部加载完成,不一定加载完成
		success: null,	// 全部加载成功、与after不同的是，success表示所有文件都加载成功，after有可能文件加载失败也会回调
		error: null		// 加载失败
	}
});
```

### 回调
```javascript
// 获取剩余未加载文件
getCounts();
/**
 * 获取错误加载文件
 * LABjs未提供错误加载，不能获取js加载错误数据,后续扩展
 * 图片加载大部分浏览器不能区分404错误或者连接超时错误
 */
getErrorCounts();
/**
 * 全部重新加载
 * 加载过程中请勿重新加载
 * 加载失败后可以使用重新加载
 * 加载未失败使用重新加载待后续开发
 * 慎重使用此方法，操作不当可能造成死循环  
 */
renew();
```

### github
[完整代码下载: https://github.com/pyrinelaw/pFastCorres](https://github.com/pyrinelaw/FilesLoad)
[示例: https://pyrinelaw.github.io/FilesLoad]

###其他

如果已使用seajs或者requirejs，不推荐使用此插件。
[关于LABjs http://labjs.com/](http://labjs.com/)

------
感谢阅读此份文稿
更多插件请访问： https://github.com/pyrinelaw
作者：Petrus.Law
