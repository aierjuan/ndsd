function Util(){
	this.baseUrl = 'http://api.shihou.tv';

	//event.m.shihou.tv http://test.youxiduo.com/shihou_lottery/ http://112.124.121.34:28888/shihou_lottery
	this.lotteryBaseUrl = 'http://event.m.shihou.tv/shihou_lottery/';

	//当前用户
	//this.ndsdBaseUrl = 'http://test.api.shihou.tv/';
	this.ndsdBaseUrl = 'http://event.m.shihou.tv/';
	
	//收礼地址 1159星光正式服的，1148星光测试服的
	this.receiveBaseUrl = this.baseUrl + '/api/gift/receive_rank?gift_id=1159';
	
	//分享达人榜
	//this.shareBaseUrl  = 'http://test.open.youxiduo.com/lion_module_share_temp/share_conf/shareRecordRank/?activityId=3558';
	this.shareBaseUrl = 'http://event.m.shihou.tv/lion_module_share_temp/share_conf/shareRecordRank/?activityId=3558';

	//年度最佳守护榜---送礼
	this.sendBaseUrl = this.baseUrl + '/api/gift/send_rank?gift_id=1159';

	//收到MVP
	this.mvp_receive_url = this.lotteryBaseUrl + 'api/getCache?cacheType=receiveCache';
	this.mvp_receive_data_array = [];
	this.mvp_receive_data = {};
	//送出MVP
	this.mvp_send_url = this.lotteryBaseUrl + 'api/getCache?cacheType=sendCache';
	this.mvp_send_data_array = [];
	this.mvp_send_data = {};
	
	//收到ACE
	this.ace_receive_url = this.baseUrl + '/api/gift/receive_rank?gift_id=1153';
	this.ace_receive_data_array = [];
	this.ace_receive_data = {};
	//送出ACE
	this.ace_send_url = this.baseUrl + '/api/gift/send_rank?gift_id=1153&limit=2';
	this.ace_send_data_array = [];
	this.ace_send_data = {};


	this.init();
}
Util.prototype={
	init: function(){

	},
	setRankList: function(page){
		var self = this;
		var roomSkip = '';
		var min = 0;
		var now = 0;
		//绑定榜单
		//收到MVP
		self.log("收到MVP")
		self.requestRemoteDataJson(self.mvp_receive_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.mvp_receive_data_array[i] = user;
					now = i;
					if(i == 9){
						break;
					}
				}
			}
		}, false);
		min = now;
		//荣耀之星
		self.log("送出MVP")
		self.requestRemoteDataJson(self.mvp_send_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.mvp_send_data_array[i] = user;
					now = i;
					if(i == 9){
						break;
					}
				}
			}
		}, false);
		if(min > now){
			min = now;
		}
		var phbmvp13 = '';
		var phbmvp410 = '';
		//排行榜赋值
		for(var i = 0;i < min+1;i++){
			var shihou = self.mvp_receive_data_array[i];
			var rongyao = self.mvp_send_data_array[i];
			if(page == 0){
				roomSkip = self.parseResult(shihou, 'user', 'room', 'jump');
			}else{
				roomSkip = 'http://test.youxiduo.com/lion_module_share_temp/share?room_id='+self.parseResult(shihou, 'user', 'room', 'id');
			}
			if(i < 3){
				phbmvp13 += self.setRankListHTML((i+1), 1, roomSkip, self.parseResult(shihou, 'user', 'nick_name'), self.parseResult(shihou, 'user', 'avatar'), self.parseResult(shihou, 'user', 'room', 'vdo_status'), '收到'+self.resetTotal(self.parseResult(shihou, 'total'))+'个');
				phbmvp13 += self.setRankListHTML((i+1), 2, '', self.parseResult(rongyao, 'user', 'nick_name'), self.parseResult(rongyao, 'user', 'avatar'), self.parseResult(rongyao, 'user', 'room', 'vdo_status'), '送出'+self.resetTotal(self.parseResult(rongyao, 'total'))+'个');
			}else{
				phbmvp410 += self.setRankListHTML((i+1), 1, roomSkip, self.parseResult(shihou, 'user', 'nick_name'), self.parseResult(shihou, 'user', 'avatar'), self.parseResult(shihou, 'user', 'room', 'vdo_status'), '收到'+self.resetTotal(self.parseResult(shihou, 'total'))+'个');
				phbmvp410 += self.setRankListHTML((i+1), 2, '', self.parseResult(rongyao, 'user', 'nick_name'), self.parseResult(rongyao, 'user', 'avatar'), self.parseResult(rongyao, 'user', 'room', 'vdo_status'), '送出'+self.resetTotal(self.parseResult(rongyao, 'total'))+'个');
			}
		}
		$('#phbmvp13').html(phbmvp13);
		$('#phbmvp410').html(phbmvp410);



		//魅力之星
		self.log("收到ACE");
		self.requestRemoteDataJson(self.ace_receive_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.ace_receive_data_array[i] = user;
					now = i;
					if(i == 9){
						break;
					}
				}
			}
		}, false);
		min = now;
		//真爱之星
		self.log("送出ACE");
		self.requestRemoteDataJson(self.ace_send_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.ace_send_data_array[i] = user;
					now = i;
					if(i == 9){
						break;
					}
				}
			}
		}, false);
		if(min > now){
			min = now;
		}
		var phbace13 = '';
		var phbace410 = '';
		//排行榜赋值
		for(var i = 0;i < min+1;i++){
			var meili = self.ace_receive_data_array[i];
			var love = self.ace_send_data_array[i];
			if(page == 0){
				roomSkip = self.parseResult(meili, 'user', 'room', 'jump');
			}else{
				roomSkip = 'http://test.youxiduo.com/lion_module_share_temp/share?room_id='+self.parseResult(meili, 'user', 'room', 'id');
			}
			if(i < 3){
				phbace13 += self.setRankListHTML((i+1), 1, roomSkip, self.parseResult(meili, 'user', 'nick_name'), self.parseResult(meili, 'user', 'avatar'), self.parseResult(meili, 'user', 'room', 'vdo_status'), '收到'+self.resetTotal(self.parseResult(meili, 'total'))+'个');
				phbace13 += self.setRankListHTML((i+1), 2, '', self.parseResult(love, 'user', 'nick_name'), self.parseResult(love, 'user', 'avatar'), self.parseResult(love, 'user', 'room', 'vdo_status'), '送出'+self.resetTotal(self.parseResult(love, 'total'))+'个');
			}else{
				phbace410 += self.setRankListHTML((i+1), 1, roomSkip, self.parseResult(meili, 'user', 'nick_name'), self.parseResult(meili, 'user', 'avatar'), self.parseResult(meili, 'user', 'room', 'vdo_status'), '收到'+self.resetTotal(self.parseResult(meili, 'total'))+'个');
				phbace410 += self.setRankListHTML((i+1), 2, '', self.parseResult(love, 'user', 'nick_name'), self.parseResult(love, 'user', 'avatar'), self.parseResult(love, 'user', 'room', 'vdo_status'), '送出'+self.resetTotal(self.parseResult(love, 'total'))+'个');
			}
		}
		$('#phbace13').html(phbace13);
		$('#phbace410').html(phbace410);
	},
	setRankListHTML: function(index, num, skipRoom, nick_name, avatar, kaibo_status, value){
		var html = '';
		var liClass = ''; //主播还是用户
		var aClass = 'liveNo'+index;//名次class
		var avatarHTML = '';
		var kaiboHTML = '';
		var rankIcon = '';

		if(index < 4){
			rankIcon = '<img src="static/img/icon'+index+'.png" />';
		}else{
			rankIcon = index;
			aClass = 'liveNo4';
		}

		if(kaibo_status == 1){//如果开播
			kaiboHTML = '    <em class="liveIcon"></em>'+
						'	 <em class="liveOpacity"></em>'+
                        '    <div class="loader-inner line-scale-pulse-out">'+
                        '        <div></div>'+
                        '        <div></div>'+
                        '        <div></div>'+
                        '        <div></div>'+
                        '        <div></div>'+
                        '    </div>';
		}
		if(num == 1){//第1排
			liClass = 'anchor';
			clas = 'font1';
		    avatarHTML = '<span class="liveHead">'+
                         '   	<span class="liveWrap">'+
                         			 kaiboHTML+
                         '           <img src="'+avatar+'"/>'+
                         '       </span>'+
                         '   </span>'+
                         '	<span class="liveName">'+nick_name+'</span>'+
                         '  <span class="liveNum">'+value+'</span>'+
                         '<span class="liveRanking">'+rankIcon+'</span>';
            html = '<li class="'+liClass+'">'+
			   '	<a href='+skipRoom+' class="'+aClass+'">'+
	               	avatarHTML+
	           '	</a>'+
	           '</li>';
		}else{//第2排
			liClass = 'user';
		    avatarHTML = '<span class="liveHead">'+
		    			 '	<img src="'+avatar+'"/></span>'+
                    	 '	<span class="liveName">'+nick_name+'</span>'+
                         '<span class="liveNum">'+value+'</span>';
            html = '<li class="'+liClass+'">'+
			   '	<a href="javascript:void();" class="'+aClass+'">'+
	               	avatarHTML+
	           '	</a>'+
	           '</li>';
		}

		return html;
	},
	setUserRank: function(user_id){

		var self = this;
		//绑定用户排名
		//荣耀榜排名
		self.requestRemoteDataJson(self.mvp_receive_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.mvp_receive_data['"'+self.parseResult(user, 'user', 'id')+'"'] = (i+1);
				}
				$('#mvp1').html('荣耀榜排名：'+setUR(self.mvp_receive_data, user_id));
			}
		}, true);
		//助攻榜排名
		self.requestRemoteDataJson(self.mvp_send_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.mvp_send_data['"'+self.parseResult(user, 'user', 'id')+'"'] = (i+1);
				}
				$('#mvp2').html('荣耀榜排名：'+setUR(self.mvp_send_data, user_id));
			}
		}, true);
		//枪神榜排名
		self.requestRemoteDataJson(self.ace_receive_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.ace_receive_data['"'+self.parseResult(user, 'user', 'id')+'"'] = (i+1);
				}
				$('#ace1').html('荣耀榜排名：'+setUR(self.ace_receive_data, user_id));
			}
		}, true);
		//助攻榜排名
		self.requestRemoteDataJson(self.ace_send_url, {}, function(result){
			if(self.parseResult(result, 'error') == 0){
				var resultData = self.parseResult(result, 'data', 'list');
				for (var i = 0;i < resultData.length; i++) {
					var user = resultData[i];
					self.ace_send_data['"'+self.parseResult(user, 'user', 'id')+'"'] = (i+1);
				}
				$('#ace2').html('荣耀榜排名：'+setUR(self.ace_send_data, user_id));
			}
		}, true);

		function setUR(obj, user_id){
			var resu = obj['"'+user_id+'"'];
			if(resu == undefined){
				return '未上榜';
			}
			return resu;
		}

	},
	resetTotal: function(total){
		if(total == undefined)
			return 0;
		return parseInt(total/8);
	},
	//获取url中的参数
    getUrlParam: function(name, url) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        url = url || window.location.search.substr(1).match(reg);  //匹配目标参数
        if (url != null) return unescape(url[2]); return null; //返回参数值
    },
    getUrlParams: function(){
    	var url = window.location.href;  //匹配目标参数
    	if(url != null)
    		return url.substr(url.indexOf("?"), url.length);
    },
    parseResult:function(){//解析结果， 如果不存在则返回''
		var size = arguments.length;
		if(size == 0){
			return '';
		}
		var result = arguments[0];
		for(var i = 1; i < size; i++){
			if(result == undefined){
				return '';
			}
			var argu = arguments[i];
			if(i == size){
				return argu;
			}
			result = result[argu];
		}
		return result;
	},
	requestRemoteDataJson: function(url, data, callback, asyn){
		//this.logURL(url);
		//this.logParameter(data);
		var begin = (new Date()).getTime();
		$.ajax({
	        url: url,
	        type: 'GET',
	        async: asyn,
	        cache: false,
	        dataType: "json",
	        data: data,
	        success: callback,
	        error: function (data) {
	        	var status = data.status;
	        	console.log(url + "获取数据失败!");
	        }
	    });
	},
	requestRemoteDataJsonPost: function(url, data, callback, async){
		//this.logURL(url);
		//this.logParameter(data);
		$.ajax({
	        url: url,
	        type: 'POST',
	        async: async || true,
	        cache: false,
	        dataType: "json",
	        contentType: "application/json;charset=UTF-8",
	        data: data,
	        success: callback,
	        error: function (data) {
	        	var status = data.status;
	        	console.log(url + "获取数据失败!");
	        }
	    });
	},
	requestRemoteData: function(url, data, callback, async){
		//this.logURL(url);
		//this.logParameter(data);
		var begin = (new Date()).getTime();
		$.ajax({
	        url: url,
	        type: 'GET',
	        async: async || true,
	        dataType: "html",
	        data: data,
	        success: callback,
	        error: function (data) {
	        	var status = data.status;
	        	console.log(url + "获取数据失败!");
	        }
	    });
	},
	getUserId: function(callback){
		 var token = this.getCookie('token1');
		 //var token = window.lion.get_token();//新包token获取方法
		 //this.setCookie("token", token);
		 if(token == '')
		 {
		 	return null;
		 }
		 var url =  this.lotteryBaseUrl + '/api/getUidByToken?xLionToken='+token;
		 this.requestRemoteDataJson(url,null,callback,false);
	},
	getCookie:function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		{
			return unescape(arr[2]);
		}
		else
		{
			return null;
		}
	},
	setCookie:function(name,value){
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		//测试 TODO
     	//document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/; domain=.test.youxiduo.com";
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/; domain=.event.m.shihou.tv";
	},
	clickTouch:function ()
	{
		var clickTouch = "touchend";
		var browser = {
			versions: function()
			{
				var u = navigator.userAgent, app = navigator.appVersion;
				return {//移动终端浏览器版本信息
					trident: u.indexOf('Trident') > -1, //IE内核
					presto: u.indexOf('Presto') > -1, //opera内核
					webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
					iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, //是否iPad
					webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
				};
			}(),
			language: (navigator.browserLanguage || navigator.language).toLowerCase()
		}
		if (browser.versions.mobile)
		{
			clickTouch = "touchend";
		}
		else
		{
			clickTouch = "click";
		}
		return clickTouch;
	},
	//分享弹窗
	sharePage:function(from_user_id,share_url,share_icon,share_title,share_desc){
		console.log('from_user_id:'+from_user_id);
		console.log('share_url:'+share_url);
		console.log('share_icon:'+share_icon);
		console.log('share_title:'+share_title);
		console.log('share_desc:'+share_desc);
	    var web_share = {
	        "qq": {
	            "url": share_url,
	            "img": share_icon,
	            "title": share_title,
	            "subtitle": share_desc
	        },
	        "wx_person": {
	            "url": share_url,
	            "img": share_icon,
	            "title": share_title,
	            "subtitle": share_desc
	        },
	        "wx_group": {
	            "url": share_url,
	            "img": share_icon,
	            "title": share_title,
	            "subtitle": share_desc
	        },
	        "wb": {
	            "url": share_url,
	            "img": share_icon,
	            "title": share_title,
	            "subtitle": share_desc
	        }
	    };
	    if (typeof(window.lion) != "undefined" && typeof(window.lion.web_share) == 'function')
	    {
	        window.lion.web_share(JSON.stringify(web_share));
	    }
	},
	wechatShare:function(imgUrl, title, desc, link){
		 var wxShareConfig = {
                imgUrl: imgUrl,
                title: title,
                desc: desc,
            	link: link
            }
            $.ajax({

//              url: '//event.m.shihou.tv/shihou_kpl_guess/share_api_sign',
              	url: '//test.youxiduo.com/shihou_kpl_guess/share_api_sign',
                type: 'GET',
                async: false,
                dataType: "json",
                data: {'url': encodeURI(encodeURI(location.href.split('#')[0]))},
                success: function (data) {
                    console.log(data.result);
                    wx.config({
//                      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.result.appid, // 必填，公众号的唯一标识
                        timestamp: data.result.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.result.noncestr, // 必填，生成签名的随机串
                        signature: data.result.signature,// 必填，签名，见附录1
                        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function () {
                        wx.onMenuShareTimeline(wxShareConfig);
                        wx.onMenuShareAppMessage(wxShareConfig);
                        wx.onMenuShareQQ(wxShareConfig);
                    });
                  	wx.error(function(res){
				    	console.log('err', res)
				  	});
                },
                faile: function (data) {
                    alert(JSON.stringify(data));
                }
            });
	},
	log:function(data){
		console.log(data);
	},
	logURL:function(url){
		console.log("url --> "+url);
	},
	logParameter:function(data){
		console.log("parameter --> "+JSON.stringify(data));
	},
	logResult:function(result){
		console.log("result --> "+JSON.stringify(result));
	}
}
