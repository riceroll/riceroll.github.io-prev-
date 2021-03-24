(this.webpackJsonpreact3=this.webpackJsonpreact3||[]).push([[0],{54:function(t,e,n){},75:function(t,e,n){},84:function(t,e,n){"use strict";n.r(e);var i=n(0),a=n.n(i),s=n(26),o=n.n(s),c=(n(75),n(14)),r=n(4),l=n(7),h=n(1),d=function(){function t(e,n,i,a,s){Object(r.a)(this,t),this.pos=e,this.fixed=n,this.pos0=i,this.vel=a,this.force=s,this.vs=[],this.es=[],this.fs=[],this.id=t.all.length,t.all.push(this)}return Object(l.a)(t,[{key:"facesOnTheOtherSide",value:function(){}}]),t}();d.all=[];var u=function t(e,n,i,a,s,o){Object(r.a)(this,t),this.vs=[],this.lMax=n,this.maxContraction=i,this.edgeChannel=a,this.edgeActive=s,this.l=o;var l,h=Object(c.a)(e);try{for(h.s();!(l=h.n()).done;){var u=l.value;this.vs.push(d.all[u])}}catch(v){h.e(v)}finally{h.f()}d.all[e[0]].vs.push(d.all[e[1]]),d.all[e[1]].vs.push(d.all[e[0]]),d.all[e[0]].es.push(this),d.all[e[1]].es.push(this),this.id=t.all.length,t.all.push(this)};u.all=[];var v=function(){function t(){Object(r.a)(this,t),this.viewer=null,this.Vertex=d,this.Edge=u,this.Model=t,this.controls=null,this.sharedData=null,this.reset(),this.loadData(),this.resetSelection(),this.recordV()}return Object(l.a)(t,[{key:"reset",value:function(){this.v=[],this.e=[],this.v0=[],this.fixedVs=[],this.lMax=[],this.edgeActive=[],this.edgeChannel=[],this.script=[],this.maxContraction=[],this.vel=[],this.f=[],this.l=[],this.vStatus=[],this.eStatus=[],this.fStatus=[],this.iAction=0,this.numSteps=0,this.timeStart=new Date,this.editing=!1,this.simulate=!0,this.gravity=!0,this.directional=!1,this.euler=new h.Euler(0,0,0),this.numChannels=t.defaultNumChannels,this.numActions=t.defaultNumActions,this.inflateChannel=new Array(this.numChannels).fill(!1),this.contractionPercent=new Array(this.numChannels).fill(1)}},{key:"loadDict",value:function(t){for(var e=[],n=Array.from(t.e),i=Array.from(t.f),a=Array.from(t.p),s=0;s<t.v.length;s++)e.push(new h.Vector3(t.v[s][0],t.v[s][1],t.v[s][2]));if(this.reset(),t.lMax){var o=t.lMax,c=t.maxContraction,r=t.fixedVs,l=t.edgeChannel,d=t.edgeActive;this.loadData(e,n,i,a,o,c,r,l,d),this.resetSelection(),this.recordV()}else this.loadData(e,n,i,a),this.resetSelection(),this.recordV()}},{key:"loadData",value:function(e,n,i,a){var s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null,c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,r=arguments.length>7&&void 0!==arguments[7]?arguments[7]:null,l=arguments.length>8&&void 0!==arguments[8]?arguments[8]:null,d=arguments.length>9&&void 0!==arguments[9]?arguments[9]:[];if(e&&n)this.v=e,this.e=n;else{this.v.push(new h.Vector3(1,-1/Math.sqrt(3),.2)),this.v.push(new h.Vector3(0,2/Math.sqrt(3),.2)),this.v.push(new h.Vector3(-1,-1/Math.sqrt(3),.2)),this.v.push(new h.Vector3(0,0,4/Math.sqrt(6)+.2)),this.e.push([0,1]),this.e.push([1,2]),this.e.push([2,0]),this.e.push([0,3]),this.e.push([1,3]),this.e.push([2,3]);for(var u=this.v[0].distanceTo(this.v[1])/(1-t.maxMaxContraction),v=0;v<this.v.length;v++)this.v[v].divideScalar(u),this.v[v].multiplyScalar(t.defaultMaxLength)}this.recordV(),c&&(this.fixedVs=c),s&&(this.lMax=s),o&&(this.maxContraction=o),l&&(this.edgeActive=l),r&&(this.edgeChannel=r),d&&(this.script=d),this.resetSelection(),this.precompute()}},{key:"saveData",value:function(){var t,e={v:[]},n=Object(c.a)(this.v);try{for(n.s();!(t=n.n()).done;){var i=t.value;e.v.push([i.x,i.y,i.z])}}catch(a){n.e(a)}finally{n.f()}return e.e=this.e,e.lMax=this.lMax,e.maxContraction=this.maxContraction,e.fixedVs=this.fixedVs,e.edgeChannel=this.edgeChannel,e.edgeActive=this.edgeActive,e}},{key:"resetSelection",value:function(){this.vStatus=new Array(this.v.length).fill(0),this.eStatus=new Array(this.e.length).fill(0),this.fStatus=new Array(this.f.length).fill(0)}},{key:"recordV",value:function(){this.v0=[];var t,e=-this.bbox()[5],n=Object(c.a)(this.v);try{for(n.s();!(t=n.n()).done;){var i=t.value.clone();i.z+=e,this.v0.push(i)}}catch(a){n.e(a)}finally{n.f()}}},{key:"resetV",value:function(){this.iAction=0,this.numSteps=0;for(var t=0;t<this.v.length;t++)this.v[t].copy(this.v0[t]);this.numSteps=0}},{key:"precompute",value:function(){var e=this,n=function(t,e){for(var n=0;n<Math.min(t.length,e.length);n++)e[n]=t[n];return e};this.l=[];for(var i=0;i<this.e.length;i++){var a=this.e[i];this.l.push(this.v[a[0]].distanceTo(this.v[a[1]]))}if(this.vel.length!==this.v.length){this.vel=[];for(var s=0;s<this.v.length;s++)this.vel.push(new h.Vector3)}if(this.maxContraction.length!==this.e.length){var o=new Array(this.e.length).fill(t.maxMaxContraction);this.maxContraction=n(this.maxContraction,o)}if(this.fixedVs.length!==this.v.length){var c=new Array(this.v.length).fill(!1);this.fixedVs=n(this.fixedVs,c)}if(this.lMax.length!==this.e.length){var r=new Array(this.e.length).fill(t.defaultMaxLength);this.lMax=n(this.lMax,r)}if(this.edgeActive.length!==this.e.length){var l=new Array(this.e.length).fill(!0);this.edgeActive=n(this.edgeActive,l)}if(this.edgeChannel.length!==this.e.length){var d=new Array(this.e.length).fill(0);this.edgeChannel=n(this.edgeChannel,d)}if(this.script.length!==this.numChannels||this.script.length&&this.script[0].length!==this.numActions){var u=Array(this.numChannels).fill(!1).map((function(t){return Array(e.numActions).fill(!1)}));0===this.script.length&&(this.script=u);for(var v=0;v<Math.min(this.script.length,u.length);v++)for(var f=0;f<Math.min(this.script[0].length,u[0].length);f++)u[v][f]=this.script[v][f];this.script=u}}},{key:"update",value:function(){this.f=[];for(var e=0;e<this.v.length;e++)this.f.push(new h.Vector3);for(var n=0;n<this.e.length;n++){var i=this.e[n],a=this.v[i[0]],s=this.v[i[1]].clone().sub(a),o=this.lMax[n];if(this.edgeActive[n]){var c=this.edgeChannel[n],r=o,l=r*(1-this.maxContraction[n]);o=r-this.contractionPercent[c]*(r-l)}var d=(s.length()-o)*t.k;d=s.normalize().multiplyScalar(d),this.f[i[0]].add(d),this.f[i[1]].add(d.negate())}for(var u=0;u<this.v.length;u++)this.gravity&&this.f[u].add(new h.Vector3(0,0,-t.gravityFactor*t.gravity))}},{key:"runScript",value:function(){if(0===this.script.length)return 0;if(this.numSteps>(this.iAction+1)%this.numActions*t.numStepsAction){this.iAction=Math.floor(this.numSteps/t.numStepsAction)%this.numActions;for(var e=0;e<this.numChannels;e++)this.inflateChannel[e]=this.script[e][this.iAction]}}},{key:"step",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=0;i<e;i++){if(this.precompute(),!this.simulate)return;n&&this.runScript(),this.update(),this.editing;for(var a=0;a<this.inflateChannel.length;a++)this.inflateChannel[a]?(this.contractionPercent[a]-=t.contractionPercentRate,this.contractionPercent[a]<0&&(this.contractionPercent[a]=0)):(this.contractionPercent[a]+=t.contractionPercentRate,this.contractionPercent[a]>1&&(this.contractionPercent[a]=1));for(var s=0;s<this.v.length;s++)if(!this.fixedVs[s]&&(!this.sharedData.movingJoint||2===this.vStatus[s])){for(this.vel[s].add(this.f[s].clone().multiplyScalar(t.h)),this.v[s].z<=0&&(this.directional?(this.vel[s].x<0&&(this.vel[s].x*=1-t.frictionFactor),this.vel[s].y<0&&(this.vel[s].y*=1-t.frictionFactor)):(this.vel[s].x*=1-t.frictionFactor,this.vel[s].y*=1-t.frictionFactor)),this.vel[s].multiplyScalar(t.dampingRatio);this.vel[s].length()>5;)this.vel[s].multiplyScalar(.9);this.v[s].add(this.vel[s].clone().multiplyScalar(t.h))}for(var o=0;o<this.v.length;o++)this.v[o].z<0&&(this.v[o].z=0,this.vel[o].z=-this.vel[o].z);this.numSteps+=1}return this.v}},{key:"addJoint",value:function(e){var n=new h.Vector3;n.copy(this.v[e]);var i=new h.Vector3(t.defaultMinLength,0,0);n=n.add(i),this.v.push(n);var a=[e,this.v.length-1];this.e.push(a)}},{key:"addEdges",value:function(t){for(var e=0;e<t.length;e++)for(var n=e+1;n<t.length;n++){var i,a=!0,s=Object(c.a)(this.e);try{for(s.s();!(i=s.n()).done;){var o=i.value;if(o.includes(t[e])&&o.includes(t[n])){a=!1;break}}}catch(r){s.e(r)}finally{s.f()}a&&this.e.push([t[e],t[n]])}}},{key:"removeJoint",value:function(t){if(![0,1,2,3].includes(t)){this.updateDataStructure();var e,n=[],i=d.all[t],a=Object(c.a)(i.es);try{for(a.s();!(e=a.n()).done;){var s=e.value;n.push(s)}}catch(o){a.e(o)}finally{a.f()}d.all=d.all.filter((function(t){return t!==i})),u.all=u.all.filter((function(t){return!n.includes(t)})),this.updateFromDataStructure()}}},{key:"removeEdge",value:function(t){}},{key:"updateDataStructure",value:function(){d.all=[];for(var t=0;t<this.v.length;t++)new d(this.v[t],this.fixedVs[t],this.v0[t],this.vel[t],this.f[t]);u.all=[];for(var e=0;e<this.e.length;e++)new u(this.e[e],this.lMax[e],this.maxContraction[e],this.edgeChannel[e],this.edgeActive[e],this.l[e])}},{key:"updateFromDataStructure",value:function(){this.v=[],this.fixedVs=[],this.v0=[],this.vel=[],this.f=[];var t,e=Object(c.a)(d.all);try{for(e.s();!(t=e.n()).done;){var n=t.value;this.v.push(n.pos),this.fixedVs.push(n.fixed),this.v0.push(n.pos0),this.vel.push(n.vel),this.f.push(n.f)}}catch(r){e.e(r)}finally{e.f()}this.e=[],this.lMax=[],this.maxContraction=[],this.edgeChannel=[],this.edgeActive=[],this.l=[];var i,a=Object(c.a)(u.all);try{for(a.s();!(i=a.n()).done;){var s=i.value,o=[s.vs[0].id,s.vs[1].id];this.e.push(o),this.lMax.push(s.lMax),this.maxContraction.push(s.maxContraction),this.edgeChannel.push(s.edgeChannel),this.edgeActive.push(s.edgeActive),this.l.push(s.l)}}catch(r){a.e(r)}finally{a.f()}this.vStatus=new Array(this.v.length).fill(0),this.eStatus=new Array(this.e.length).fill(0)}},{key:"centroid",value:function(){var t,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=new h.Vector3(0,0,0),i=e?this.v0:this.v,a=Object(c.a)(i);try{for(a.s();!(t=a.n()).done;){var s=t.value;n.add(s)}}catch(o){a.e(o)}finally{a.f()}return n.divideScalar(this.v.length),n}},{key:"center",value:function(){for(var t=this.centroid(!0),e=this.centroid(!1),n=0;n<this.v.length;n++)this.v[n].sub(e),this.v[n].add(t)}},{key:"stepsPerSecond",value:function(){var t=new Date;return this.numSteps/((t.getTime()-this.timeStart.getTime())/1e3)}},{key:"bbox",value:function(){var t,e,n,i,a,s;t=e=n=-1/0,i=a=s=1/0;var o,r=Object(c.a)(this.v);try{for(r.s();!(o=r.n()).done;){var l=o.value;l.x>t&&(t=l.x),l.y>e&&(e=l.y),l.z>n&&(n=l.z),l.x<i&&(i=l.x),l.y<a&&(a=l.y),l.z<s&&(s=l.z)}}catch(h){r.e(h)}finally{r.f()}return[t,e,n,i,a,s]}},{key:"infoJoints",value:function(){return"joints: "+this.v.length}},{key:"infoBeams",value:function(){return"actuators: "+this.e.length}},{key:"fixJoints",value:function(t){for(var e=0;e<t.length;e++){t[e];alert("not implemented")}}},{key:"unfixAll",value:function(){this.fixedVs=[],this.fixedVs=new Array(this.v.length).fill(!1)}},{key:"rotate",value:function(t,e,n){this.resetV();var i=this.centroid(),a=new h.Euler;a.setFromVector3(this.euler.toVector3().negate(),"ZYX"),this.euler=new h.Euler(t,e,n);for(var s=0;s<this.v.length;s++)this.v[s].sub(i),this.v[s].applyEuler(a),this.v[s].applyEuler(this.euler),this.v[s].add(i);this.recordV()}}]),t}();v.k=2e5,v.h=.001,v.dampingRatio=.992,v.contractionInterval=.075,v.contractionSteps=4,v.maxMaxContraction=Math.round(v.contractionInterval*v.contractionSteps*100)/100,v.contractionPercentRate=5e-4,v.gravityFactor=9.8,v.gravity=1,v.defaultMinLength=1.2,v.defaultMaxLength=v.defaultMinLength/(1-v.maxMaxContraction),v.frictionFactor=.8,v.numStepsAction=2/v.h,v.defaultNumActions=1,v.defaultNumChannels=4,v.reindexObjects=function(t){var e,n=0,i=Object(c.a)(t.all);try{for(i.s();!(e=i.n()).done;){e.value.id=n,n+=1}}catch(a){i.e(a)}finally{i.f()}};var f=n(10),j=(n.p,n(54),n(17)),p=n(56),g=n(126),b=n(104),m=n(2);Object(j.d)({OrbitControls:p.a});var x=new h.Color(.6,.6,.6),O=[new h.Color(.3,.3,.6),new h.Color(.6,.6,.3),new h.Color(.3,.6,.3),new h.Color(.3,.6,.6),new h.Color(.6,.3,.6)],y=(new h.Color(1,1,1),new h.Color(.05,.05,.05)),C=new h.Color(.3,.1,.1),w=new h.Color(.5,.2,.2),S=new h.Color(.2,.8,.8),k=new h.Color(.15,.15,.15),A=.02;function M(t){var e=t.v,n=t.d,a=t.c,s=t.model,o=t.handleClick,c=t.handlePointerOver,r=t.handlePointerOut,l=t.setOControls,d=t.translating,u=Object(i.useRef)(),v=Object(i.useRef)(),p=Object(i.useRef)(),b=Object(i.useState)(!1),x=Object(f.a)(b,2),O=x[0],y=x[1],C=new h.Vector3;return Object(j.e)((function(t){if(u.current.position.copy(e),v.current.color.copy(a),d){var n=p.current;O?(e.copy(n.worldPosition.clone().add(n.position)),u.current.position.copy(e)):p.current.position.copy(e)}})),Object(i.useEffect)((function(){var t=function(t){l(!t.value),y(t.value);var e=t.target;!1===t.value?(e.object.position.multiplyScalar(0),s.simulate=!0):(s.simulate=!1,C.copy(e.worldPosition))},n=p.current;if(n.position.copy(e),n)return n.addEventListener("dragging-changed",t),function(){n.removeEventListener("dragging-changed",t)}})),Object(m.jsx)(g.a,{ref:p,enabled:d,showX:d,showY:d,showZ:d,mode:"translate",space:"local",children:Object(m.jsxs)("mesh",{ref:u,position:e,castShadow:!0,scale:[n,n,n],onClick:o,onPointerOver:c,onPointerOut:r,children:[Object(m.jsx)("sphereBufferGeometry",{args:[1,20,20]}),Object(m.jsx)("meshStandardMaterial",{ref:v,color:a})]})})}function P(t){var e=t.v,n=t.iv,a=t.model,s=t.setOControls,o=t.sharedData,c=(a.vStatus[n],a.vStatus[n],Object(i.useState)(!1)),r=Object(f.a)(c,2),l=r[0],d=r[1],u=new h.Color;Object(j.e)((function(t){var e=2===a.vStatus[n],i=1===a.vStatus[n],s=a.fixedVs[n];u.copy(e?C:i?w:s?S:x),o.movingJoint&&2===a.vStatus[n]&&!l&&d(!0),o.movingJoint&&2===a.vStatus[n]||!l||d(!1)}));return Object(m.jsx)(M,{v:e,d:.04,model:a,handleClick:function(t){o.removingJoint?(a.removeJoint(n),a.precompute(),a.recordV(),a.forceUpdate()):o.addingJoint?(a.addJoint(n),a.precompute(),a.recordV(),a.forceUpdate()):o.movingJoint?(a.vStatus.fill(0),a.vStatus[n]=2):a.vStatus[n]=2,o.updateGUI(),t.stopPropagation()},handlePointerOver:function(t){2!==a.vStatus[n]&&(a.vStatus[n]=1),t.stopPropagation()},handlePointerOut:function(t){2!==a.vStatus[n]&&(a.vStatus[n]=0),t.stopPropagation()},setOControls:s,translating:l,c:u},"ball")}function I(t){var e=t.v0,n=t.v1,a=t.d,s=t.c,o=t.handleClick,c=t.handlePointerOver,r=t.handlePointerOut,l=Object(i.useRef)(),d=Object(i.useRef)(),u=function(t,e){var n=t.clone().add(e).divideScalar(2),i=e.clone().sub(t),a=new h.Vector3(0,1,0),s=i.length();i.normalize();var o=(new h.Quaternion).setFromUnitVectors(a,i);return[n,s,(new h.Euler).setFromQuaternion(o)]},v=u(e,n),p=Object(f.a)(v,3),g=p[0],b=p[1],x=p[2];return Object(j.e)((function(t){var i=u(e,n),a=Object(f.a)(i,3),o=a[0],c=a[1],r=a[2];l.current.position.copy(o),l.current.rotation.copy(r),l.current.scale[1]=c,d.current.color.copy(s)})),Object(m.jsxs)("mesh",{ref:l,position:[g.x,g.y,g.z],rotation:x,castShadow:!0,scale:[a,b,a],onClick:o,onPointerOver:c,onPointerOut:r,children:[Object(m.jsx)("cylinderBufferGeometry",{args:[1,1,1,20]}),Object(m.jsx)("meshLambertMaterial",{ref:d,color:s})]})}function V(t){var e=t.v0,n=t.v1,i=t.ie,a=t.model,s=t.sharedData,o=n.clone().sub(e);o.length();o.normalize();var c=o.clone().multiplyScalar(.527),r=o.clone().multiplyScalar(.33),l=o.clone().multiplyScalar(.02),d=r.clone().add(e),u=d.clone().add(c),v=n.clone().sub(r),f=v.clone().sub(c),p=e.clone(),g=e.clone().add(r),b=n.clone(),S=n.clone().sub(r),M=v.clone().sub(o.clone().multiplyScalar(a.lMax[i]*(a.Model.maxMaxContraction-a.maxContraction[i]))),P=M.clone().add(l),V=new h.Color,U=new h.Color,D=new h.Color,G=new h.Color,J=function(){if(s.showChannel){var t=2===a.eStatus[i],e=1===a.eStatus[i],n=O[a.edgeChannel[i]];V.copy(t?C:e?w:n),U.copy(t?C:e?w:n),D.copy(t?C:e?w:n),G.copy(t?C:e?w:n)}else{var o=2===a.eStatus[i],c=1===a.eStatus[i];V.copy(o?C:c?w:y),U.copy(o?C:c?w:x),D.copy(o?C:c?w:x),G.copy(o?C:c?w:k)}};J(),Object(j.e)((function(t){var s=n.clone().sub(e);s.length();s.normalize();var o=s.clone().multiplyScalar(.527),c=s.clone().multiplyScalar(.33),r=s.clone().multiplyScalar(.02);d.copy(c.clone().add(e)),u.copy(d.clone().add(o)),v.copy(n.clone().sub(c)),f.copy(v.clone().sub(o)),p.copy(e.clone()),g.copy(e.clone().add(c)),b.copy(n.clone()),S.copy(n.clone().sub(c)),M.copy(v.clone().sub(s.clone().multiplyScalar(a.lMax[i]*(a.Model.maxMaxContraction-a.maxContraction[i])))),P.copy(M.clone().add(r)),J()}));var L=function(t){a.eStatus[i]=2,t.stopPropagation()},z=function(t){2!==a.eStatus[i]&&(a.eStatus[i]=1),t.stopPropagation()},F=function(t){2!==a.eStatus[i]&&(a.eStatus[i]=0),t.stopPropagation()},E=[Object(m.jsx)(I,{v0:d,v1:u,d:.05,c:V,handleClick:L,handlePointerOver:z,handlePointerOut:F},"out"),Object(m.jsx)(I,{v0:v,v1:f,d:.04,c:U,handleClick:L,handlePointerOver:z,handlePointerOut:F},"in"),Object(m.jsx)(I,{v0:p,v1:g,d:A,c:D,handleClick:L,handlePointerOver:z,handlePointerOut:F},"joint0"),Object(m.jsx)(I,{v0:S,v1:b,d:A,c:D,handleClick:L,handlePointerOver:z,handlePointerOut:F},"joint1")];return a.maxContraction[i]!==a.Model.maxMaxContraction&&E.push(Object(m.jsx)(I,{v0:M,v1:P,d:.05,c:y},"constraint")),a.edgeActive[i]?E:[Object(m.jsx)(I,{v0:e,v1:n,d:A,c:G,handleClick:L,handlePointerOver:z,handlePointerOut:F},"beam")]}function U(t){var e=t.model,n=t.sharedData,i=t.setOControls,s=a.a.useState(new h.Clock),o=Object(f.a)(s,1)[0];Object(j.e)((function(t){var n=1e3/30-o.getDelta();setTimeout((function(){t.ready=!0,t.invalidate()}),Math.max(0,n)),t.ready=!1;e.Model.h;e.step(Math.floor(2.4/e.Model.h/30))}),0);var r,l=[],d=[],u=Object(c.a)(e.v.entries());try{for(u.s();!(r=u.n()).done;){var v=Object(f.a)(r.value,2),p=v[0],g=v[1];l.push(Object(m.jsx)(P,{v:g,iv:p,model:e,setOControls:i,sharedData:n},"J"+String(p)))}}catch(k){u.e(k)}finally{u.f()}var b,x=Object(c.a)(e.e.entries());try{for(x.s();!(b=x.n()).done;){var O=Object(f.a)(b.value,2),y=O[0],C=O[1],w=e.v[C[0]],S=e.v[C[1]];d.push(Object(m.jsx)(V,{v0:w,v1:S,ie:y,model:e,sharedData:n,selected:C.selected,hovered:C.hovered},"B"+String(y)))}}catch(k){x.e(k)}finally{x.f()}return[].concat(l,d)}function D(){var t=new h.DirectionalLight(new h.Color(1,1,1),1.2);t.position.set(0,0,5),t.castShadow=!0;return t.shadow.mapSize.width=5120,t.shadow.mapSize.height=5120,t.shadow.camera.top=-30,t.shadow.camera.right=30,t.shadow.camera.left=-30,t.shadow.camera.bottom=30,t.shadow.camera.near=.1,t.shadow.camera.far=500,Object(m.jsx)("primitive",{object:t})}window.fps=30;var G=function(t){var e=t.oControls,n=Object(j.f)(),i=n.camera,a=n.gl.domElement;return Object(j.e)((function(){return e.current.update()})),Object(m.jsx)("orbitControls",{ref:e,args:[i,a]})};var J=function(t){var e=t.model,n=t.sharedData,a=Object(i.useRef)();e.controls=a;var s=Object(i.useReducer)((function(t){return t+1}),0),o=Object(f.a)(s,2)[1];return e.forceUpdate=o,Object(m.jsxs)(j.a,{shadowMap:!0,concurrent:!0,onCreated:function(t){var e=t.gl,n=(t.camera,.92);e.setClearColor(new h.Color(n,n,n)),e.setPixelRatio(window.devicePixelRatio),e.shadowMap.enabled=!0,e.shadowMap.type=h.PCFSoftShadowMap},camera:{fov:45,position:[0,-20,1],up:[0,0,1]},gl:{antialias:!0},children:[Object(m.jsx)(G,{oControls:a}),Object(m.jsx)("ambientLight",{color:new h.Color(1,1,1),intensity:.5}),Object(m.jsx)(D,{}),Object(m.jsxs)("mesh",{position:[0,0,0],receiveShadow:!0,visible:!0,children:[Object(m.jsx)("planeGeometry",{args:[1e4,1e4]}),Object(m.jsx)("shadowMaterial",{opacity:.3})]}),Object(m.jsx)("gridHelper",{args:[100,100],"rotation-x":-Math.PI/2,"position-z":0,visible:!0}),Object(m.jsx)(U,{model:e,sharedData:n,setOControls:function(t){a.current.enabled=t}}),Object(m.jsx)(b.a,{})]})},L=n(16),z=n(105),F=n(107),E=n(108),R=n(127),T=n(111),N=n(124),B=n(114),H=n(115),q=n(118),K=n(51),X=n(125),Y=n(109),Z=n(110),_=n(112),Q=n(113),W=n(116),$=n(117),tt=n(119),et=n(120),nt=n(121),it=n(122),at=n(123),st="rgba(200, 200, 200, 0.6)",ot=["rgb(100, 100, 200)","rgb(200, 200, 100)","rgb(100, 200, 100)","rgb(100, 200, 200)","rgb(200, 100, 200)"],ct=.5,rt=.1,lt=Object(z.a)((function(t){return{mainGUI:{position:"absolute",right:"1.5vh",top:"1.5vh",width:"28vh",height:"auto",background:st,"& .MuiList-root":{"& .MuiListItem-root":{minHeight:"6vh"}}},editingGUI:{position:"absolute",right:"30vh",top:"1.5vh",width:"30vh",background:st},scriptGUI:{position:"absolute",left:"2vh",bottom:"2vh",background:st},editingScriptGUI:{position:"absolute",right:"30vh",top:"40vh",width:"40vh",background:st}}}));function ht(t){var e=t.model,n=t.updateGUI,i=[];Object(L.a)(Array(e.e.length).keys()).every((function(t){return 2!==e.eStatus[t]||2===e.eStatus[t]&&!0===e.edgeActive[t]})),Object(L.a)(Array(e.e.length).keys()).every((function(t){return 2!==e.eStatus[t]||2===e.eStatus[t]&&!1===e.edgeActive[t]}));return i.push(Object(m.jsx)(F.a,{item:!0,style:{width:"50%",textAlign:"center"},children:Object(m.jsx)(E.a,{size:"small",onClick:function(){for(var t=0;t<e.e.length;t++)2===e.eStatus[t]&&(e.edgeActive[t]=!0);n(),setTimeout(e.forceUpdate,50)},children:Object(m.jsx)(Y.a,{})})},"active")),i.push(Object(m.jsx)(F.a,{item:!0,style:{width:"50%",textAlign:"center"},children:Object(m.jsx)(E.a,{size:"small",onClick:function(){for(var t=0;t<e.e.length;t++)2===e.eStatus[t]&&(e.edgeActive[t]=!1);n(),setTimeout(e.forceUpdate,50)},children:Object(m.jsx)(Z.a,{})})},"passive")),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{style:{width:"50%"},children:"Active / Passive"}),Object(m.jsx)(F.a,{container:!0,style:{width:"50%"},children:i})]})}function dt(t){for(var e=t.n,n=t.model,i=t.updateGUI,a=[],s=function(t){var s=!Object(L.a)(Array(n.e.length).keys()).every((function(e){return 2!==n.eStatus[e]||2===n.eStatus[e]&&n.edgeChannel[e]!==t}));a.push(Object(m.jsx)(F.a,{item:!0,style:{width:"".concat(1/e*100,"%"),textAlign:"center"},children:Object(m.jsx)(E.a,{size:"small",onClick:function(){for(var e=0;e<n.e.length;e++)2===n.eStatus[e]&&(n.edgeChannel[e]=t);i()},children:s?Object(m.jsx)(_.a,{}):Object(m.jsx)(Q.a,{})})},t))},o=0;o<e;o++)s(o);return Object(m.jsx)(R.a,{children:Object(m.jsx)(F.a,{container:!0,styles:{width:"50%"},children:a})})}function ut(t){for(var e=t.n,n=t.model,i=t.updateGUI,a=[],s=function(t){a.push(Object(m.jsx)(F.a,{item:!0,style:{width:"".concat(1/e*100,"%"),textAlign:"center"},children:Object(m.jsx)(N.a,{size:"small",checked:n.inflateChannel[t],onClick:function(e){console.log(e.target.checked),n.inflateChannel[t]=e.target.checked,i()}})},t))},o=0;o<e;o++)s(o);return Object(m.jsx)(R.a,{children:Object(m.jsx)(F.a,{container:!0,styles:{width:"100%"},alignItems:"center",children:a})})}function vt(t){var e=t.model,n=(t.sharedData,t.updateGUI,t.classes);e.precompute();for(var a=6*e.numActions+1,s=function(t){var e=t.model,a=t.iChannel,s=t.iAction,o=Object(i.useState)(!1),c=Object(f.a)(o,2),r=c[0],l=c[1],h=e.script[a][s],d=Object(i.useState)(s===e.iAction),u=Object(f.a)(d,2);u[0],u[1];return Object(m.jsx)(F.a,{item:!0,className:n.scriptBlock,style:{background:ot[a],width:"".concat(5,"vh"),height:"".concat(5,"vh"),padding:"".concat(1,"vh"),margin:"".concat(.5,"vh"),border:"2px ".concat(r?"solid":"none"," ").concat("rgba(250, 250, 250, 0.9)"),opacity:"".concat(h?1:r?.4:.1)},onPointerOver:function(){l(!0)},onPointerOut:function(){l(!1)},onClick:function(){e.script[a][s]=!h}},s)},o=function(t){for(var e=t.model,n=t.iChannel,i=[],a=0;a<e.numActions;a++){i.push(Object(m.jsx)(s,{model:e,isOn:!0,iChannel:n,iAction:a},a))}return Object(m.jsx)(F.a,{container:!0,item:!0,spacing:0,children:i})},c=[],r=0;r<e.numChannels;r++)c.push(Object(m.jsx)(o,{iChannel:r,model:e},r));return[Object(m.jsx)(F.a,{container:!0,item:!0,spacing:0,style:{padding:"".concat(ct,"vh"),width:"".concat(a,"vh")},children:c},"buttons")]}var ft=function(t){var e=t.model,n=(t.options,t.sharedData),a=Object(i.useReducer)((function(t){return t+1}),0),s=Object(f.a)(a,2)[1];n.updateGUI=s,window.updateGUI=s;var o=lt();return[Object(m.jsx)("div",{className:o.mainGUI,onPointerOver:function(t){n.GUIHovered=!0},onPointerOut:function(t){n.GUIHovered=!1},children:Object(m.jsxs)(B.a,{children:[Object(m.jsxs)(R.a,{button:!0,selected:!1,onClick:function(t){var n=document.createElement("input");document.body.appendChild(n),n.type="file",n.id="inputFile",n.style="display:none",document.getElementById("inputFile").click(),document.getElementById("inputFile").onchange=function(){var t=new FileReader;t.onload=function(t){var n=t.target.result;window.inputFileString=n;var i=JSON.parse(n);e.loadDict(i),e.simulate=!1,e.gravity=!0,e.forceUpdate(),s()},t.readAsText(document.getElementById("inputFile").files[0]),document.body.removeChild(n)}},children:[Object(m.jsx)(H.a,{children:Object(m.jsx)(W.a,{})}),Object(m.jsx)(T.a,{children:"Load"})]}),Object(m.jsxs)(R.a,{button:!0,onClick:function(t){var n=e.saveData(),i=JSON.stringify(n),a=document.createElement("a");document.body.appendChild(a),a.download="download.json",a.style.display="none",a.href="data:text/plain;charset=utf-8,"+encodeURIComponent(i),a.click(),document.body.removeChild(a)},children:[Object(m.jsx)(H.a,{children:Object(m.jsx)($.a,{})}),Object(m.jsx)(T.a,{children:"Download"})]}),Object(m.jsx)(q.a,{}),Object(m.jsxs)(R.a,{button:!0,selected:e.editing,onClick:function(t){e.editing=!e.editing,e.Model.gravity=!e.editing,e.simulate=!0,e.gravity=!e.editing,s(),e.editing&&e.resetV(),e.forceUpdate()},children:[Object(m.jsx)(H.a,{children:Object(m.jsx)(tt.a,{})}),Object(m.jsx)(T.a,{children:"Edit Shape"})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(K.a,{style:{width:"50%"},children:"Contraction"}),Object(m.jsx)(X.a,{style:{width:"50%"},disabled:!e.eStatus.includes(2)||!Object(L.a)(Array(e.e.length).keys()).every((function(t){return 2===e.eStatus[t]&&e.edgeActive[t]||2!==e.eStatus[t]})),defaultValue:e.Model.maxMaxContraction,"aria-labelledby":"discrete-slider-custom",step:e.Model.contractionInterval,min:0,max:e.Model.maxMaxContraction,valueLabelDisplay:"auto",onChange:function(t,n){for(var i=0;i<e.e.length;i++)2===e.eStatus[i]&&(e.maxContraction[i]=n)},onPointerOut:function(){e.forceUpdate()}})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(K.a,{style:{width:"50%"},children:"Length"}),Object(m.jsx)(X.a,{style:{width:"50%"},disabled:!e.eStatus.includes(2)||!Object(L.a)(Array(e.e.length).keys()).every((function(t){return 2===e.eStatus[t]&&!e.edgeActive[t]||2!==e.eStatus[t]})),defaultValue:e.Model.maxMaxContraction,"aria-labelledby":"discrete-slider-custom",step:e.Model.contractionInterval,min:0,max:e.Model.maxMaxContraction,valueLabelDisplay:"auto",onChange:function(t,n){for(var i=0;i<e.e.length;i++)2===e.eStatus[i]&&!1===e.edgeActive[i]&&(e.maxContraction[i]=n);e.forceUpdate()}})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{style:{width:"50%"},children:"Fix Joints"}),Object(m.jsxs)(F.a,{container:!0,style:{width:"50%"},spacing:0,alignItems:"center",children:[Object(m.jsx)(F.a,{item:!0,style:{width:"50%",textAlign:"center"},children:Object(m.jsx)(E.a,{size:"small",onClick:function(t){for(var n=0;n<e.v.length;n++)2===e.vStatus[n]&&(e.fixedVs[n]=!0);s(),e.forceUpdate()},children:Object(m.jsx)(et.a,{})})},"fix"),Object(m.jsx)(F.a,{item:!0,style:{width:"50%",textAlign:"center"},children:Object(m.jsx)(E.a,{size:"small",onClick:function(t){for(var n=0;n<e.v.length;n++)2===e.vStatus[n]&&(e.fixedVs[n]=!1);s(),e.forceUpdate()},children:Object(m.jsx)(nt.a,{})})},"unfix")]})]}),Object(m.jsx)(ht,{model:e,updateGUI:s}),Object(m.jsx)(q.a,{}),Object(m.jsxs)(R.a,{button:!0,selected:n.editingScript,onClick:function(t){n.editingScript=!n.editingScript,s()},children:[Object(m.jsx)(H.a,{children:Object(m.jsx)(tt.a,{})}),Object(m.jsx)(T.a,{children:"Script & Channel"})]}),Object(m.jsx)(dt,{n:e.numChannels,model:e,updateGUI:s}),Object(m.jsx)(ut,{n:e.numChannels,model:e,updateGUI:s}),Object(m.jsx)(q.a,{}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Gravity"}),Object(m.jsx)(N.a,{i:0,checked:e.gravity,onChange:function(t){e.gravity=!e.gravity,s()}})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Simulate"}),Object(m.jsx)(N.a,{i:0,checked:e.simulate,onChange:function(t){e.simulate=!e.simulate,s()}})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(K.a,{style:{width:"50%"},children:"Friction"}),Object(m.jsx)(X.a,{style:{width:"50%"},defaultValue:e.Model.frictionFactor,"aria-labelledby":"discrete-slider-custom",step:.1,min:0,max:1,valueLabelDisplay:"auto"})]}),Object(m.jsx)(q.a,{}),Object(m.jsxs)(R.a,{button:!0,onClick:function(t){e.controls.current.target=e.centroid(),e.forceUpdate()},children:[Object(m.jsx)(H.a,{children:Object(m.jsx)(it.a,{})}),Object(m.jsx)(T.a,{children:"Look At Center"})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Show Channel"}),Object(m.jsx)(N.a,{i:1,checked:n.showChannel,onChange:function(t){n.showChannel=!n.showChannel,s()}})]})]})},"mainGUI"),Object(m.jsx)("div",{className:o.editingGUI,style:e.editing?{display:"block"}:{display:"none"},onPointerOver:function(t){n.GUIHovered=!0},onPointerOut:function(t){n.GUIHovered=!1},children:Object(m.jsxs)(B.a,{children:[Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Add Joint"}),Object(m.jsx)(N.a,{checked:n.addingJoint,onChange:function(t,e){n.addingJoint=e,e&&(n.removingJoint=!1,n.movingJoint=!1),s()}},"add_joint")]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Move Joint"}),Object(m.jsx)(N.a,{checked:n.movingJoint,onChange:function(t,i){n.movingJoint=i,i&&(n.removingJoint=!1,n.addingJoint=!1),e.simulate=!0,e.resetSelection(),s()}},"add_joint")]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Remove Joint"}),Object(m.jsx)(N.a,{checked:n.removingJoint,onChange:function(t,e){n.removingJoint=e,e&&(n.addingJoint=!1,n.movingJoint=!1),s()}},"remove_joint")]}),Object(m.jsxs)(R.a,{button:!0,onClick:function(t){for(var n=[],i=0;i<e.v.length;i++)2===e.vStatus[i]&&n.push(i);e.addEdges(n),e.precompute(),e.forceUpdate(),s()},children:[Object(m.jsx)(H.a,{children:Object(m.jsx)(at.a,{})}),Object(m.jsx)(T.a,{children:"Connect Joints"})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"X:"}),Object(m.jsx)(X.a,{defaultValue:0,"arial-labelledby":"continuous-slider",step:.01,min:-Math.PI/2,max:Math.PI/2,valueLabelDisplay:"auto",onChange:function(t,n){e.rotate(n,e.euler.y,e.euler.z),e.resetV()}})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Y:"}),Object(m.jsx)(X.a,{defaultValue:0,"arial-labelledby":"continuous-slider",step:.01,min:-Math.PI/2,max:Math.PI/2,valueLabelDisplay:"auto",onChange:function(t,n){e.rotate(e.euler.x,n,e.euler.z),e.resetV()}})]}),Object(m.jsxs)(R.a,{children:[Object(m.jsx)(T.a,{children:"Z:"}),Object(m.jsx)(X.a,{defaultValue:0,"arial-labelledby":"continuous-slider",step:.01,min:-Math.PI/2,max:Math.PI/2,valueLabelDisplay:"auto",onChange:function(t,n){e.rotate(e.euler.x,e.euler.y,n),e.resetV()}})]})]})},"editingGUI"),Object(m.jsx)("div",{className:o.scriptGUI,style:n.editingScript?{display:"block"}:{display:"none"},onPointerOver:function(t){n.GUIHovered=!0},onPointerOut:function(t){n.GUIHovered=!1},children:Object(m.jsx)(vt,{model:e,sharedData:n,classes:o,updateGUI:s})},"scriptGUI"),Object(m.jsxs)("div",{className:o.editingScriptGUI,style:n.editingScript?{display:"block"}:{display:"none"},onPointerOver:function(t){n.GUIHovered=!0},onPointerOut:function(t){n.GUIHovered=!1},children:[Object(m.jsxs)(F.a,{container:!0,item:!0,spacing:2,alignItems:"center",style:{padding:"".concat(ct,"vh"),paddingTop:"0",paddingBottom:"0",width:"".concat(50.2,"vh")},children:[Object(m.jsx)(F.a,{item:!0,style:{margin:"".concat(rt,"vh"),width:"10vh",fontSize:"small"},children:"Channels"}),Object(m.jsx)(F.a,{item:!0,style:{margin:"".concat(rt,"vh"),width:"".concat(30,"vh")},children:Object(m.jsx)(X.a,{defaultValue:e.Model.defaultNumChannels,"aria-labelledby":"discrete-slider-custom",step:1,min:1,max:5,valueLabelDisplay:"auto",onChange:function(t,n){e.numChannels=n,e.precompute(),s()}},"numChannels")})]},"numChannels"),Object(m.jsxs)(F.a,{container:!0,item:!0,spacing:2,alignItems:"center",style:{padding:"".concat(ct,"vh"),paddingTop:"0",paddingBottom:"0",width:"".concat(50.2,"vh")},children:[Object(m.jsx)(F.a,{item:!0,style:{margin:"".concat(rt,"vh"),width:"10vh",fontSize:"small"},children:"Actions"}),Object(m.jsx)(F.a,{item:!0,style:{margin:"".concat(rt,"vh"),width:"".concat(30,"vh")},children:Object(m.jsx)(X.a,{defaultValue:e.Model.defaultNumActions,"aria-labelledby":"discrete-slider-custom",step:1,min:1,max:20,valueLabelDisplay:"auto",onChange:function(t,n){e.numActions=n,e.precompute(),s()}},"numActions")})]},"numActions")]},"editingScriptGUI")]};var jt=function(){var t=new v;window.model=t;var e={updateGUI:null,GUIHovered:!1,unSelect:!1,addingJoint:!1,movingJoint:!1,removingJoint:!1,showChannel:!1,editingScript:!1,numActions:20,numChannels:4};return t.sharedData=e,window.sharedData=e,window.addEventListener("pointerdown",(function(t){e.unSelect=!0}),!1),window.addEventListener("pointermove",(function(t){e.unSelect=!1}),!1),window.addEventListener("pointerup",(function(n){e.unSelect&&(e.GUIHovered||t.vStatus.every((function(t){return 1!==t}))&&t.eStatus.every((function(t){return 1!==t}))&&t.fStatus.every((function(t){return 1!==t}))&&(t.vStatus.fill(0),t.eStatus.fill(0),t.fStatus.fill(0)),e.updateGUI&&setTimeout((function(){e.updateGUI()}),10))}),!1),window.addEventListener("keydown",(function(e){"KeyA"===e.code&&(e.metaKey||e.ctrlKey)&&(t.eStatus.fill(2),t.vStatus.fill(2))}),!1),[Object(m.jsx)(J,{model:t,sharedData:e},"viewer"),Object(m.jsx)(ft,{id:"hehe",model:t,sharedData:e},"gui")]},pt=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,129)).then((function(e){var n=e.getCLS,i=e.getFID,a=e.getFCP,s=e.getLCP,o=e.getTTFB;n(t),i(t),a(t),s(t),o(t)}))},gt=document.getElementById("root");o.a.render(Object(m.jsx)(a.a.StrictMode,{children:Object(m.jsx)(jt,{})}),gt),pt()}},[[84,1,2]]]);
//# sourceMappingURL=main.16106019.chunk.js.map