/*! For license information please see matter-liquid.js.LICENSE.txt */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("matter-js")):"function"==typeof define&&define.amd?define(["matter-js"],e):"object"==typeof exports?exports.MatterLiquid=e(require("matter-js")):t.MatterLiquid=e(t.Matter)}(self,(function(t){return(()=>{"use strict";var e={716:(t,e,s)=>{s.r(e);const n=JSON.parse('{"u2":"matter-liquid","i8":"0.0.1"}');function i(t,e){if(OffscreenCanvas)return new OffscreenCanvas(t,e);const s=document.createElement("canvas");return s.height=e,s.width=t,s}var r=s(538),o=s.n(r);function c(t){return Math.hypot(t[0],t[1])}function h(t){const e=Math.hypot(t[0],t[1]);return 0!==e?[t[0]/e,t[1]/e]:[0,0]}function u(t,e){return[t[0]*e,t[1]*e]}function l(t,e){return[t[0]/e,t[1]/e]}function a(t,e){return[e[0]-t[0],e[1]-t[1]]}function f(t,e){return[t[0]-e[0],t[1]-e[1]]}function p(t,e,s,n,i,r){return t>s&&t<i&&e>n&&e<r}function d(t,e,s){const n=s-e;return e+((t-e)%n+n)%n}function m(t,e,s){return Math.min(Math.max(t,e),s)}function g(t,e,s){return o().Vertices.contains(t.vertices,{x:e,y:s})}function v(t,e=0){return[t.min.x-e,t.min.y-e,t.max.x+e,t.max.y+e]}function y(t,e,s,n){const i=(e[0]-t[0])*(n[1]-s[1])-(n[0]-s[0])*(e[1]-t[1]);if(0===i)return!1;const r=((n[1]-s[1])*(n[0]-t[0])+(s[0]-n[0])*(n[1]-t[1]))/i,o=((t[1]-e[1])*(n[0]-t[0])+(e[0]-t[0])*(n[1]-t[1]))/i;return r>0&&r<1&&o<1}function x(t,e){let s=-1;const{length:n}=t;for(;++s<n;)e(t[s],s)}function b(t,e,s,n){x(s,((t,s)=>{null===t||e&&!p(t[0],t[1],...e)||n(t,s)}))}function C(t,e,s){x(e,(e=>s(t[e],e)))}function S(t,e){return t.sh.getAroundCellsItems(e[0],e[1],t.p)}function w(t,e,s){!function(t,e,s){x(e,(e=>s(t[e],e)))}(t.p,S(t,e),s)}function M(t,e){for(const[s,n]of Object.entries(t))e(s,n)}function I(t,e){return a([t[0],t[1]],[e[0],e[1]])}function P(t,e){t[0]+=e[0],t[1]+=e[1]}function R(t,e,s){t[2]+=e*s[0],t[3]+=e*s[1]}function O(t,e){t[0]+=e*t[2],t[1]+=e*t[3]}function j(t,e,s){const n=.2*t.h,i=.3*t.h;let r=0,o=0;const a=S(t,e),f=[];for(let s=0;s<a.length;s++){const n=t.p[a[s]],i=I(e,n),h=c(l(i,t.h));if(h<1){const t=1-h;r+=t**2,o+=t**3,f.push([t,i,n])}}const p=.3*(r-n),d=i*o,m=[0,0];for(let t=0;t<f.length;t++){const[e,n,i]=f[t],r=l(u(h(n),s**2*(p*e+d*e**2)),2);m[0]-=r[0],m[1]-=r[1],P(i,r)}P(e,m)}function q(t,e,s){const{p:n}=t;var i,r;(e?(i=t.w.bodies,r=e,o().Query.region(i,{min:{x:r[0],y:r[1]},max:{x:r[2],y:r[3]}})):t.w.bodies).forEach((e=>{const s=function(t,e,s,n){const i=[],r=s.getItemsOfCellsInBounds(e.bounds);for(let s=0;s<r.length;s++){const n=r[s],o=t[n];g(e,o[0],o[1])&&i.push(n)}return i}(n,e,t.sh);C(n,s,(t=>{const s=function(t,e){const s=[e.velocity.x,e.velocity.y],n=f([t[2],t[3]],s),i=h(n),r=f(n,i);return f(i,u(r,1))}(t,e),n=[t[0],t[1]];if(function(t,e){t[2]-=e[0],t[3]-=e[1]}(t,s),g(e,t[0],t[1])){i=a([e.position.x,e.position.y],[t[0],t[1]]),Math.sign(i[0]),Math.sign(i[1]);const s=function(t,e,s){const n=[t.position.x,t.position.y];var i,r;const o=function(t,e,s){const n=t.vertices;for(let t=0;t<n.length;t++){const i=n[t],r=n[t!==n.length-1?t+1:0],o=[i.x,i.y],c=[r.x,r.y];if(y(o,c,e,s))return[o,c]}return null}(t,(i=e,(r=s)[0]!==i[0]||r[1]!==i[1]?s:n),e),c=function(t,e){const s=h(a([t[0],t[1]],[e[0],e[1]]));return[s[1],-s[0]]}(o[0],o[1]);return function(t,e,s,n){const i=(t[0]-e[0])*(s[1]-n[1])-(t[1]-e[1])*(s[0]-n[0]);if(0===i)return null;const r=t[0]*e[1]-t[1]*e[0],o=s[0]*n[1]-s[1]*n[0];return[(r*(s[0]-n[0])-(t[0]-e[0])*o)/i,(r*(s[1]-n[1])-(t[1]-e[1])*o)/i]}(o[0],o[1],e,function(t,e){return[e[0]+t[0],e[1]+t[1]]}(e,c))}(e,n,[t[0],t[1]]);t[0]=s[0],t[1]=s[1]}var i}))}))}function z(t,e,s,n){C(t.p,e,((e,i)=>{!function(t,e,s){t[2]=(t[0]-s[0])/e,t[3]=(t[1]-s[1])/e}(e,s,n[i]);const r=t.bb,o=t.w.bounds;if(t.iwx)e[0]=d(e[0],o.min.x,o.max.x);else{const t=e[0];e[0]=m(t,o.min.x,o.max.x),t!==e[0]&&(e[2]*=-r,e[3]*=r)}if(t.iwy)e[1]=d(e[1],o.min.y,o.max.y);else{const t=e[1];e[1]=m(t,o.min.y,o.max.y),t!==e[1]&&(e[2]*=r,e[3]*=-r)}t.sh.update(i,e[0],e[1])}))}function T(t,e){const s=t.store,n=[],i=t.getGravity(),r={},o=s.irc?v(s.r.bounds,s.abp):null;b(0,o,s.p,((t,o)=>{n.push(o),R(t,e,i),r[o]=[t[0],t[1]],function(t,e){const[s,n]=function(t,e){const s=Math.hypot(t[0],t[1]);return u(l(t,s||1),Math.max(0,Math.min(e,s)))}([t[2],t[3]],e);t[2]=s,t[3]=n}(t,.6*s.h),O(t,e)})),C(s.p,n,(t=>{j(s,t,e)})),q(s,o),z(s,n,e,r)}function E(t,e){const s=t.store,n=v(s.r.bounds,s.abp),i=[],r=t.getGravity(),o={};b(0,n,s.p,((t,s)=>{i.push(s),R(t,e,r)})),C(s.p,i,(t=>{!function(t,e,s){w(t,e,(n=>{const i=I(e,n),r=h(i),o=c(l(i,t.h));if(o<1){const t=c((g=e,m=a([(v=n)[2],v[3]],[g[2],g[3]]),[(d=r)[0]*m[0],d[1]*m[1]]));if(t>0){const i=l(u(r,s*(1-o)*(.01*t+.01*t**2)),2);p=i,(f=e)[2]-=p[0],f[3]-=p[1],function(t,e){t[2]+=e[0],t[3]+=e[1]}(n,i)}}var f,p,d,m,g,v}))}(s,t,e)})),C(s.p,i,((t,s)=>{o[s]=[t[0],t[1]],O(t,e)})),function(t,e,s){C(t.p,e,((e,n)=>{w(t,e,((i,r)=>{if(c(l(I(e,i),t.h))<1){const o=c(I(e,i));let h=10-o;const u=function(t,e){return`${t}.${e}`}(n,r),l=.1*h;o>10+l?h+=.03*s*(o-10-l):o<10-l&&(h-=.03*s*(10-l-o)),void 0===t.s[u]&&(t.s[u]=h)}}))})),M(t.s,((e,s)=>{Math.abs(s)>t.h&&(t.s[e]=void 0)})),M(t.s,((e,n)=>{const[i,r]=function(t){const[e,s]=t.split(".");return[+e,+s]}(e),o=t.p[i],a=t.p[r],f=I(o,a),p=h(f),d=c(f),m=n,g=l(u(p,s**2*.001*(1-m/t.h)*(m-d)),2);var v,y;y=g,(v=o)[0]-=y[0],v[1]-=y[1],P(a,g)}))}(s,i,e),C(s.p,i,(t=>{j(s,t,e)})),z(s,i,e,o)}function k(t,e){const s=t.split(".");return[s[0]*e,s[1]*e]}function U(t,e){const s=i(6*e,6*e),n=s.getContext("2d");return n.shadowColor=t,n.shadowBlur=2*e,n.fillStyle=t,n.beginPath(),n.arc(3*e,3*e,e,0,2*Math.PI),n.fill(),s}function A(t){const e=t.r.context,s=v(t.r.bounds,t.rbp);x(t.p,((n,i)=>{if(null===n||!p(n[0],n[1],...s))return;const r=Math.floor(n[0]),o=Math.floor(n[1]),c=t.lpl[i][1],h=c.height/2;e.drawImage(c,r-h,o-h)}))}function _(t){Matter.Render.startViewTransform(t.store.r),A(t.store)}function B(t){const{store:e}=t,s=e.r.context;Matter.Render.startViewTransform(e.r);const n=v(e.r.bounds,e.rbp),i=v(e.w.bounds),r=v(e.r.bounds,e.abp);!function(t){const e=t.r.context,{cellSize:s}=t.sh,n=s/2,i=Object.entries(t.sh.hash);e.textAlign="center",e.lineWidth=1,e.fillStyle="white",e.strokeStyle="green";for(const[t,r]of i){const[i,o]=k(t,s);e.fillText(r.length,i,o),e.strokeRect(i-n,o-n,s,s)}}(e),A(e),s.strokeStyle="violet",s.strokeRect(i[0],i[1],i[2]-i[0],i[3]-i[1]),s.strokeStyle="orange",s.strokeRect(r[0],r[1],r[2]-r[0],r[3]-r[1]),s.strokeStyle="cyan",s.strokeRect(n[0],n[1],n[2]-n[0],n[3]-n[1]);s.lineWidth=1,s.strokeStyle="yellow",s.beginPath(),s.moveTo(-1e3,0),s.lineTo(1e3,0),s.moveTo(0,-1e3),s.lineTo(0,1e3),s.stroke()}const G=Math.trunc;function L(t,e){return`${t}.${e}`}function F(t,e){const s=t.indexOf(e);return-1!==s&&t.splice(s,1),t}class V{constructor(){this.hash={},this.prevItemCell={}}init(t){this.cellSize=t}find(t,e){return(this.hash[t]||[]).indexOf(e)}save(t,e){const s=this.hash[e];void 0===s?(this.hash[e]=[t],this.prevItemCell[t]=e):s.includes(t)||(s.push(t),this.prevItemCell[t]=e)}getCell(t,e){return this.hash[L(t,e)]||[]}_delete(t,e){const s=this.hash[e];F(s,t),delete this.prevItemCell[t],0===s.length&&delete this.hash[e]}update(t,e,s){const n=G(e/this.cellSize),i=G(s/this.cellSize),r=this.prevItemCell[t],o=L(n,i);r!==o&&(void 0!==r&&this._delete(t,r),this.save(t,o))}clear(){this.hash={},this.prevItemCell={}}insert(t,e,s){const n=L(G(e/this.cellSize),G(s/this.cellSize));this.save(t,n)}remove(t){const e=this.prevItemCell[t];this._delete(t,e)}getAroundCellsItems(t,e,s){const n=G(t/this.cellSize),i=G(e/this.cellSize),r=L(n,i);return[...this.getCell(n-1,i-1),...this.getCell(n,i-1),...this.getCell(n+1,i-1),...this.getCell(n-1,i),...F(this.hash[r]||[],r),...this.getCell(n+1,i),...this.getCell(n-1,i+1),...this.getCell(n,i+1),...this.getCell(n+1,i+1)]}fill(t){t.forEach(((t,e)=>{const s=t[0],n=t[1];this.insert(e,s,n)}))}getItemsOfCellsInBounds(t){const e=G(t.min.x/this.cellSize),s=G(t.min.y/this.cellSize),n=G(t.max.x/this.cellSize),i=G(t.max.y/this.cellSize),r=[];for(let t=s;t<=i;t++)for(let s=e;s<=n;s++){const e=L(s,t);r.push(...this.hash[e]||[])}return r}}const $=["pauseChange","particleRemove"];class W{constructor(t){this.liquid=t,this.store=t.store,this.events=t.events}drip(t,e,s){const n=0===this.store.fpids.length?this.store.p.length:this.store.fpids.pop(),i=new Float32Array([e,s,0,0]);this.store.lpl[n]=this.store.l[t],this.store.p[n]=i,this.store.sh.insert(n,e,s)}rect(t,e,s,n,i,r=this.store.h){const o=this.liquid.getLiquidId(t),c=r/2,h=Math.max(1,Math.trunc(n/r)),u=Math.max(1,Math.trunc(i/r));for(let t=0;t<h;t++)for(let n=0;n<u;n++){const i=e+c+t*r,l=s+c+n*r;this.drip(o,i,l),t!==h-1&&n!==u-1&&this.drip(o,i+c,l+c)}}}class D{constructor(t){this.liquid=t,this.store=t.store,this.events=t.events}dry(t){const e=this.store.p[t];this.store.p[t]=null,this.store.sh.remove(t),this.events.particleRemove(e,t,this.store.lpl[t]),this.store.fpids.push(t)}rect(t,e,s,n){this.store.p.forEach(((i,r)=>{null!==i&&p(i[0],i[1],t,e,t+s,e+n)&&this.dry(r)}))}}class J extends class{constructor(t){this.events=function(){const t={};return $.forEach((e=>t[e]=()=>0)),t}();const e=t.radius||32,s=e*(t.particleTextureScale||.3);let n=[!1,!1];const i=t.worldWrapping;null!=i&&(n="boolean"==typeof i?[i,i]:i);const r={},o=t.liquids.map(((t,e)=>(t.name&&(r[t.name]=e),function(t,e){const s=t.color||"#fff";return[s,t.texture||U(s,e)]}(t,s))));this.store=Object.seal({h:e,iwx:n[0],iwy:n[1],e:t.engine,r:t.render,w:t.engine.world,irc:t.isRegionalComputing||!1,l:o,lnlid:r,bb:t.bordersBounce||.8,ip:!1,g:.2,sh:new V,rbp:0,abp:0,p:[],s:{},fpids:[],lpl:{},t:0,ef:2,dt:1}),this.store.sh.init(this.store.h),this.setGravityRatio(t.gravityRatio),this.setUpdateEveryFrame(t.updateEveryFrame),this.setTimeScale(t.timeScale)}setPause(t=!0){this.store.ip=t,this.events.pauseChange(t)}setRenderBoundsPadding(t){this.store.rbp=t}setActiveBoundsPadding(t){this.store.abp=t}setGravityRatio(t=this.store.g){this.store.g=t}setUpdateEveryFrame(t=this.store.ef){this.store.ef=t}setTimeScale(t=this.store.dt){this.store.dt=t}getGravity(){return[this.store.w.gravity.x*this.store.g,this.store.w.gravity.y*this.store.g]}getParticlesCount(){return this.store.p.length-this.store.fpids.length}getLiquidId(t){return"number"==typeof t?t:this.store.lnlid[t]}}{constructor(t){super(t),this.drip=new W(this),this.dry=new D(this),this.renderUpdater=t.isDebug?B:_,this.computeUpdater=t.isAdvancedAlgorithm?E:T,this.updateCompute=this.updateCompute.bind(this),o().Events.on(t.render,"afterRender",this.updateRender.bind(this)),this.setPause(!!t.isPaused)}updateCompute(){this.store.t++%this.store.ef==0&&this.computeUpdater(this,this.store.e.timing.timeScale*this.store.dt)}updateRender(){this.renderUpdater(this)}setPause(t=!0){t?o().Events.off(this.store.e,"afterUpdate",this.updateCompute):o().Events.on(this.store.e,"afterUpdate",this.updateCompute),super.setPause(t)}}const N={name:n.u2,version:n.i8,for:"matter-js@0.16.1",install(t){t.Liquid={create:t=>new J(t),VirtualCanvas:i}}};Matter.Plugin.register(N)},538:e=>{e.exports=t}},s={};function n(t){var i=s[t];if(void 0!==i)return i.exports;var r=s[t]={exports:{}};return e[t](r,r.exports,n),r.exports}return n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var s in e)n.o(e,s)&&!n.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n(716)})()}));