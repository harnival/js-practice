$(function(){
    
    // loading //
    if("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/project3/js/service-worker.js")
            .then(reg => {
                reg.pushManager.getSubscription();
                reg.showNotification("서비스워커 등록 후", {
                    body: "현재 : " + new Date()
                })
            })
    }
    
    
    // 폴더에서 이미지 불러오는 법 //
    $.get("/project3/img",function(data){
        $(data).find("a").attr("href", function (i, val) {
                if( val.match(/\.(jpe?g|png|gif|webp|avif)$/) ) {
                    const $a = $("<a href='#none' class='imageA'></a>");
                    const $div = $("<div class='imageBox'></div>")
                    $a.append( "<img class='images' src='" + val +"'>" );
                    $div.append($a);
                    $(".list").append($div);
                } 
            });
    }).done(res => {
        clearInterval(loading);
        $(".loading").remove()
    })
    
    const loading = setInterval(function(){
        const $cloud = $("<img src='./cloud-outline.svg' class='clouds' />");
        const tops = $(".cloudBox").height();
        const widths = 50 + Math.random()*60;
        const numbers = Math.random() * tops;
    
        $(".cloudBox").append($cloud);
        $cloud
        .css({
            top: `${numbers}px`,
            width: `${widths}px`
        })
        .animate({
            left: "-20%"
        },1800,function(){$(this).remove()})
    },600)
    // setTimeout(function(){
    //     clearInterval(loading);
    //     $(".loading").remove()
    // },100)
    $(document).on("click",".imageA",function(){
        const $con = $(".loadImg").get(0).getContext('2d');
        $con.clearRect(0,0, $(".canvasWrap").width(), $(".canvasWrap").height() )
        const img = $(this).find("img");
        const img2 = new Image();
        img2.src = img[0].src;
        img2.onload = function(){
            const iw = img2.width, ih = img2.height;
            const mw = $(".canvases").width(), mh = $(".canvases").height();
            const tw = iw<=ih? mh*iw/ih: mw, th = iw<=ih? mh: mw*ih/iw;
            $(".loadImg").prop("width",tw).prop("height",th);
            $(".drawingTool").width(tw).height(th);
            $con.drawImage(img2,0,0,tw,th)
        }
        
    })

    // drawing //
    let mouse;
    let $con;
    $(".loadImg, .drawingTool").prop("width", $(".canvasWrap").width()).prop("height", $(".canvasWrap").height())
    $(window).on("resize",function(){
        $(".loadImg, .drawingTool").prop("width", $(".canvasWrap").width()).prop("height", $(".canvasWrap").height())
    })
    $con = $(".drawingTool").get(0).getContext('2d');
    let drawColor, line=10;

    $(".colors a").not(".erase").on("click",function(){
        drawColor = $(this).data("color");
        $(".erase").data("on",false);
        $(this).css("background-color","white");
        $(".colors a").not($(this)).css("background-color","transparent");
    })
    $(".erase").on("click",function(){
        $(this).data("on",true);
        $(this).css("background-color","white");
        $(".colors a").not($(this)).css("background-color","transparent");
    })
    $(".linewidth input").on("input",function(){
        const lab = $(this).siblings("label");
        const t = +$(this).val();
        lab.text(t + "px");
        line = +$(this).val();
    })
    $(".opac input").on("input",function(){
        const lab = $(this).siblings("label");
        const t = +$(this).val();
        lab.text("opacity : " + t);
        
    })
    $(document).on("click",".merge a",async function(){
        const p = new Promise(function(){
            const can1 = document.querySelector(".loadImg");
            const can2 = document.querySelector(".drawingTool");
            const ctx = can1.getContext('2d');
            ctx.drawImage(can2,0,0);
            return(document.querySelector(".loadImg"))
        });
        const p2 = await function(p) {
            const $can3 = $(".result canvas");
            const q = p.getContext('2d');
            const ctx2 = $can3.get(0).getContext('2d');
            ctx2.drawImage(q,0,0);
        }
    })
    const moving = {};
    $(document)
        .on("mousedown",".drawingTool",function(event){
            mouse = true;
            $con = $(".drawingTool").get(0).getContext('2d');
            const mx = event.offsetX, my = event.offsetY;
        })
        .on("mouseup",".drawingTool",function(event){
            const $con = $(".drawingTool").get(0).getContext('2d');
            mouse=null;
        })
        .on("mousemove",".drawingTool",function(event){
            if(mouse) {
                const can = $(".drawingTool").get(0).getContext('2d');
                if($(".erase").data("on")) {
                    can.globalCompositeOperation = "destination-out"
                } else {
                    can.globalCompositeOperation = "source-over"
                }
                can.fillStyle = drawColor;
                can.strokeStyle = drawColor;
                const mx = event.originalEvent.offsetX, my = event.originalEvent.offsetY;
                can.beginPath();
                can.arc(mx,my,line,0,2*Math.PI)
                can.fill();
                can.stroke();
            }
        })
    
})
