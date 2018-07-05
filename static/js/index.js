// JavaScript Document

function Index()
{
	this.init();
}

Index.prototype={
	init:function()
	{
		var _this = this;
		var util  = new Util();
		//加载用户信息
		_this.loadUserInfo(util);

		//抽奖
		_this.choujiang(util);
		//分享
		_this.sharePage(util);
	},
	loadUserInfo:function(util)
	{
		var _this = this;
		var util = util;
		var url =  window.location.pathname;
		//判断首页
		if(url.indexOf("/lion_module_share_temp/page_app") > -1 ||url.indexOf("index.html") > -1)
		{
			util.getUserId(function(data)
			{
			 	util.setCookie("ndsd_userId",data);
			 	userId = data;
				//未登录
				if(userId != 0)
				{
					//加载免费次数
					_this.loadFreeTimes(util);
			 	}
				
				//用户榜单
				_this.login(util);
				//决赛榜
				_this.auditionRank(util);
				//家族榜
				_this.familyPhb(util);
				//分享榜
				_this.sharePhb(util);
				//守护榜
				_this.guardPhb(util);
				
				//加载中奖记录
				_this.loadRecord(util);
			});
		}
		else
		{
			 userId = util.getCookie("ndsd_userId");
			 if(userId != 0)
			 {
				//加载免费次数
 				_this.loadFreeTimes(util);
			 }
			 //加载中奖记录
 			_this.loadRecord(util);
		}
	},
	login:function(util)
	{
		var _this = this;
		var ndsdUserId  = util.getCookie("ndsd_userId");
		//var ndsdUserId  = 244637;
		var loginHtmlNo = '';
		var loginHtml   = '';
		var uiUrl  =util.baseUrl+"/api/user/info?user_id="+ndsdUserId;
		//未登录
		if(ndsdUserId == '' || ndsdUserId == null || ndsdUserId == 0)
		{
			loginHtmlNo = '<em><img src="static/img/test1.jpg"/></em>'+
                          '<p>请登录后查看个人排行榜哦~</p>'+
                          '<a href="shihoutv://route?jump_type=120">立即登录</a>';
			$(".Nenroll").removeClass("enroll").html(loginHtmlNo);
		}
		else
		{
			
			util.requestRemoteDataJson(uiUrl,null,function(uiResult)
			{
				if(util.parseResult(uiResult,'error') == 0)
				{
					var resultData = util.parseResult(uiResult, 'data', 'user');
					loginHtml = '<em><img src="'+resultData["avatar"]+'"/></em>'+
								'<p>'+resultData["nick_name"]+'</p>'+
								'<span class="pmCount"></span>';
								//'<span class="pmCount">'+userPm+'<a class="pmCount"></a></span>';
					$(".Nenroll").addClass("enroll").html(loginHtml);
				}
			},false);
		}
	},
	//海选榜&决赛榜 收礼榜
	auditionRank:function(util)
	{
		var _this         = this;
		var ndsdUserId    = util.getCookie("ndsd_userId");
		//var ndsdUserId    = 244637;
		var listHtml      = "";
		var sexNo         = "";
		var currUserPhb   = "";
		var phbNum        = 0; //区分海选榜和决赛榜
		var genderMan     = []; //海选榜男榜
		var genderWoman   = []; //海选榜女榜
		var genderjsMan   = []; //决赛榜男榜
		var genderjsWoman = []; //决赛榜女榜
		//海选榜男url
		var hxManUrl      = util.receiveBaseUrl+"&start_date=2018-01-26&end_date=2018-02-01&gender=1";
		//海选榜女url
		var hxWomanUrl    = util.receiveBaseUrl+"&start_date=2018-01-26&end_date=2018-02-01&gender=2";
		//决赛榜男url
		var jsManUrl      = util.receiveBaseUrl+"&start_date=2018-02-01&end_date=2018-02-08&gender=1";
		//决赛榜女url
		var jsWomanUrl    = util.receiveBaseUrl+"&start_date=2018-02-01&end_date=2018-02-08&gender=2";
		//load data
		for(var i=0; i<$(".listCont ul").length; i++)
		{
			var num =  $(".listCont ul").eq(i).attr("data-bd");
			if(num==1)
			{
				loadData($(".list1"),hxManUrl,genderMan);
			}
			else if(num==2)
			{
				loadData($(".list2"),hxWomanUrl,genderWoman);
			}
			else if(num==3)
			{
				loadData($(".list3"),jsManUrl,genderjsMan);
			}
			else if(num==4)
			{
				loadData($(".list4"),jsWomanUrl,genderjsWoman);
			}
		}
		$("#nenrollMl .pmCount").html('最具魄力男主播榜排名：<a>'+userPm(ndsdUserId,genderMan)+'</a>');
		
		var currDate = new Date(_this.getNowFormatDate()); //当前日期
		var endDate  = new Date("2018-02-01"); //决赛榜开始时间
		if(currDate.getTime()>= endDate.getTime())
		{
			$(".jc a em").html("2.1-2.7");	
		}
		else
		{
			$(".jc a em").html("敬请期待");
		}
		
		//海选榜，决赛榜切换
		$(".mainTab ul li").on(util.clickTouch(),function()
		{
			var bdNum = $(this).attr("data-num");
			if(currDate.getTime() < endDate.getTime()&&bdNum==1)
			{
				return false;
			}
			else
			{
				$(this).addClass("curr").siblings("li").removeClass("curr");
				$(".mainBoxTab ul li").eq(0).addClass("curr").siblings("li").removeClass("curr");
				//海选榜
				if(bdNum==0)
				{
					$(".listCont ul").hide();
					$(".list1").show();
					$("#nenrollMl .pmCount").html('最具魄力男主播榜排名：<a>'+userPm(ndsdUserId,genderMan)+'</a>');
				}
				else if(bdNum==1)//决赛榜
				{
					$(".listCont ul").hide();
					$(".list3").show();	
					$("#nenrollMl .pmCount").html('最具魄力男主播榜排名：<a>'+userPm(ndsdUserId,genderjsMan)+'</a>');
				}
			}
		});
		
		//男女榜单
		$(".mainBoxTab ul li").on(util.clickTouch(),function()
		{
			var bdNum = 0;
			sexNo = $(this).attr("data-sex");
			$(this).addClass("curr").siblings("li").removeClass("curr");
			$(".mainTab ul li").each(function()
			{
				if($(this).hasClass("curr"))
				{
					bdNum = $(this).attr("data-num");
				}
			});
			$(".listCont ul").hide();
			if(sexNo=="man" && bdNum==0) //海选榜---男
			{
				$(".list1").show();
				$("#nenrollMl .pmCount").html('最具魄力男主播榜排名：<a>'+userPm(ndsdUserId,genderMan)+'</a>');
			}
			else if(sexNo=="woman" && bdNum==0) //海选榜---女
			{
				$(".list2").show();	
				$("#nenrollMl .pmCount").html('最具魅力女主播榜排名：<a>'+userPm(ndsdUserId,genderWoman)+'</a>');
			}
			else if(sexNo=="man" && bdNum==1) //决赛榜---男
			{
				$(".list3").show();	
				$("#nenrollMl .pmCount").html('最具魄力男主播榜排名：<a>'+userPm(ndsdUserId,genderjsMan)+'</a>');
			}
			else if(sexNo=="woman" && bdNum==1) //决赛榜---女
			{
				$(".list4").show();	
				$("#nenrollMl .pmCount").html('最具魅力女主播榜排名：<a>'+userPm(ndsdUserId,genderjsWoman)+'</a>');
			}
		});		
		
		//当前用户排名
		function userPm(ndsdUserId,dataArr)
		{
			var currPm = "";
			for(var i=0; i<dataArr.length; i++)
			{
				if(ndsdUserId == dataArr[i]["user"]["acc_id"])
				{
					currPm = (i+1);
					break;
				}
				else
				{
					currPm = "未上榜"	;
				}
			}
			return currPm;
		}
		
		//request data
		function loadData(obj,url,dataArray)
		{
			var listHtml   = "";
			var dataLength = 0;
			var resultData = "";
			util.requestRemoteDataJson(url, {}, function(result)
			{			
				if(util.parseResult(result, 'error') == 0)
				{
					resultData = util.parseResult(result, 'data', 'list');
					if(resultData.length!=0)
					{
						//数据存数组中
						for(var i=0; i<resultData.length; i++)
						{
							dataArray.push(resultData[i]);
						}
						
						//加载10条数据
						if(resultData.length<10)
						{
							dataLength = resultData.length;
						}
						else
						{
							dataLength = 10;
						}
						for(var i = 0; i<dataLength; i++)
						{
							listHtml+=_this.dataDom(i,resultData[i]["user"]["room"]["vdo_status"],resultData[i]["user"]["room"]["jump"],resultData[i]["user"]["avatar"],resultData[i]["user"]["nick_name"],parseInt(resultData[i]["total"])/10);
						}
						obj.html(listHtml);
					}
				}
			}, false);
		}
	},
	//家族榜 -- 收礼榜 没有开播状态
	familyPhb:function(util)
	{
		var _this      = this;
		var listHtml   = "";
		var dataLength = 0;
		var resultData = "";
		var familyUrl = "http://cms.m.shihou.tv/utils/groupRank?startDate=2018-01-26&endDate=2018-02-08";
		var imgUrlName = 1;
		var sy = 0;
		util.requestRemoteDataJson(familyUrl, {}, function(result)
		{
			if(util.parseResult(result, 'error') == 0)
			{
				resultData = util.parseResult(result, 'data');
				if(resultData.length<10)
				{
					dataLength = resultData.length;
				}
				else
				{
					dataLength = 10;
				}
				for(var i=0; i<dataLength; i++)
				{					
					switch(resultData[i]["name"])
					{
						case "琪果":
							imgUrlName = 1;
							break;
						case "芸朵":
							imgUrlName = 2;
							resultData[i]["total"]+=353;
							break;
						case "长乐":
							imgUrlName = 3;
							break;
						case "IE":
							imgUrlName = 4;
							break;
						case "SH":
							imgUrlName = 5;
							break;
						case "百乐门":
							imgUrlName = 6;
							break;
						case "丹海":
							imgUrlName = 7;
							resultData[i]["total"]+=621;
							break;
						case "告白":
							imgUrlName = 8;
							break;
						case "红旗":
							imgUrlName = 9;
							resultData[i]["total"]+=515;
							break;
						case "凯撒":
							imgUrlName = 10;
							break;
						case "雷刃":
							imgUrlName = 11;
							break;
					}
					
					listHtml += '<li>'+
									'<span class="icon"><img src="static/img/icon'+i+'.png"/></span>'+
									'<span class="yh"><a><div class="phbWrap"><img src="http://resource.youxiduo.com/special/shihou/promoter/ndsd/static/img/ghLogo'+imgUrlName+'.jpg"></div></a>'+resultData[i]["name"]+'</span>'+
									'<span class="cs">'+resultData[i]["total"]+'</span>'+
								'</li>';
				}
				
				$("#familyPhbList").html(listHtml);
			}
		}, false);
	},
	//分享达人榜
	sharePhb:function(util)
	{
		var _this    = this;
		var listHtml = "";
		var ndsdUserId  = util.getCookie("ndsd_userId");
		//var ndsdUserId  = 244445;
		var currUserPhb = '';
		var dataLength = 0;
		
		util.requestRemoteDataJson(util.shareBaseUrl, {}, function(result)
		{
			if(util.parseResult(result, 'errorCode') == 0)
			{
				var resultData = result["result"];	
				
				//排名			
				for(var i=0; i<resultData.length; i++)
				{
					var user = resultData[i];
					if(ndsdUserId==user["userId"])
					{
						currUserPhb = '分享达人榜排名：<a>'+(i+1)+'</a>';
						break;
					}
					else
					{
						currUserPhb = '分享达人榜排名：<a>未上榜</a>';
					}
				}
				if(resultData.length<10)
				{
					dataLength=resultData.length;
				}
				else
				{
					dataLength=10;	
				}
				
				//添加榜单
				for(var i=0; i<dataLength; i++)
				{
					var user = resultData[i];
					listHtml+=_this.dataDom(i,0,null,user["avatar"],user["username"],user["num"]);
				}
				
				//当前用户排名
				$("#nenrollShare .pmCount").html(currUserPhb);
				$("#sharePhbList").html(listHtml);
			}
		}, false);
	},
	//年度最佳守护榜 -- 送礼榜
	guardPhb:function(util)
	{
		var _this    = this;
		var listHtml = "";
		var ndsdUserId  = util.getCookie("ndsd_userId");
		//var ndsdUserId  = 244637;
		var currUserPhb = '';
		var dataLength = 0;
		
		util.requestRemoteDataJson(util.sendBaseUrl, {}, function(result)
		{
			if(util.parseResult(result, 'error') == 0)
			{
				var resultData = util.parseResult(result, 'data', 'list');
				for(var i=0; i<resultData.length; i++)
				{
					var user = resultData[i];
					if(ndsdUserId==user["user"]["id"])
					{
						currUserPhb = '年度最佳守护榜排名：<a>'+(i+1)+'</a>';
						break;
					}
					else
					{
						currUserPhb = '年度最佳守护榜排名：<a>未上榜</a>';
					}
				}
				
				if(resultData.length<10)
				{
					dataLength=resultData.length;
				}
				else
				{
					dataLength=10;	
				}
				
				for(var i=0; i<dataLength; i++)
				{
					var user = resultData[i];
					listHtml+=_this.dataDom(i,0,null,user["user"]["avatar"],user["user"]["nick_name"],parseInt(user["total"])/10);
				}
				//当前用户排名
				$("#nenrollSh .pmCount").html(currUserPhb);
				$("#guardPhbList").html(listHtml);
			}
		}, false);
	},
	//DOM
	dataDom:function(phbIndex,isLiving,phbRoomUrl,phbHeadSrc,phbNickName,phbCount)
	{
		var phbHtml    = '';
		var livingHtml = '';
		var roomUrl    = '';
		
		//直播状态
		if(isLiving==1)
		{
			livingHtml = '<span></span>'+
							'<div class="loader-inner line-scale-pulse-out">'+
								'<div></div>'+
								'<div></div>'+
								'<div></div>'+
								'<div></div>'+
							'</div>';
		}
		else
		{
			livingHtml = '';
		}
		// 判断直播链接
		if(phbRoomUrl!=null)
		{
			roomUrl = '<a href="'+phbRoomUrl+'">';
		}
		else
		{
			roomUrl = '<a>';	
		}

		phbHtml = '<li>'+
					'<span class="icon"><img src="static/img/icon'+phbIndex+'.png"/></span>'+
					'<span class="yh">'+
						roomUrl+
							'<div class="phbWrap">'+
								'<img src="'+phbHeadSrc+'"/>'+
								livingHtml +
							'</div>'+
						'</a>'+phbNickName+
					'</span>'+
					'<span class="cs">'+phbCount+'</span>'+
				'</li>';	
		
		return phbHtml;
	},
	//抽奖
	choujiang:function(util)
	{
		var _this = this;
		var istrue = false;
		var $btn = $('.playbtn');
		var playnum = 0; //初始次数，由后台传入
		//$('.cjText em').html(playnum);
		var lotReult=[
			{"78e1e96b655b43549ed0339ac7eefab7":1},
			{"bafa8928365c4fbb9dcaef3ca6af6b7f":2},
			{"687c9a39f8b54baf8d7270bef5bed930":3},
			{"154bfa9d93ad4c018331ef29a36a345c":4},
			{"b5f6e9082fb7417dba925e239d86fe56":5},
			{"828dd8ae682e42f89a68465637b4bad7":6},
			{"b07ad091539c49feba3c9d15d1c19c45":7},
			{"d0b5373421ea4cf88fa9d9a29d82f9ad":8}
		];

		$(".cjText").on(util.clickTouch(),function()
		{
			var uid = util.getCookie("ndsd_userId");
			//var uid = 244445;
			if(istrue)
			{
				return false;
			}
			istrue=true;
			playnum = $('.cjText em').html();
			//判断登录-未登录
			if(uid == '' || uid == null || uid == 0)
			{
				window.location.href = 'shihoutv://route?jump_type=120';
				istrue = false;
				return;
			}
			else
			{
				//抽奖次数-没有次数
				if(playnum <= 0)
				{
					//没有抽奖次数弹框
					_this.showPop($(".popNo"),$(".mask"));
					$('.cjText em').html(0);
					istrue = false;
				}
				else
				{
					playnum = playnum - 1; //剩余抽奖次数
					if(playnum <= 0)
					{
						playnum = 0;
					}
					
					$('.cjText em').html(playnum);
					//正式抽奖
					lotteryFn();
				}
			}
		});

		//抽奖结果
		var lotteryFn = function()
		{
			var lotteryUrl   = util.lotteryBaseUrl+"/wheel/run";
			var lotteryToken = util.getCookie("token1");
			//lotteryToken=JSON.parse(lion.get_token())["X-LION-TOKEN"];
			var lotteryData  = {"number":1, "token":lotteryToken, "platform":"shihou","linkId":"6a2d7f21f5f8491fb131c72e6d6759bf"};
			util.requestRemoteDataJson(lotteryUrl,lotteryData,function(lotteryResult)
			{
				var data = 0;
				for(var i = 0; i<lotReult.length; i++)
				{
					for(var a in lotReult[i])
					{
						if(a==lotteryResult["result"][0]["prize"]["detailId"])
						{
							data = lotReult[i][a];
						}
					}
				}
				//data=4;
				//var data = [1, 2, 3, 4, 5, 6,7,8];
				//data为随机出来的结果，根据概率后的结果
				//data = data[Math.floor(Math.random() * data.length)];
				var angle = data*45 + 360*1-25 ;//40=360/9;分了九格，360*2转了2圈
				switch(data)
				{
					case 1:
						rotateFunc(1,angle, 'jp1');
						break;
					case 2:
						rotateFunc(2,angle, 'jp2');
						break;
					case 3:
						rotateFunc(3,angle, 'jp3');
						break;
					case 4:
						rotateFunc(4,angle,  'jp4');
						break;
					case 5:
						rotateFunc(5,angle,  'jp5');
						break;
					case 6:
						rotateFunc(6,angle,  'jp6');
						break;
					case 7:
						rotateFunc(7,angle,  'jp7');
						break;
					case 8:
						rotateFunc(8,angle,  'jp8');
						break;
				}
			},false);
		}

		var rotateFunc = function(awards, angle, jp)
		{
			istrue = true;
			$btn.stopRotate();
			$btn.rotate({
				angle: 0,
				duration: 6000, //旋转时间
				animateTo: angle + 360, //让它根据得出来的结果加上1440度旋转
				callback: function()
				{
					istrue = false;
					/*if(awards == 3)//再接再厉未中奖
					{
						_this.showPop($(".popNozj"),$(".mask"));
					}
					else
					{
						$(".popSucc p").html(text);
						_this.showPop($(".popSucc"),$(".mask"));
					}*/
					setTimeout(function()
					{
						$(".popSucc .jp").html('<img src="static/img/'+jp+'.jpg" />');
						_this.showPop($(".popSucc"),$(".mask"));
					},3000);
				}
			});
		};
		//显示规则
		$(".btnCj").on(util.clickTouch(),function()
		{
			_this.showPop($(".popRule"),$(".mask"));
		});
		//关闭弹框
		$(".btnCom").on(util.clickTouch(),function()
		{
			_this.hidePop($(this).closest(".popBox"),$(".mask"));
		});
	},
	//加载中奖记录
	loadRecord:function(util)
	{
		var _this = this;
		var url  = util.lotteryBaseUrl+ "prize/list";
		var data = '{"pageNow":1,"pageSize":50,"schemeId":"6a2d7f21f5f8491fb131c72e6d6759bf"}';
		util.requestRemoteDataJsonPost(url,data,function(result)
		{
			if(util.parseResult(result, 'errorCode') == 0)
			{
	  			var resultData = util.parseResult(result,'result');
		  		for(var i = 0;i < resultData.length; i++)
				{
					var user = resultData[i];
					//用户名
					var userName= user['userName'];
					//奖品名称
					var prizeName = user['prizeName'];
					var pageSize = user['pageSize'];
					var html ='<li><a><span>'+userName+'</span><em>抽到</em><p>'+prizeName+'</p></a></li>';
					if(prizeName != '再接再厉')
					{
						$('.bd ul').append(html);
					}
				}
		  		_this.autoScroll($(".carousel"));
	  		}
		});
	},
	//加载免费次数
	loadFreeTimes:function(util)
	{
		var linkSchemeId = "6a2d7f21f5f8491fb131c72e6d6759bf";
		var uid = util.getCookie("ndsd_userId");//通过key获得值--->通过解析token获得uid
		//var uid = 244445;

		var freeTimesUrl = util.lotteryBaseUrl+"api/getFreeTimes?schemeId="+linkSchemeId+"&uid="+uid+"&platform=shihou";
		var freeTimesCount = 0;
	  	util.requestRemoteDataJson(freeTimesUrl,{},function(result)
		{
	  		util.logResult(result);
	  		if(util.parseResult(result,'errorCode')==0)
			{
	  			freeTimesCount = util.parseResult(result,'result');//得到免费次数
		        $('.cjText em').html(freeTimesCount);
	  		}

	  	});
	},
	autoScroll:function (obj)
	{
		var iStage  = obj.find(".bd"),
			aUl   = iStage.find("ul"),
			aList  = aUl.find("li"),
			aListHeight = aList.height();

		if((aListHeight)*aList.length>iStage.height())//如果内容的宽度小于舞台的宽度，不复制元素进行滚动
		{
			aUl.append(aUl.children().clone());
			var aList=aUl.find("li");
			aUl.height((aListHeight)*aList.length);
			var iNum=0;
			var timer=null;
			function moving()
			{
				aUl.stop().animate({"marginTop":-(aListHeight)*iNum},1000);
			}

			timer=setInterval(function()
			{
				if(iNum>=aList.length/2)
				{
					iNum=0;
					aUl.css({"marginTop":"0px"});
				}
				iNum++;
				moving();
			},2000);
		}
	},
	//share
	sharePage:function(util)
	{
		var time = 3;
		$(".btnLive,.btnYq").on(util.clickTouch(),function()
		{
			if(from_user_id=="0")
			{
				$(".pop").fadeIn(200);
				setTimeout('$(".pop").hide()', time*1000);
			}
			else
			{
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
			}
		});
	},
	//获取当前时间，格式YYYY-MM-DD
	getNowFormatDate:function ()
	{
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9)
		{
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9)
		{
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
	showPop:function(iTck,iMark)
	{
		iMark.fadeIn();
		iTck.fadeIn();
	},
	hidePop:function(iTck,iMark)
	{
		iTck.fadeOut();
		iMark.fadeOut();
	}
};

$(function()
{
	var index = new Index();
});
