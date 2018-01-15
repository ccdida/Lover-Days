// 页面滚动的接口，封装，只给外部可以调用的接口
function Swipe(){ 
    $container=$("#container");//获得li-ul-div中的div
    $contentWrap=$container.find(':first');//获得li-ul中的ul
    $content=$contentWrap.find('li');//获得li
    //设置div的高度
    $container.css({
        height:$(window).height()+'px'//窗口的高度
    })
    //获取容器div的宽和高
    var width=$container.width();
    var height=$container.height();
    //设置ul的宽度和高度，是div的三倍
    $contentWrap.css({
        width:width*3+'px',
        height:height
    })
    //设置三个li的宽度和高度--和div一样
    $content.css({
        width:width,
        height:height
    })
    //设置三个页面可以移动-方法，让ul的x坐标向左移动，这样li就会一一显示（1←2←3)
    this.speedx=function(x,y){
        $contentWrap.css({
            'transition-property':'left',
            'transition-duration':y+'ms',
            'transition-timing-function':'linear',
             left:'-'+x+'px'
        })
    }
}
var page=new Swipe();//创建一个page对象，可以调用speedx函数。此时容器的宽和高都有了(窗口宽和高)
// scrollTO:页面滚动时间和距离传给page对象
var vHeight=$("#container").height();//容器宽度
var vWidth=$("#container").width();//容器高度
function scrollTO(time,proportionX){
    var distX=$("#container").width()*proportionX;
    page.speedx(distX,time);
  }

//css3动画监听
var animationEnd=(function(){
        var explorer=navigator.userAgent;
        if(~explorer.indexOf('WebKit')){
          return 'webkitAnimationEnd';//为什么要取反？
        }
        return 'animationend';
})();

//动画--商店的门
function doorAction(left,right,time){
        var $door=$(".door");//门元素
        var $doorLeft=$(".doorLeft");//左边的门
        var $doorRight=$(".doorRight");//右边的门
        var defer=$.Deferred();
        var count=2;
        //等待开门完成
        var doorComplete=function(){
            if(count==1){
                defer.resolve();
                return;
            }
            count--;//当count==1，doorComplete执行了两次，说明左边和右边门都打开了
        };

        $doorLeft.animate({
            'left':left
        },time,doorComplete);

        $doorRight.animate({
            'left':right
        },time,doorComplete);//门的动画
        return defer;
   }
//动画--灯
var lamp={
        elem:$(".bBackground"),
        bright:function(){
            this.elem.addClass('lampBright');
        },
        dark:function(){
            this.elem.removeClass('lampBright');
        }
};//创建一个灯对象，调用方法(添加和去除样式)来实现灯亮灯灭

//开门
function opendoor(){
        return doorAction('-50%','100%',2000);//改变left值
}
//关门
function closedoor(){
        return doorAction('0%','50%',2000);//恢复left值
}
//得到中间元素的高度--主要是页面一和三会调用该函数
function getHeight(className){
        //获得放置中间背景图片的元素
        var middleElement=$(className);
        return {
           height:middleElement.height(),
           top:middleElement.position().top //获取中间图片距离父元素div的高度    
        }     
}
var bridgeY=function(){
            var data=getHeight(".cBackgroundMiddle");
            return data.top;//中间图片距离父元素div(页面顶部)的高度  
         }();
       //女孩对象
var girl={
            elem:$("#girl"),
            getHeight: function(){
                return this.elem.height();//女孩高度
            },
            rotate:function(){
              this.elem.addClass('girlRotate');//女孩的转身动作
            },
            setOffset:function(){
                this.elem.css({
                    left:vWidth/2,//女孩在页面宽度1/2的位置
                    top:bridgeY-this.getHeight()+10 //top：桥距离顶部距离减去小女孩身高。10为修正值。
                })
            },
            getOffset:function(){
              return this.elem.offset();
            },
            getWidth:function(){
              return this.elem.width();
            }
}

girl.setOffset();
              
var stopX;//小男孩需要在店门口停下。设置为全局变量
// 小男孩走路函数
function BoyWalk(){
       
        //获得路的Y轴
        var pathY=function(){
            var data=getHeight('.aBackgroundMiddle');
            return data.top+data.height/2;//从div顶部到中间图片一半的距离
        }()//自执行

        $boyHeight=$("#boy").height();//小男孩自身高度
       // 设置并修正小男孩的正确位置
       // 路的中间位置减去小孩的高度，30是一个修正值
        $("#boy").css({
              top:pathY-$boyHeight+30
        })

      
        //小男孩走路动画处理
      
        //停止走路--步伐控制
        function pauseWalk() {
            $("#boy").addClass('pauseWalk');//通过添加样式，让小男孩的步伐停止。停止前进是通过距离控制的
        }
        //恢复走路
        function restoreWalk(){
            $("#boy").removeClass('pauseWalk');
        }

        //css3-animation小男孩脚步变化
        function footchange(){
            $("#boy").addClass('footChange');
        }
        //计算移动距离
        function calculateDist(direction,proportion){
            return (direction=='x'?vWidth:vHeight)*proportion;//判断是x还是y，以及比例。如果是x，就乘以容器宽度，如果是y，就乘以容器高度
        }
        //小男孩走路路径--非常重要的函数
        function startRun(options,runtime){
            // options本来就是对象(名值对)，直接写进去就可以了！！！
            var dtd=$.Deferred();
            //恢复走路
            restoreWalk();
            //left，top，opacity，scale等变化
            $("#boy").animate(options, runtime, "linear", function() {
                dtd.resolve()
            });//linear很重要。如果是默认的速度函数，结束时会很慢，前进与页面切换时会有明显停顿。
           // console.log(dtd)
            return dtd;//很重要，只有这里结束才会进行下一步
        }


        //小男孩走路-把时间，left，top传过来，再以对象的方式传给startrun
        function walkRun(time,distX,distY){
            time=time||3000;
            //脚步动作
            footchange();
            //前进
            var d1=startRun({
              'left':distX,
              'top':distY?distY:undefined
            },time)
            return d1;//d1就是startRun中的dtd，返回给boy的walkTo函数的是d1
        }
        //小男孩走进商店
        function walkToShop(runtime){
            //找到小男孩停下时的x的值
            var dtd1=$.Deferred();
            var door=$(".door");
            var doorOffsetLeft=door.offset().left;//左边距窗口距离
            var dWidth=door.width();//door.width
            var boyOffsetLeft=$("#boy").offset().left;
            var bWidth=$("#boy").width();
            stopX=doorOffsetLeft+dWidth/2-boyOffsetLeft-bWidth/2;//小男孩到商店门口需要前进的距离           
            //开始走路
            var walkStart=startRun({       
                left:'+='+stopX,
                opacity:0.1,
                scale:0.4
                //误打误撞，这里有效果是因为添加了一个js。 
            },2000)
            //走路完毕
            .done(function(){
               $('#boy').css({
               opacity:0
            })
            dtd1.resolve();
            })

            return dtd1;
        }
        //走出商店
        function walkOutShop(runtime){
            var dtd2=$.Deferred();
            //恢复走路
            // restoreWalk();
            var walkStart=startRun({
                left:'+='+stopX,
                opacity:1,
                scale:1
            },runtime)
            //走路完毕
            .done(function(){
                dtd2.resolve();
            });
            return dtd2;//已经出商店
        }
         //取花
        function takeFlower(){
            var dtd3=$.Deferred();
            setTimeout(function(){
                $("#boy").removeClass('footChange');//也不用去写，因为takeflower会覆盖之间的脚步变化样式因为一个元素只能有一个动画存在。
                $("#boy").addClass('takeflowers');//
                dtd3.resolve();
            },1000)//1s中之后才执行，达到取花花了时间的效果
            return dtd3;
        }
        // 返给boy的对象
        return {
            //小男孩走路
            walkTo:function(time,proportionX,proportionY){
                var distX=calculateDist('x',proportionX);//left
                var distY=calculateDist('y',proportionY);//top
                return walkRun(time,distX,distY);
            },
            //停止走路
            stopWalk:function(){
              pauseWalk();
            },
            //走进商店
            toShop:function(){
                return walkToShop.apply(null,arguments);
            },
            //出商店
            outShop:function(){
                return walkOutShop.apply(null,arguments);
            },
            //取花+恢复走路（只是现在的步伐中手上加了一朵花
            takeFlower:function(){
              return takeFlower();
            },
            //小男孩的宽
            getWidth:function(){
              return $("#boy").width();
            },
            rotate:function(callback){
                restoreWalk();//为什么要恢复?没有停止呀？
                $("#boy").addClass('boyRotate');//男孩转身
                if (callback) {
                    $("#boy").on(animationEnd,function(){
                        callback();//当boy转身之后，logo出来，花瓣开始落下
                        $(this).off();
                    })
                }
            }
        }
}
var boy=new BoyWalk();//return的是对象，所以boy是return的对象。
$("#sun").addClass('sunRotation');//太阳准备好
$(".cloud1").addClass('cloud1Anim');//云也准备好
$(".cloud2").addClass('cloud2Anim');
boy.walkTo(6000,0.6)//第一次走路
            .then(function(){
                scrollTO(6500,1);//页面滚动
                return boy.walkTo(6500,0.5); //第二次走路，走到商店才会停  
            })
            .done(function(){
                boy.stopWalk();//第一次停下脚步不再变化，也不再前进(scrollTo已经完成)
            })
            .then(function(){
                return opendoor();//开门
            })
            .then(function(){
                lamp.bright();//灯亮-这里有闪图的问题
            })
            .then(function(){
                return boy.toShop(2000);//进商店，进商店应该包含了恢复脚步
            })
            .then(function(){
                return boy.takeFlower();//取花，步伐也变了
            })
            .then(function(){
                bird.fly();//鸟儿飞过
            })
            .then(function(){
                return boy.outShop(2000);//出商店
            })
            .then(function(){
                closedoor();//关门
            })
            .then(function(){
                lamp.dark();//灯灭（通过切换样式来切换背景图片）
            })
            .then(function(){
                girl.setOffset();//女孩站在自己的位置
                scrollTO(6500,2);//页面滚动
                boy.walkTo(6500,0.15);//第三次走路--走到桥下
            })
            .then(function(){
                return boy.walkTo(2000,0.25,(bridgeY-girl.getHeight()+10)/vHeight);//爬到桥上
            })
            .then(function(){
                var proportionX=(girl.getOffset().left - boy.getWidth() + girl.getWidth() / 5) / vWidth;
                return boy.walkTo(2000, proportionX);//到小女孩旁边
            })
            .then(function(){
                setTimeout(function(){
                    girl.rotate();//女孩转身
                    boy.rotate(function(){//男孩转身后执行回调函数
                        logo.run();//logo出现
                        flowerFlake();//飘花
                    })//

                },1000)
            })


//飞鸟
var bird={
    elem:$(".bird"),
    fly:function(){
        this.elem.addClass('birdFly');//翅膀变化动画
        this.elem.animate({right:$("#container").width()},5000)//飞的距离和时间：因为一个元素一段时间内只能有一段动画。小男孩脚步变化是添加样式，前进则是用的animate的。因为是同时进行的，所以用不同的方法
        //能不能用一种方法：鸟儿翅膀在变化，也在前进？
    }
}
//logo
var logo={
    elem:$(".logo"),
    run:function(){
        this.elem.addClass('logoIn')//飘进来
        .on(animationEnd,function(){
            $(this).addClass('logoShake').off();//飘进来动画结束后抖动。这里是css3两段动画，通过监听，第一段结束后开始第二段
        })
    }
}
//花瓣
//定义一个数组，里面是花瓣的链接
var flowerUrl=['images/snowflake/snowflake1.png',
               'images/snowflake/snowflake2.png',
               'images/snowflake/snowflake3.png',
               'images/snowflake/snowflake4.png',
               'images/snowflake/snowflake5.png',
               'images/snowflake/snowflake6.png'
              ];
//飘花
function flowerFlake(){
    var $flowerContainer=$("#flower");//获得花瓣根节点
    // 随机六张图
    function getImgsName(){
        var random=Math.floor(Math.random()*6);//0到5之间的随机数
        return flowerUrl[random];
    }
    //创建一个花瓣元素
    function createFlower(){
        var url=getImgsName();//得到一个随机的花瓣链接
        return $("<div class='flowerBox'></div>").css({
            'backgroundImage':'url('+url+')'
        }).addClass('flowerRoll');
    }//给花瓣随机分配背景图片，并且添加旋转样式
    //开始飘花
    setInterval(function(){
        var startPositionLeft=Math.random()*vWidth-100,//开始时的left:[0,1)*容器宽-100
            startOpacity=1,
            endPositionTop=vHeight-40,
            endPositionLeft=startPositionLeft-100+Math.random()*500,
            duration=vHeight*10+Math.random()*5000;
            //随机透明度，不小于0.5
            var randomStart=Math.random();
            randomStart=randomStart<0.5?startOpacity:randomStart;
            //创建一个雪花
            var $flower=createFlower();
            //设计起点位置
            $flower.css({
                left:startPositionLeft,
                opacity:randomStart
            });
            //加入到容器
            $flowerContainer.append($flower);
            //开始执行动画
            $flower.animate({
                top:endPositionTop,
                left:endPositionLeft,
                opacity:0.7
            },duration,function(){
                $(this).remove();
            })
     },200)
}
//音乐配置
var audioConfig={
    enable:true,//是否开启音乐
    playURL:'music/happy.wav',//正常播放地址
    cycleURL:'music/circulation.wav'//正常循环播放地址
    };
//背景音乐
function Html5Audio(url,isloop){
    var audio=new Audio(url);
    audio.autoplay=true;
    audio.loop=isloop||false;
    audio.play();
    return{
        end:function(callback){
                audio.addEventListener('ended',function(){
                    callback();
                },false);
        }
    }
}
//播放
var audio1=Html5Audio(audioConfig.playURL);
audio1.end(function(){
    Html5Audio(audioConfig.cycleURL,true);
})
