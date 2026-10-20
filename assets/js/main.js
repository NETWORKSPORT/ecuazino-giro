(function(){
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var secs = [].slice.call(document.querySelectorAll('section'));
  var dots = document.getElementById('dots')||document.createElement('nav');
  secs.forEach(function(s){var a=document.createElement('a');a.href='#'+s.id;a.setAttribute('aria-label',s.dataset.name);a.title=s.dataset.name;dots.appendChild(a);});
  var dotEls=[].slice.call(dots.children);

  /* reveal: content is visible at rest; only off-screen items get hidden before they scroll in */
  document.querySelectorAll('section h2').forEach(function(h){
    if(!h.classList.contains('proj')){}
    h.classList.add('kin','r');
    (function walk(node){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return;}var o=document.createElement('span');o.className='w';var i=document.createElement('span');i.textContent=w;o.appendChild(i);f.appendChild(o);});n.parentNode.replaceChild(f,n);}
      else if(n.nodeType===1&&n.tagName!=='BR'&&!n.classList.contains('w'))walk(n);
    });})(h);
    var k=0;h.querySelectorAll('.w>span').forEach(function(s){s.style.transitionDelay=(k++*70)+'ms';});
  });
  var rs=[].slice.call(document.querySelectorAll('.r'));
  var vh=innerHeight;
  rs.forEach(function(el){ if(!reduce && el.getBoundingClientRect().top>vh) el.classList.add('wait'); });
  var fmt=function(n){return '$'+Math.round(n).toLocaleString('es-EC');};
  function runCount(el){
    if(el.dataset.done)return; el.dataset.done=1;
    var to=+el.dataset.to, t0=null, d=1400;
    if(reduce){el.textContent=to;return;}
    function f(t){t0=t0||t;var p=Math.min(1,(t-t0)/d);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f);}
    requestAnimationFrame(f);
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target;
    if(el.classList.contains('r')){
      var sib=[].slice.call(el.parentNode.children).filter(function(c){return c.classList.contains('wait');});
      var i=Math.max(0,sib.indexOf(el));
      setTimeout(function(){el.classList.remove('wait');},i*90);
    }
    el.querySelectorAll && el.querySelectorAll('.count').forEach(runCount);
    if(el.classList.contains('count'))runCount(el);
    el.querySelectorAll && el.querySelectorAll('.bar i[data-w]').forEach(function(b){b.style.width=b.dataset.w;});
    if(el.id==='fundadores')fillSeats();
    io.unobserve(el);
  });},{threshold:.15});
  rs.forEach(function(el){io.observe(el);});
  document.querySelectorAll('.count').forEach(function(c){io.observe(c);});
  

  /* seats */
  var seats=document.getElementById('seats')||document.createElement('div');
  var frag=document.createDocumentFragment();for(var i=0;i<1000;i++){frag.appendChild(document.createElement('i'));}seats.appendChild(frag);
  function fillSeats(){var c=seats.children,k=0;if(reduce){for(;k<c.length;k++)c[k].classList.add('on');return;}(function step(){for(var n=0;n<14&&k<c.length;n++)c[k++].classList.add('on');if(k<c.length)requestAnimationFrame(step);})();}

  /* progress + active dot */
  var prog=document.getElementById('progress')||document.createElement('div'),tops=[],docH=0,ticking=false,last=-1;
  function measure(){tops=secs.map(function(s){return s.offsetTop;});docH=document.documentElement.scrollHeight-innerHeight;}
  function update(){ticking=false;var y=scrollY;prog.style.transform='scaleX('+(docH>0?y/docH:0)+')';
    var mid=y+innerHeight/2,idx=0;for(var i=0;i<tops.length;i++)if(tops[i]<=mid)idx=i;
    if(idx!==last){last=idx;dotEls.forEach(function(d,i){d.classList.toggle('on',i===idx);});}}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',function(){measure();update();});addEventListener('load',function(){measure();update();});
  measure();update();

  /* keyboard navigation */
  addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT')return;
    var idx=Math.max(0,last);
    if(['ArrowDown','PageDown',' '].indexOf(e.key)>-1){e.preventDefault();(secs[idx+1]||secs[idx]).scrollIntoView({behavior:reduce?'auto':'smooth'});}
    if(['ArrowUp','PageUp'].indexOf(e.key)>-1){e.preventDefault();(secs[idx-1]||secs[0]).scrollIntoView({behavior:reduce?'auto':'smooth'});}
  });


  /* intro skip on click / key */
  var intro=document.getElementById('intro');
  function skip(){intro.classList.add('skip');}
  addEventListener('pointerdown',skip,{once:true});addEventListener('keydown',skip,{once:true});
  /* spotlight + parallax + tilt + magnet */
  var fine=matchMedia('(pointer:fine)').matches;
  if(fine && !reduce){

    /* logo interactivo (solo transform, rAF) */
    var hw=document.getElementById('heroWrap'),hp=document.getElementById('portada'),hr=0,hx=0,hy=0;
    hp.addEventListener('pointermove',function(e){hx=e.clientX/innerWidth-.5;hy=e.clientY/innerHeight-.5;if(hr)return;hr=requestAnimationFrame(function(){hr=0;hw.style.transform='perspective(1000px) rotateY('+(hx*16)+'deg) rotateX('+(-hy*12)+'deg) translate3d('+(hx*-30)+'px,'+(hy*-20)+'px,0)';});},{passive:true});
    hp.addEventListener('pointerleave',function(){hw.style.transform='';});
    var hb=document.querySelector('.hero-bg');
    hp.addEventListener('pointermove',function(e){hb.style.translate=((e.clientX/innerWidth-.5)*18)+'px '+((e.clientY/innerHeight-.5)*12)+'px';},{passive:true});
    document.querySelectorAll('.card,.rate,.tip,.ticket,.req,.stamp').forEach(function(el){
      el.classList.add('tilt');
      var raf=0,b=null;el.addEventListener('pointerenter',function(){b=el.getBoundingClientRect();});el.addEventListener('pointermove',function(e){if(raf)return;var cx=e.clientX,cy=e.clientY;raf=requestAnimationFrame(function(){raf=0;if(!b)b=el.getBoundingClientRect();var x=(cx-b.left)/b.width-.5,y=(cy-b.top)/b.height-.5;el.style.transform='perspective(900px) rotateX('+(-y*8)+'deg) rotateY('+(x*10)+'deg)';});});
      el.addEventListener('pointerleave',function(){el.style.transform='';});
    });
    document.querySelectorAll('.btn').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)';});
      b.addEventListener('pointerleave',function(){b.style.transform='';});
    });
  }
  /* coin burst when intro lands */
  var burstAt=performance.now()+(reduce?0:2450);
  /* ambient coins & sparks */
  var cv=document.getElementById('fx'),ctx=cv.getContext('2d'),W,H,dpr=Math.min(1.5,devicePixelRatio||1),P=[];
  function size(){W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;}
  size();addEventListener('resize',size);
  if(reduce)return;
  var N=innerWidth<600?14:26;
  for(var j=0;j<N;j++)P.push(spawn(true));
  function spawn(init){return{x:Math.random()*W,y:init?Math.random()*H:H+20*dpr,r:(Math.random()<.25?(5+Math.random()*6):(1+Math.random()*2))*dpr,vy:(.25+Math.random()*.7)*dpr,ph:Math.random()*6.28,sp:.01+Math.random()*.03};}
  var B=[],bursted=false;
  function burst(){for(var k=0;k<60;k++){var a=Math.random()*6.283,s=(4+Math.random()*12)*dpr;B.push({x:W/2,y:H*.42,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6*dpr,r:(4+Math.random()*8)*dpr,ph:Math.random()*6,life:1});}}
  function draw(){
    ctx.clearRect(0,0,W,H);
    if(!bursted&&performance.now()>burstAt&&scrollY<innerHeight*.5){bursted=true;burst();}
    for(var q=B.length-1;q>=0;q--){var c=B[q];c.x+=c.vx;c.y+=c.vy;c.vy+=.35*dpr;c.vx*=.985;c.ph+=.2;c.life-=.009;if(c.life<=0||c.y>H+40){B.splice(q,1);continue;}
      var cw=Math.abs(Math.cos(c.ph))*c.r;ctx.globalAlpha=Math.min(1,c.life*1.5);ctx.fillStyle=(q%3)?'#FFC21A':'#FFE37A';ctx.beginPath();ctx.ellipse(c.x,c.y,Math.max(cw,.8*dpr),c.r,0,0,6.283);ctx.fill();}
    for(var i=0;i<P.length;i++){var p=P[i];p.y-=p.vy;p.ph+=p.sp;p.x+=Math.sin(p.ph)*.4*dpr;
      if(p.y<-20*dpr)P[i]=p=spawn(false);
      if(p.r>4*dpr){var w=Math.abs(Math.cos(p.ph))*p.r;ctx.globalAlpha=.5;ctx.fillStyle='#F5B21A';ctx.beginPath();ctx.ellipse(p.x,p.y,Math.max(w,.8*dpr),p.r,0,0,6.283);ctx.fill();}
      else{ctx.globalAlpha=.35+.35*Math.sin(p.ph*2);ctx.fillStyle=i%3?'#FFC21A':'#FF8A00';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();}
    }
    ctx.globalAlpha=1;running=false;schedule();
  }
  var running=false;
  function schedule(){if(running||document.hidden)return;running=true;requestAnimationFrame(draw);}
  document.addEventListener('visibilitychange',schedule);
  schedule();
})();
