!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("matter-js")):"function"==typeof define&&define.amd?define(["matter-js"],n):"object"==typeof exports?exports.MatterLiquid=n(require("matter-js")):t.MatterLiquid=n(t.Matter)}(self,(function(t){return(()=>{"use strict";var n={912:(t,n,e)=>{e.r(n);const r=JSON.parse('{"u2":"matter-liquid","i8":"0.0.1"}');var o=e(538),i=e.n(o);const c=0,u=1,s=2,a=3,f=0,l=3,p=4;function d(t,n,[e,r,o,i]){return t>e&&t<o&&n>r&&n<i}function h(t,n,e){const r=e-n;return n+((t-n)%r+r)%r}function g(t,n){return t>n?t:n}function m(t,n,e){return t<n?n:t>e?e:t}function x(t){const n=t.length,[e,r,o,i,c,u,s,a,f]=t;return n<6?[`0x${r}`/15,`0x${o}`/15,`0x${i}`/15,5===n?`0x${c}`/15:1]:[`0x${r}${o}`/255,`0x${i}${c}`/255,`0x${u}${s}`/255,9===n?`0x${a}${f}`/255:1]}function y(t){return Math.hypot(t[0],t[1])}function v(t){const n=Math.hypot(t[0],t[1]);return 0!==n?[t[0]/n,t[1]/n]:[0,0]}function b(t,n){return[t[0]*n,t[1]*n]}function M(t,n){return[t[0]/n,t[1]/n]}function w(t,n){return[n[0]+t[0],n[1]+t[1]]}function j(t,n){return[n[0]-t[0],n[1]-t[1]]}function q(t,n){return[t[0]-n[0],t[1]-n[1]]}function O(t,n){let e=-1;const{length:r}=t;for(;++e<r;)n(t[e],e)}function P(t,n,e,r){O(e,((t,e)=>{null===t||n&&!d(t[c],t[u],n)||r(t,e)}))}function R(t,n,e){O(n,(n=>e(t[n],n)))}function $(t,n){const e=t.p[n];return t.sh.getNearby(e[c],e[u],t.p)}function S(t,n,e){!function(t,n,e){O(n,(n=>e(t[n],n)))}(t.p,$(t,n),e)}function C(t,n){for(const[e,r]of Object.entries(t))n(e,r)}function L(t,n,e){return i().Vertices.contains(t.vertices,{x:n,y:e})}function E(t,n=0){return[t.min.x-n,t.min.y-n,t.max.x+n,t.max.y+n]}function F(t,n,e,r){const o=(n[0]-t[0])*(r[1]-e[1])-(r[0]-e[0])*(n[1]-t[1]);if(0===o)return!1;const i=((r[1]-e[1])*(r[0]-t[0])+(e[0]-r[0])*(r[1]-t[1]))/o,c=((t[1]-n[1])*(r[0]-t[0])+(n[0]-t[0])*(r[1]-t[1]))/o;return i>0&&i<1&&c<1}function B(t,n){return j([t[c],t[u]],[n[c],n[u]])}function A(t,n,e){const r=n;t[c]+=r[0],t[u]+=r[1]}function T(t,n){t[c]+=n*t[s],t[u]+=n*t[a]}function G(t,n){const[e,r]=function(t,n){const e=Math.hypot(t[0],t[1]);return b(M(t,e||1),m(e,-n,n))}([t[s],t[a]],n);t[s]=e,t[a]=r}function I(t,n,e){const r=t.p[n];S(t,n,(n=>{const o=B(r,n),i=v(o),c=y(M(o,t.h));if(c<1){const t=(d=r,j([(h=n)[s],h[a]],[d[s],d[a]])),o=y((p=t,[(l=i)[0]*p[0],l[1]*p[1]]));if(o>0){const t=M(b(i,e*(1-c)*(.01*o+.01*o**2)),2);f=t,(u=r)[s]-=f[0],u[a]-=f[1],function(t,n){t[s]+=n[0],t[a]+=n[1]}(n,t)}}var u,f,l,p,d,h}))}function _(t,n,e){R(t.p,n,((n,r)=>{S(t,r,((r,o)=>{if(y(M(B(n,r),t.h))<1){const o=y(B(n,r));let i=10-o;const c=0,u=.1*i;o>10+u?i+=.03*e*(o-10-u):o<10-u&&(i-=.03*e*(10-u-o)),void 0===t.s[c]&&(t.s[c]=i)}}))})),C(t.s,((n,e)=>{Math.abs(e)>t.h&&(t.s[n]=void 0)})),C(t.s,((n,r)=>{const[o,i]=function(t){const[n,e]=t.split(".");return[+n,+e]}(n),s=t.p[o],a=B(s,t.p[i]),f=v(a),l=y(a),p=r,d=M(b(f,e**2*.001*(1-p/t.h)*(p-l)),2);var h,g;g=d,(h=s)[c]-=g[0],h[u]-=g[1]}))}function N(t,n,e){const r=[t.position.x,t.position.y];if(t.circleRadius){return w(r,b(v(j(r,e)),t.circleRadius))}var o,i;const c=function(t,n,e){const r=t.vertices;for(let t=0;t<r.length;t++){const o=r[t],i=r[t!==r.length-1?t+1:0],c=[o.x,o.y],u=[i.x,i.y];if(F(c,u,n,e))return[c,u]}return null}(t,(o=n,(i=e)[0]!==o[0]||i[1]!==o[1]?e:r),n),u=function(t,n){const e=v(j([t[0],t[1]],[n[0],n[1]]));return[e[1],-e[0]]}(c[0],c[1]);return function(t,n,e,r){const o=(t[0]-n[0])*(e[1]-r[1])-(t[1]-n[1])*(e[0]-r[0]);if(0===o)return null;const i=t[0]*n[1]-t[1]*n[0],c=e[0]*r[1]-e[1]*r[0];return[(i*(e[0]-r[0])-(t[0]-n[0])*c)/o,(i*(e[1]-r[1])-(t[1]-n[1])*c)/o]}(c[0],c[1],n,w(n,u))}function V(t,n,e,r){const{p:o}=t;(n?function(t,n){return i().Query.region(t,{min:{x:n[0],y:n[1]},max:{x:n[2],y:n[3]}})}(t.w.bodies,n):t.w.bodies).forEach((n=>{const r=function(t,n,e,r){const o=[],i=e.getFromBounds(n.bounds);for(let e=0;e<i.length;e++){const r=i[e],s=t[r];L(n,s[c],s[u])&&o.push(r)}return o}(o,n,t.sh);R(o,r,(t=>{if(!d(t[c],t[u],e))return;const r=function(t,n){const e=[n.velocity.x,n.velocity.y],r=q([t[s],t[a]],e),o=v(r),i=q(r,o);return q(o,b(i,1))}(t,n),o=[t[c],t[u]];if(function(t,n){t[s]-=n[0],t[a]-=n[1]}(t,r),L(n,t[c],t[u])){const e=N(n,o,[t[c],t[u]]);t[c]=e[0],t[u]=e[1]}}))}))}function U(t,n,e,r){R(t.p,n,((n,o)=>{!function(t,n,e){t[s]=(t[c]-e[0])/n,t[a]=(t[u]-e[1])/n}(n,e,r[o]);const i=t.bb,f=t.b;if(t.iwx)n[c]=h(n[c],f[0],f[2]);else{const t=n[c];n[c]=m(t,f[0],f[2]),t!==n[c]&&(n[s]*=-i,n[a]*=i)}if(t.iwy)n[u]=h(n[u],f[1],f[3]);else{const t=n[u];n[u]=m(t,f[1],f[3]),t!==n[u]&&(n[s]*=i,n[a]*=-i)}t.sh.update(o,n[c],n[u])}))}function W(t,n){const e=[],r=Matter.Liquid.getGravity(t),o={},i=t.irc?E(t.r.bounds,t.abp):null,f=t.b,l=.75*t.h;P(0,i,t.p,((i,f)=>{e.push(f),function(t,n,e,r){t[s]+=n*r*e[0],t[a]+=n*r*e[1]}(i,n,r,t.lpl[f][p]),o[f]=[i[c],i[u]],G(i,l),T(i,n),t.sh.update(f,i[c],i[u])})),R(t.p,e,((e,r)=>{!function(t,n,e,r){const o=t.lpl[e][p],i=.2*t.h,c=.3*t.h;t.h;let u=0,s=0;const a=$(t,e),f=Array(a.length);for(let e=0;e<a.length;e++){const r=a[e],o=B(n,t.p[r]),i=g(1-y(M(o,t.h)),.5);u+=i**2,s+=i**3,f[e]=[i,r,o]}const l=.3*(u-i)*o,d=c*s,h=[0,0];for(let n=0;n<f.length;n++){const[e,o,i]=f[n],c=t.p[o],u=M(b(v(i),r**2*(l*e+d*e**2)),2);h[0]-=u[0],h[1]-=u[1],A(c,u),t.sh.update(o,c[0],c[1])}A(n,h),t.sh.update(e,n[0],n[1])}(t,e,r,n)})),V(t,i,f),U(t,e,n,o)}function H(t,n){const e=E(t.r.bounds,t.abp),r=[],o=(Matter.Liquid.getGravity(t),{});P(0,e,t.p,((t,n)=>{r.push(n)})),R(t.p,r,((e,r)=>{I(t,r,n)})),R(t.p,r,((t,e)=>{o[e]=[t[c],t[u]],T(t,n)})),_(t,r,n),R(t.p,r,(t=>{})),U(t,r,n,o)}function J(t,n){if(OffscreenCanvas)return new OffscreenCanvas(t,n);const e=document.createElement("canvas");return e.height=n,e.width=t,e}function Q(t,n){const e=J(6*n,6*n),r=e.getContext("2d");return r.shadowColor=t,r.shadowBlur=2*n,r.fillStyle=t,r.beginPath(),r.arc(3*n,3*n,n,0,2*Math.PI),r.fill(),e}function k(t){const n=t.r.context,e=E(t.r.bounds,t.rbp),r=t.sh.getFromRect(e);for(let e=0;e<r.length;e++){const o=r[e],i=t.p[o],s=Math.floor(i[c]),a=Math.floor(i[u]),f=t.lpl[o][l],p=f.height/2;n.drawImage(f,s-p,a-p)}}function z(t){t.r.context;Matter.Render.startViewTransform(t.r),k(t)}function D(t,n){const e=n.min.x,r=n.min.y,o=Math.round((n.max.x-n.min.x)/t);function i(t,n){return n*o+t}function c(t,n,e){const r=t.h[e];void 0===r?(t.h[e]=[n],t.p[n]=e):r.includes(n)||(r.push(n),t.p[n]=e)}function u(t,n,e){return t.h[i(n,e)]||[]}function s(t,n,e){!function(t,n){const e=t.indexOf(n);-1!==e&&t.splice(e,1)}(t.h[e],n),delete t.p[n]}const a={h:[],p:{},update:(n,o,u)=>{const f=Math.trunc((o-e)/t),l=Math.trunc((u-r)/t),p=a.p[n],d=i(f,l);p!==d&&(void 0!==p&&s(a,n,p),c(a,n,d))},insert:(n,o,u)=>{const s=i(Math.trunc((o-e)/t),Math.trunc((u-r)/t));c(a,n,s)},remove:t=>{const n=a.p[t];s(a,t,n)},getNearby:(n,o,i)=>{const c=Math.trunc((n-e)/t),s=Math.trunc((o-r)/t),f=[...u(a,c-1,s-1),...u(a,c,s-1),...u(a,c+1,s-1),...u(a,c-1,s),...u(a,c+1,s),...u(a,c-1,s+1),...u(a,c,s+1),...u(a,c+1,s+1)],l=u(a,c,s).slice();for(let e=0;e<f.length;e++){const r=f[e],c=i[r];(c[0]-n)**2+(c[1]-o)**2<=t**2&&l.push(r)}return l},getFromBounds:t=>a.getFromRect([t.min.x,t.min.y,t.max.x,t.max.y]),getFromRect:n=>{const o=Math.trunc((n[0]-e)/t),i=Math.trunc((n[1]-r)/t),c=Math.trunc((n[2]-e)/t),s=Math.trunc((n[3]-r)/t),f=[];for(let t=i;t<=s;t++)for(let n=o;n<=c;n++)f.push(...u(a,n,t));return f}};return Object.seal(a)}const K=["pauseChange","particleRemove"];function X(){const t={};return K.forEach((n=>t[n]=()=>0)),t}const Y={drip(t,n,e,r){const o=0===t.fpids.length?t.p.length:t.fpids.pop(),i=new Float32Array([e,r,0,0]);t.lpl[o]=t.l[n],t.p[o]=i,t.sh.insert(o,e,r),t.st.cl[n]++},rect(t,n,e,r,o,i,c=t.h){const u=Matter.Liquid.getLiquidId(t,n),s=c/2,a=g(Math.trunc(o/c),1),f=g(Math.trunc(i/c),1);for(let n=0;n<a;n++)for(let o=0;o<f;o++){const i=e+s+n*c,l=r+s+o*c;Y.drip(t,u,i,l),n!==a-1&&o!==f-1&&Y.drip(t,u,i+s,l+s)}}},Z={dry(t,n){const e=t.lpl[n],r=t.p[n];t.p[n]=null,t.sh.remove(n),t.ev.particleRemove(r,n,e),-1===t.fpids.indexOf(n)&&t.fpids.unshift(n),t.st.cl[e[f]]--},rect(t,n,e,r,o){t.p.forEach(((i,s)=>{null!==i&&d(i[c],i[u],[n,e,n+r,e+o])&&Z.dry(t,s)}))}},tt={utils:{VirtualCanvas:J},create:function(t){const n=i().Liquid,e=t.radius||32,r=e*(t.particleTextureScale||.3);let o=[false,false];const c=t.worldWrapping;null!=c&&(o="boolean"==typeof c?[c,c]:c);const u={},s=t.liquids.map(((t,n)=>(t.name&&(u[t.name]=n),function(t,n,e){const r=n.color||"#fff";return[t,r,x(r),n.texture||Q(r,e),n.mass||1]}(n,t,r)))),a=t.render.canvas,f=J(a.clientWidth,a.clientHeight).getContext("webgl2"),l=z,p=t.isAdvancedAlgorithm?H:W,d=t.updateEveryFrame||2;let h=0;const g=t.bounds,m={h:e,iwx:o[0],iwy:o[1],b:[g.min.x,g.min.y,g.max.x,g.max.y,g.max.x-g.min.x,g.max.y-g.min.y],e:t.engine,r:t.render,w:t.engine.world,c:f,irc:t.isRegionalComputing||false,l:s,lnlid:u,bb:t.bordersBounce||.5,ip:!1,g:t.gravityRatio||.2,sh:D(e,g),rbp:0,abp:0,p:[],s:{},fpids:[],lpl:{},dt:t.timeScale||1,ev:X(),st:{cl:s.map((()=>0))},u:()=>{h++%d==0&&p(m,m.e.timing.timeScale*m.dt)}};return i().Events.on(t.render,"afterRender",(()=>l(m))),n.setPause(m,!!t.isPaused),Object.seal(m)},drip:Y,dry:Z,setPause(t,n=!0){n?i().Events.off(t.e,"afterUpdate",t.u):i().Events.on(t.e,"afterUpdate",t.u),t.ip=n,t.ev.pauseChange(n)},setRenderBoundsPadding(t,n){t.rbp=n},setActiveBoundsPadding(t,n){t.abp=n},setGravityRatio(t,n=t.g){t.g=n},setTimeScale(t,n=t.dt){t.dt=n},getGravity:t=>[t.w.gravity.x*t.g,t.w.gravity.y*t.g],getParticlesCount:t=>t.p.length-t.fpids.length,getLiquidId:(t,n)=>"number"==typeof n?n:t.lnlid[n]},nt={name:r.u2,version:r.i8,for:"matter-js@0.17.1",install(t){t.Liquid=tt}};Matter.Plugin.register(nt)},538:n=>{n.exports=t}},e={};function r(t){var o=e[t];if(void 0!==o)return o.exports;var i=e[t]={exports:{}};return n[t](i,i.exports,r),i.exports}return r.n=t=>{var n=t&&t.__esModule?()=>t.default:()=>t;return r.d(n,{a:n}),n},r.d=(t,n)=>{for(var e in n)r.o(n,e)&&!r.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:n[e]})},r.o=(t,n)=>Object.prototype.hasOwnProperty.call(t,n),r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r(912)})()}));