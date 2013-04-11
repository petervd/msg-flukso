/** License: https://www.mysmartgrid.de/sites/all/modules/logger/js/dygraph/excanvas.js */
document.createElement("canvas").getContext||function(){function K(){return this.context_||(this.context_=new y(this))}function L(a,b,c){var d=D.call(arguments,2);return function(){return a.apply(b,d.concat(D.call(arguments)))}}function M(a){var b=a.srcElement;switch(a.propertyName){case "width":b.style.width=b.attributes.width.nodeValue+"px";b.getContext().clearRect();break;case "height":b.style.height=b.attributes.height.nodeValue+"px",b.getContext().clearRect()}}function N(a){a=a.srcElement;a.firstChild&&
(a.firstChild.style.width=a.clientWidth+"px",a.firstChild.style.height=a.clientHeight+"px")}function z(){return[[1,0,0],[0,1,0],[0,0,1]]}function r(a,b){for(var c=z(),d=0;3>d;d++)for(var f=0;3>f;f++){for(var A=0,e=0;3>e;e++)A+=a[d][e]*b[e][f];c[d][f]=A}return c}function E(a,b){b.fillStyle=a.fillStyle;b.lineCap=a.lineCap;b.lineJoin=a.lineJoin;b.lineWidth=a.lineWidth;b.miterLimit=a.miterLimit;b.shadowBlur=a.shadowBlur;b.shadowColor=a.shadowColor;b.shadowOffsetX=a.shadowOffsetX;b.shadowOffsetY=a.shadowOffsetY;
b.strokeStyle=a.strokeStyle;b.globalAlpha=a.globalAlpha;b.arcScaleX_=a.arcScaleX_;b.arcScaleY_=a.arcScaleY_;b.lineScale_=a.lineScale_}function F(a){var b,c=1;a=String(a);if("rgb"==a.substring(0,3)){b=a.indexOf("(",3);var d=a.indexOf(")",b+1),d=a.substring(b+1,d).split(",");b="#";for(var f=0;3>f;f++)b+=G[Number(d[f])];4==d.length&&"a"==a.substr(3,1)&&(c=d[3])}else b=a;return{color:b,alpha:c}}function O(a){switch(a){case "butt":return"flat";case "round":return"round";default:return"square"}}function y(a){this.m_=
z();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.fillStyle=this.strokeStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=1*l;this.globalAlpha=1;this.canvas=a;var b=a.ownerDocument.createElement("div");b.style.width=a.clientWidth+"px";b.style.height=a.clientHeight+"px";b.style.overflow="hidden";b.style.position="absolute";a.appendChild(b);this.element_=b;this.lineScale_=this.arcScaleY_=this.arcScaleX_=1}function H(a,b,c,d){a.currentPath_.push({type:"bezierCurveTo",
cp1x:b.x,cp1y:b.y,cp2x:c.x,cp2y:c.y,x:d.x,y:d.y});a.currentX_=d.x;a.currentY_=d.y}function s(a,b,c){var d;a:{for(d=0;3>d;d++)for(var f=0;2>f;f++)if(!isFinite(b[d][f])||isNaN(b[d][f])){d=!1;break a}d=!0}d&&(a.m_=b,c&&(a.lineScale_=P(Q(b[0][0]*b[1][1]-b[0][1]*b[1][0]))))}function w(a){this.type_=a;this.r1_=this.y1_=this.x1_=this.r0_=this.y0_=this.x0_=0;this.colors_=[]}function I(){}var u=Math,h=u.round,B=u.sin,C=u.cos,Q=u.abs,P=u.sqrt,l=10,t=l/2,D=Array.prototype.slice,J={init:function(a){/MSIE/.test(navigator.userAgent)&&
!window.opera&&(a=a||document,a.createElement("canvas"),a.attachEvent("onreadystatechange",L(this.init_,this,a)))},init_:function(a){a.namespaces.g_vml_||a.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML");a.namespaces.g_o_||a.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML");if(!a.styleSheets.ex_canvas_){var b=a.createStyleSheet();b.owningElement.id="ex_canvas_";b.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}"}a=
a.getElementsByTagName("canvas");for(b=0;b<a.length;b++)this.initElement(a[b])},initElement:function(a){if(!a.getContext){a.getContext=K;a.innerHTML="";a.attachEvent("onpropertychange",M);a.attachEvent("onresize",N);var b=a.attributes;b.width&&b.width.specified?a.style.width=b.width.nodeValue+"px":a.width=a.clientWidth;b.height&&b.height.specified?a.style.height=b.height.nodeValue+"px":a.height=a.clientHeight}return a}};J.init();for(var G=[],e=0;16>e;e++)for(var x=0;16>x;x++)G[16*e+x]=e.toString(16)+
x.toString(16);e=y.prototype;e.clearRect=function(){this.element_.innerHTML=""};e.beginPath=function(){this.currentPath_=[]};e.moveTo=function(a,b){var c=this.getCoords_(a,b);this.currentPath_.push({type:"moveTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};e.lineTo=function(a,b){var c=this.getCoords_(a,b);this.currentPath_.push({type:"lineTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};e.bezierCurveTo=function(a,b,c,d,f,e){f=this.getCoords_(f,e);a=this.getCoords_(a,b);c=this.getCoords_(c,
d);H(this,a,c,f)};e.quadraticCurveTo=function(a,b,c,d){a=this.getCoords_(a,b);c=this.getCoords_(c,d);d={x:this.currentX_+2/3*(a.x-this.currentX_),y:this.currentY_+2/3*(a.y-this.currentY_)};H(this,d,{x:d.x+(c.x-this.currentX_)/3,y:d.y+(c.y-this.currentY_)/3},c)};e.arc=function(a,b,c,d,f,e){c*=l;var h=e?"at":"wa",k=a+C(d)*c-t,j=b+B(d)*c-t;d=a+C(f)*c-t;f=b+B(f)*c-t;k==d&&!e&&(k+=0.125);a=this.getCoords_(a,b);k=this.getCoords_(k,j);d=this.getCoords_(d,f);this.currentPath_.push({type:h,x:a.x,y:a.y,radius:c,
xStart:k.x,yStart:k.y,xEnd:d.x,yEnd:d.y})};e.rect=function(a,b,c,d){this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+d);this.lineTo(a,b+d);this.closePath()};e.strokeRect=function(a,b,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+d);this.lineTo(a,b+d);this.closePath();this.stroke();this.currentPath_=f};e.fillRect=function(a,b,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+d);this.lineTo(a,
b+d);this.closePath();this.fill();this.currentPath_=f};e.createLinearGradient=function(a,b,c,d){var f=new w("gradient");f.x0_=a;f.y0_=b;f.x1_=c;f.y1_=d;return f};e.createRadialGradient=function(a,b,c,d,f,e){var h=new w("gradientradial");h.x0_=a;h.y0_=b;h.r0_=c;h.x1_=d;h.y1_=f;h.r1_=e;return h};e.drawImage=function(a,b){var c,d,f,e,p,k,j,g;f=a.runtimeStyle.width;e=a.runtimeStyle.height;a.runtimeStyle.width="auto";a.runtimeStyle.height="auto";var m=a.width,n=a.height;a.runtimeStyle.width=f;a.runtimeStyle.height=
e;if(3==arguments.length)c=arguments[1],d=arguments[2],p=k=0,j=f=m,g=e=n;else if(5==arguments.length)c=arguments[1],d=arguments[2],f=arguments[3],e=arguments[4],p=k=0,j=m,g=n;else if(9==arguments.length)p=arguments[1],k=arguments[2],j=arguments[3],g=arguments[4],c=arguments[5],d=arguments[6],f=arguments[7],e=arguments[8];else throw Error("Invalid number of arguments");var q=this.getCoords_(c,d),v=[];v.push(" <g_vml_:group",' coordsize="',10*l,",",10*l,'"',' coordorigin="0,0"',' style="width:',10,
"px;height:",10,"px;position:absolute;");if(1!=this.m_[0][0]||this.m_[0][1]){var t=[];t.push("M11=",this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",h(q.x/l),",","Dy=",h(q.y/l),"");var r=this.getCoords_(c+f,d),s=this.getCoords_(c,d+e);c=this.getCoords_(c+f,d+e);q.x=u.max(q.x,r.x,s.x,c.x);q.y=u.max(q.y,r.y,s.y,c.y);v.push("padding:0 ",h(q.x/l),"px ",h(q.y/l),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",t.join(""),", sizingmethod='clip');")}else v.push("top:",
h(q.y/l),"px;left:",h(q.x/l),"px;");v.push(' ">','<g_vml_:image src="',a.src,'"',' style="width:',l*f,"px;"," height:",l*e,'px;"',' cropleft="',p/m,'"',' croptop="',k/n,'"',' cropright="',(m-p-j)/m,'"',' cropbottom="',(n-k-g)/n,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",v.join(""))};e.stroke=function(a){var b=[],c=F(a?this.fillStyle:this.strokeStyle),d=c.color,c=c.alpha*this.globalAlpha;b.push("<g_vml_:shape",' filled="',!!a,'"',' style="position:absolute;width:',10,
"px;height:",10,'px;"',' coordorigin="0 0" coordsize="',10*l," ",10*l,'"',' stroked="',!a,'"',' path="');for(var f=null,e=null,p=null,k=null,j=0;j<this.currentPath_.length;j++){var g=this.currentPath_[j];switch(g.type){case "moveTo":b.push(" m ",h(g.x),",",h(g.y));break;case "lineTo":b.push(" l ",h(g.x),",",h(g.y));break;case "close":b.push(" x ");g=null;break;case "bezierCurveTo":b.push(" c ",h(g.cp1x),",",h(g.cp1y),",",h(g.cp2x),",",h(g.cp2y),",",h(g.x),",",h(g.y));break;case "at":case "wa":b.push(" ",
g.type," ",h(g.x-this.arcScaleX_*g.radius),",",h(g.y-this.arcScaleY_*g.radius)," ",h(g.x+this.arcScaleX_*g.radius),",",h(g.y+this.arcScaleY_*g.radius)," ",h(g.xStart),",",h(g.yStart)," ",h(g.xEnd),",",h(g.yEnd))}if(g){if(null==f||g.x<f)f=g.x;if(null==p||g.x>p)p=g.x;if(null==e||g.y<e)e=g.y;if(null==k||g.y>k)k=g.y}}b.push(' ">');if(a)if("object"==typeof this.fillStyle){var d=this.fillStyle,m=0,g=c=a=0,n=1;"gradient"==d.type_?(m=d.x1_/this.arcScaleX_,f=d.y1_/this.arcScaleY_,j=this.getCoords_(d.x0_/this.arcScaleX_,
d.y0_/this.arcScaleY_),m=this.getCoords_(m,f),m=180*Math.atan2(m.x-j.x,m.y-j.y)/Math.PI,0>m&&(m+=360),1E-6>m&&(m=0)):(j=this.getCoords_(d.x0_,d.y0_),g=p-f,n=k-e,a=(j.x-f)/g,c=(j.y-e)/n,g/=this.arcScaleX_*l,n/=this.arcScaleY_*l,j=u.max(g,n),g=2*d.r0_/j,n=2*d.r1_/j-g);f=d.colors_;f.sort(function(a,b){return a.offset-b.offset});for(var e=f.length,k=f[0].color,p=f[e-1].color,q=f[0].alpha*this.globalAlpha,t=f[e-1].alpha*this.globalAlpha,r=[],j=0;j<e;j++){var s=f[j];r.push(s.offset*n+g+" "+s.color)}b.push('<g_vml_:fill type="',
d.type_,'"',' method="none" focus="100%"',' color="',k,'"',' color2="',p,'"',' colors="',r.join(","),'"',' opacity="',t,'"',' g_o_:opacity2="',q,'"',' angle="',m,'"',' focusposition="',a,",",c,'" />')}else b.push('<g_vml_:fill color="',d,'" opacity="',c,'" />');else a=this.lineScale_*this.lineWidth,1>a&&(c*=a),b.push("<g_vml_:stroke",' opacity="',c,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',O(this.lineCap),'"',' weight="',a,'px"',' color="',d,'" />');b.push("</g_vml_:shape>");
this.element_.insertAdjacentHTML("beforeEnd",b.join(""))};e.fill=function(){this.stroke(!0)};e.closePath=function(){this.currentPath_.push({type:"close"})};e.getCoords_=function(a,b){var c=this.m_;return{x:l*(a*c[0][0]+b*c[1][0]+c[2][0])-t,y:l*(a*c[0][1]+b*c[1][1]+c[2][1])-t}};e.save=function(){var a={};E(this,a);this.aStack_.push(a);this.mStack_.push(this.m_);this.m_=r(z(),this.m_)};e.restore=function(){E(this.aStack_.pop(),this);this.m_=this.mStack_.pop()};e.translate=function(a,b){s(this,r([[1,
0,0],[0,1,0],[a,b,1]],this.m_),!1)};e.rotate=function(a){var b=C(a);a=B(a);s(this,r([[b,a,0],[-a,b,0],[0,0,1]],this.m_),!1)};e.scale=function(a,b){this.arcScaleX_*=a;this.arcScaleY_*=b;s(this,r([[a,0,0],[0,b,0],[0,0,1]],this.m_),!0)};e.transform=function(a,b,c,d,e,h){s(this,r([[a,b,0],[c,d,0],[e,h,1]],this.m_),!0)};e.setTransform=function(a,b,c,d,e,h){s(this,[[a,b,0],[c,d,0],[e,h,1]],!0)};e.clip=function(){};e.arcTo=function(){};e.createPattern=function(){return new I};w.prototype.addColorStop=function(a,
b){b=F(b);this.colors_.push({offset:a,color:b.color,alpha:b.alpha})};G_vmlCanvasManager=J;CanvasRenderingContext2D=y;CanvasGradient=w;CanvasPattern=I}();
