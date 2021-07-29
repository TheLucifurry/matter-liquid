/*! For license information please see matter-liquid.js.LICENSE.txt */
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("matter-js")):"function"==typeof define&&define.amd?define(["matter-js"],n):"object"==typeof exports?exports.MatterLiquid=n(require("matter-js")):t.MatterLiquid=n(t.Matter)}(self,(function(t){return(()=>{var n={702:(t,n,r)=>{"use strict";r.r(n);const e=JSON.parse('{"u2":"matter-liquid","i8":"0.0.1"}');var o=r(538),i=r.n(o);const c=0,u=1,s=2,f=3,a=0,l=2,y=4;function d(t,n,[r,e,o,i]){return t>r&&t<o&&n>e&&n<i}function p(t,n,r){const e=r-n;return n+((t-n)%e+e)%e}function m(t,n){return t>n?t:n}function A(t,n,r){return t<n?n:t>r?r:t}function b(t){const n=t.length,[r,e,o,i,c,u,s,f,a]=t;return n<6?[`0x${e}`/15,`0x${o}`/15,`0x${i}`/15,5===n?`0x${c}`/15:1]:[`0x${e}${o}`/255,`0x${i}${c}`/255,`0x${u}${s}`/255,9===n?`0x${f}${a}`/255:1]}function v(t){return Math.hypot(t[0],t[1])}function h(t){const n=Math.hypot(t[0],t[1]);return 0!==n?[t[0]/n,t[1]/n]:[0,0]}function z(t,n){return[t[0]*n,t[1]*n]}function w(t,n){return[t[0]/n,t[1]/n]}function M(t,n){return[n[0]+t[0],n[1]+t[1]]}function _(t,n){return[n[0]-t[0],n[1]-t[1]]}function C(t,n){return[t[0]-n[0],t[1]-n[1]]}function T(t,n){let r=-1;const{length:e}=t;for(;++r<e;)n(t[r],r)}function g(t,n,r){T(n,(n=>r(t[n],n)))}function U(t,n){const r=t.t[n];return t.i.getNearby(r[c],r[u],t.t)}function S(t,n,r){return i().Vertices.contains(t.vertices,{x:n,y:r})}function F(t,n,r,e){const o=(n[0]-t[0])*(e[1]-r[1])-(e[0]-r[0])*(n[1]-t[1]);if(0===o)return!1;const i=((e[1]-r[1])*(e[0]-t[0])+(r[0]-e[0])*(e[1]-t[1]))/o,c=((t[1]-n[1])*(e[0]-t[0])+(n[0]-t[0])*(e[1]-t[1]))/o;return i>0&&i<1&&c<1}function x(t,n,r){const e=n;t[c]+=e[0],t[u]+=e[1]}function $(t,n){const[r,e]=function(t,n){const r=Math.hypot(t[0],t[1]);return z(w(t,r||1),A(r,-n,n))}([t[s],t[f]],n);t[s]=r,t[f]=e}function E(t,n,r){const e=[t.position.x,t.position.y];if(t.circleRadius){return M(e,z(h(_(e,r)),t.circleRadius))}var o,i;const c=function(t,n,r){const e=t.vertices;for(let t=0;t<e.length;t++){const o=e[t],i=e[t!==e.length-1?t+1:0],c=[o.x,o.y],u=[i.x,i.y];if(F(c,u,n,r))return[c,u]}return null}(t,(o=n,(i=r)[0]!==o[0]||i[1]!==o[1]?r:e),n),u=function(t,n){const r=h(_([t[0],t[1]],[n[0],n[1]]));return[r[1],-r[0]]}(c[0],c[1]);return function(t,n,r,e){const o=(t[0]-n[0])*(r[1]-e[1])-(t[1]-n[1])*(r[0]-e[0]);if(0===o)return null;const i=t[0]*n[1]-t[1]*n[0],c=r[0]*e[1]-r[1]*e[0];return[(i*(r[0]-e[0])-(t[0]-n[0])*c)/o,(i*(r[1]-e[1])-(t[1]-n[1])*c)/o]}(c[0],c[1],n,M(n,u))}function I(t,n,r,e){const{t:o}=t;(n?function(t,n){return i().Query.region(t,{min:{x:n[0],y:n[1]},max:{x:n[2],y:n[3]}})}(t.u.bodies,n):t.u.bodies).forEach((n=>{const e=function(t,n,r,e){const o=[],i=r.getFromBounds(n.bounds);for(let r=0;r<i.length;r++){const e=i[r],s=t[e];S(n,s[c],s[u])&&o.push(e)}return o}(o,n,t.i);g(o,e,(t=>{if(!d(t[c],t[u],r))return;const e=function(t,n){const r=[n.velocity.x,n.velocity.y],e=C([t[s],t[f]],r),o=h(e),i=C(e,o);return C(o,z(i,1))}(t,n),o=[t[c],t[u]];if(function(t,n){t[s]-=n[0],t[f]-=n[1]}(t,e),S(n,t[c],t[u])){const r=E(n,o,[t[c],t[u]]);t[c]=r[0],t[u]=r[1]}}))}))}function P(t,n,r,e){g(t.t,n,((n,o)=>{!function(t,n,r){t[s]=(t[c]-r[0])/n,t[f]=(t[u]-r[1])/n}(n,r,e[o]);const i=t.l,a=t.m;if(t.A)n[c]=p(n[c],a[0],a[2]);else{const t=n[c];n[c]=A(t,a[0],a[2]),t!==n[c]&&(n[s]*=-i,n[f]*=i)}if(t.v)n[u]=p(n[u],a[1],a[3]);else{const t=n[u];n[u]=A(t,a[1],a[3]),t!==n[u]&&(n[s]*=i,n[f]*=-i)}t.i.update(o,n[c],n[u])}));const o=t.M,i=t._;for(let n=0;n<o.C.length;n++){if(!o.T[n]||!o.g[n])continue;const r=o.C[n],e=[],c=[];t.U.forEach(((t,n)=>{e[n]=[],c[n]=[]}));const u=Object.keys(r);for(let t=0;t<u.length;t++){const n=+u[t],o=r[n];for(let t=0;t<o.length;t++){const r=o[t],u=i[r][a];e[u].push(n),c[u].push(r)}}const s=[e,c];o.S[n](s)}}function O(t,n){const r=[],e=Matter.Liquid.getGravity(t),o={},i=t.F?function(t,n=0){return[t.min.x-n,t.min.y-n,t.max.x+n,t.max.y+n]}(t.$.bounds,t.I):null,l=t.m,p=.75*t.P;t.M.C=t.U.map((()=>[])),function(t,n,r,e){T(r,((t,r)=>{null===t||n&&!d(t[c],t[u],n)||e(t,r)}))}(0,i,t.t,((i,a)=>{r.push(a),function(t,n,r,e){t[s]+=n*e*r[0],t[f]+=n*e*r[1]}(i,n,e,t._[a][y]),o[a]=[i[c],i[u]],$(i,p),function(t,n){t[c]+=n*t[s],t[u]+=n*t[f]}(i,n),t.i.update(a,i[c],i[u])})),g(t.t,r,((r,e)=>{!function(t,n,r,e){const o=t._[r][y],i=t._[r][a],s=.2*t.P,f=.3*t.P,l=(t.P,t.M),d=t._[r],p=l.T[i]&&l.g[i];p&&(l.C[i][r]=[]);let A=0,b=0;const M=U(t,r),C=Array(M.length);for(let e=0;e<M.length;e++){const o=M[e],s=(g=t.t[o],_([(T=n)[c],T[u]],[g[c],g[u]])),f=m(1-v(w(s,t.P)),.5);A+=f**2,b+=f**3,C[e]=[f,o,s],p&&t._[o]!==d&&l.C[i][r].push(o)}var T,g;const S=.3*(A-s)*o,F=f*b,$=[0,0];for(let n=0;n<C.length;n++){const[r,o,i]=C[n],c=t.t[o],u=w(z(h(i),e**2*(S*r+F*r**2)),2);$[0]-=u[0],$[1]-=u[1],x(c,u),t.i.update(o,c[0],c[1])}x(n,$),t.i.update(r,n[0],n[1])}(t,r,e,n)})),I(t,i,l),P(t,r,n,o)}function B(t,n){if(OffscreenCanvas)return new OffscreenCanvas(t,n);const r=document.createElement("canvas");return r.height=n,r.width=t,r}let j=Float32Array;function R(t,n,r){const e=new j(3);return t&&(e[0]=t),n&&(e[1]=n),r&&(e[2]=r),e}function k(t,n,r){return(r=r||new j(3))[0]=t[0]+n[0],r[1]=t[1]+n[1],r[2]=t[2]+n[2],r}function N(t,n,r){return(r=r||new j(3))[0]=t[0]*n[0],r[1]=t[1]*n[1],r[2]=t[2]*n[2],r}let G=Float32Array;function W(t){return(t=t||new G(16))[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function L(t,n){n=n||new G(16);const r=t[0],e=t[1],o=t[2],i=t[3],c=t[4],u=t[5],s=t[6],f=t[7],a=t[8],l=t[9],y=t[10],d=t[11],p=t[12],m=t[13],A=t[14],b=t[15],v=y*b,h=A*d,z=s*b,w=A*f,M=s*d,_=y*f,C=o*b,T=A*i,g=o*d,U=y*i,S=o*f,F=s*i,x=a*m,$=p*l,E=c*m,I=p*u,P=c*l,O=a*u,B=r*m,j=p*e,R=r*l,k=a*e,N=r*u,W=c*e,L=v*u+w*l+M*m-(h*u+z*l+_*m),D=h*e+C*l+U*m-(v*e+T*l+g*m),H=z*e+T*u+S*m-(w*e+C*u+F*m),V=_*e+g*u+F*l-(M*e+U*u+S*l),q=1/(r*L+c*D+a*H+p*V);return n[0]=q*L,n[1]=q*D,n[2]=q*H,n[3]=q*V,n[4]=q*(h*c+z*a+_*p-(v*c+w*a+M*p)),n[5]=q*(v*r+T*a+g*p-(h*r+C*a+U*p)),n[6]=q*(w*r+C*c+F*p-(z*r+T*c+S*p)),n[7]=q*(M*r+U*c+S*a-(_*r+g*c+F*a)),n[8]=q*(x*f+I*d+P*b-($*f+E*d+O*b)),n[9]=q*($*i+B*d+k*b-(x*i+j*d+R*b)),n[10]=q*(E*i+j*f+N*b-(I*i+B*f+W*b)),n[11]=q*(O*i+R*f+W*d-(P*i+k*f+N*d)),n[12]=q*(E*y+O*A+$*s-(P*A+x*s+I*y)),n[13]=q*(R*A+x*o+j*y-(B*y+k*A+$*o)),n[14]=q*(B*s+W*A+I*o-(N*A+E*o+j*s)),n[15]=q*(N*y+P*o+k*s-(R*s+W*y+O*o)),n}function D(t,n,r){r=r||R();const e=n[0],o=n[1],i=n[2],c=e*t[3]+o*t[7]+i*t[11]+t[15];return r[0]=(e*t[0]+o*t[4]+i*t[8]+t[12])/c,r[1]=(e*t[1]+o*t[5]+i*t[9]+t[13])/c,r[2]=(e*t[2]+o*t[6]+i*t[10]+t[14])/c,r}function H(t,n,r){r=r||R();const e=n[0],o=n[1],i=n[2];return r[0]=e*t[0]+o*t[4]+i*t[8],r[1]=e*t[1]+o*t[5]+i*t[9],r[2]=e*t[2]+o*t[6]+i*t[10],r}const V=5120,q=5121,X=5122,Y=5123,J=5124,K=5125,Z=5126,Q={};{const t=Q;t[V]=Int8Array,t[5121]=Uint8Array,t[5122]=Int16Array,t[5123]=Uint16Array,t[J]=Int32Array,t[5125]=Uint32Array,t[5126]=Float32Array,t[32819]=Uint16Array,t[32820]=Uint16Array,t[33635]=Uint16Array,t[5131]=Uint16Array,t[33640]=Uint32Array,t[35899]=Uint32Array,t[35902]=Uint32Array,t[36269]=Uint32Array,t[34042]=Uint32Array}function tt(t){if(t instanceof Int8Array)return V;if(t instanceof Uint8Array)return q;if(t instanceof Uint8ClampedArray)return q;if(t instanceof Int16Array)return X;if(t instanceof Uint16Array)return Y;if(t instanceof Int32Array)return J;if(t instanceof Uint32Array)return K;if(t instanceof Float32Array)return Z;throw new Error("unsupported typed array type")}function nt(t){if(t===Int8Array)return V;if(t===Uint8Array)return q;if(t===Uint8ClampedArray)return q;if(t===Int16Array)return X;if(t===Uint16Array)return Y;if(t===Int32Array)return J;if(t===Uint32Array)return K;if(t===Float32Array)return Z;throw new Error("unsupported typed array type")}const rt="undefined"!=typeof SharedArrayBuffer?function(t){return t&&t.buffer&&(t.buffer instanceof ArrayBuffer||t.buffer instanceof SharedArrayBuffer)}:function(t){return t&&t.buffer&&t.buffer instanceof ArrayBuffer};function et(...t){console.error(...t)}function ot(t,n){return"undefined"!=typeof WebGLTexture&&n instanceof WebGLTexture}const it=34962,ct={attribPrefix:""};function ut(t,n,r,e,o){t.bindBuffer(n,r),t.bufferData(n,e,o||35044)}function st(t,n,r,e){if(o=n,"undefined"!=typeof WebGLBuffer&&o instanceof WebGLBuffer)return n;var o;r=r||it;const i=t.createBuffer();return ut(t,r,i,n,e),i}function ft(t){return"indices"===t}function at(t){return t.length?t:t.data}const lt=/coord|texture/i,yt=/color|colour/i;function dt(t,n){let r;if(r=lt.test(t)?2:yt.test(t)?4:3,n%r>0)throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${r} but ${n} values is not evenly divisible by ${r}. You should specify it.`);return r}function pt(t,n){return t.numComponents||t.size||dt(n,at(t).length)}function mt(t,n){if(rt(t))return t;if(rt(t.data))return t.data;Array.isArray(t)&&(t={data:t});let r=t.type;return r||(r=ft(n)?Uint16Array:Float32Array),new r(t.data)}function At(t,n){const r={};return Object.keys(n).forEach((function(e){if(!ft(e)){const i=n[e],c=i.attrib||i.name||i.attribName||ct.attribPrefix+e;if(i.value){if(!Array.isArray(i.value)&&!rt(i.value))throw new Error("array.value is not array or typedarray");r[c]={value:i.value}}else{let n,u,s,f;if(i.buffer&&i.buffer instanceof WebGLBuffer)n=i.buffer,f=i.numComponents||i.size,u=i.type,s=i.normalize;else if("number"==typeof i||"number"==typeof i.data){const r=i.data||i,c=i.type||Float32Array,a=r*c.BYTES_PER_ELEMENT;u=nt(c),s=void 0!==i.normalize?i.normalize:(o=c)===Int8Array||o===Uint8Array,f=i.numComponents||i.size||dt(e,r),n=t.createBuffer(),t.bindBuffer(it,n),t.bufferData(it,a,i.drawType||35044)}else{const r=mt(i,e);n=st(t,r,void 0,i.drawType),u=tt(r),s=void 0!==i.normalize?i.normalize:function(t){return t instanceof Int8Array||t instanceof Uint8Array}(r),f=pt(i,e)}r[c]={buffer:n,numComponents:f,type:u,normalize:s,stride:i.stride||0,offset:i.offset||0,divisor:void 0===i.divisor?void 0:i.divisor,drawType:i.drawType}}}var o})),t.bindBuffer(it,null),r}function bt(t,n,r,e){r=mt(r),void 0!==e?(t.bindBuffer(it,n.buffer),t.bufferSubData(it,e,r)):ut(t,it,n.buffer,r,n.drawType)}const vt=["position","positions","a_position"];function ht(t,n,r){const e=At(t,n),o=Object.assign({},r||{});o.attribs=Object.assign({},r?r.attribs:{},e);const i=n.indices;if(i){const n=mt(i,"indices");o.indices=st(t,n,34963),o.numElements=n.length,o.elementType=tt(n)}else o.numElements||(o.numElements=function(t,n){let r,e;for(e=0;e<vt.length&&(r=vt[e],!(r in n))&&(r=ct.attribPrefix+r,!(r in n));++e);e===vt.length&&(r=Object.keys(n)[0]);const o=n[r];t.bindBuffer(it,o.buffer);const i=t.getBufferParameter(it,34660);var c;t.bindBuffer(it,null);const u=i/(5120===(c=o.type)||5121===c?1:5122===c||5123===c?2:5124===c||5125===c||5126===c?4:0),s=o.numComponents||o.size,f=u/s;if(f%1!=0)throw new Error(`numComponents ${s} not correct for length ${length}`);return f}(t,o.attribs));return o}function zt(t,n,r){const e="indices"===r?34963:it;return st(t,mt(n,r),e)}function wt(t,n){const r={};return Object.keys(n).forEach((function(e){r[e]=zt(t,n[e],e)})),n.indices?(r.numElements=n.indices.length,r.elementType=tt(mt(n.indices))):r.numElements=function(t){let n,r;for(r=0;r<vt.length&&(n=vt[r],!(n in t));++r);r===vt.length&&(n=Object.keys(t)[0]);const e=t[n],o=at(e).length,i=pt(e,n),c=o/i;if(o%i>0)throw new Error(`numComponents ${i} not correct for length ${o}`);return c}(n),r}function Mt(t,n){let r=0;return t.push=function(){for(let n=0;n<arguments.length;++n){const e=arguments[n];if(e instanceof Array||rt(e))for(let n=0;n<e.length;++n)t[r++]=e[n];else t[r++]=e}},t.reset=function(t){r=t||0},t.numComponents=n,Object.defineProperty(t,"numElements",{get:function(){return this.length/this.numComponents|0}}),t}function _t(t,n,r){return Mt(new(r||Float32Array)(t*n),t)}function Ct(t,n,r){const e=t.length,o=new Float32Array(3);for(let i=0;i<e;i+=3)r(n,[t[i],t[i+1],t[i+2]],o),t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2]}function Tt(t,n,r){r=r||R();const e=n[0],o=n[1],i=n[2];return r[0]=e*t[0]+o*t[1]+i*t[2],r[1]=e*t[4]+o*t[5]+i*t[6],r[2]=e*t[8]+o*t[9]+i*t[10],r}function gt(t,n){return Ct(t,n,H),t}function Ut(t,n){return Ct(t,L(n),Tt),t}function St(t,n){return Ct(t,n,D),t}function Ft(t,n){return Object.keys(t).forEach((function(r){const e=t[r];r.indexOf("pos")>=0?St(e,n):r.indexOf("tan")>=0||r.indexOf("binorm")>=0?gt(e,n):r.indexOf("norm")>=0&&Ut(e,n)})),t}function xt(t,n,r){return t=t||2,{position:{numComponents:2,data:[(n=n||0)+-1*(t*=.5),(r=r||0)+-1*t,n+1*t,r+-1*t,n+-1*t,r+1*t,n+1*t,r+1*t]},normal:[0,0,1,0,0,1,0,0,1,0,0,1],texcoord:[0,0,1,0,0,1,1,1],indices:[0,1,2,2,1,3]}}function $t(t,n,r,e,o){t=t||1,n=n||1,r=r||1,e=e||1,o=o||W();const i=(r+1)*(e+1),c=_t(3,i),u=_t(3,i),s=_t(2,i);for(let o=0;o<=e;o++)for(let i=0;i<=r;i++){const f=i/r,a=o/e;c.push(t*f-.5*t,0,n*a-.5*n),u.push(0,1,0),s.push(f,a)}const f=r+1,a=_t(3,r*e*2,Uint16Array);for(let t=0;t<e;t++)for(let n=0;n<r;n++)a.push((t+0)*f+n,(t+1)*f+n,(t+0)*f+n+1),a.push((t+1)*f+n,(t+1)*f+n+1,(t+0)*f+n+1);return Ft({position:c,normal:u,texcoord:s,indices:a},o)}function Et(t,n,r,e,o,i,c){if(n<=0||r<=0)throw new Error("subdivisionAxis and subdivisionHeight must be > 0");e=e||0,i=i||0;const u=(o=o||Math.PI)-e,s=(c=c||2*Math.PI)-i,f=(n+1)*(r+1),a=_t(3,f),l=_t(3,f),y=_t(2,f);for(let o=0;o<=r;o++)for(let c=0;c<=n;c++){const f=c/n,d=o/r,p=s*f+i,m=u*d+e,A=Math.sin(p),b=Math.cos(p),v=Math.sin(m),h=b*v,z=Math.cos(m),w=A*v;a.push(t*h,t*z,t*w),l.push(h,z,w),y.push(1-f,d)}const d=n+1,p=_t(3,n*r*2,Uint16Array);for(let t=0;t<n;t++)for(let n=0;n<r;n++)p.push((n+0)*d+t,(n+0)*d+t+1,(n+1)*d+t),p.push((n+1)*d+t,(n+0)*d+t+1,(n+1)*d+t+1);return{position:a,normal:l,texcoord:y,indices:p}}const It=[[3,7,5,1],[6,2,0,4],[6,7,3,2],[0,1,5,4],[7,6,4,5],[2,3,1,0]];function Pt(t){const n=(t=t||1)/2,r=[[-n,-n,-n],[+n,-n,-n],[-n,+n,-n],[+n,+n,-n],[-n,-n,+n],[+n,-n,+n],[-n,+n,+n],[+n,+n,+n]],e=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],o=[[1,0],[0,0],[0,1],[1,1]],i=_t(3,24),c=_t(3,24),u=_t(2,24),s=_t(3,12,Uint16Array);for(let t=0;t<6;++t){const n=It[t];for(let s=0;s<4;++s){const f=r[n[s]],a=e[t],l=o[s];i.push(f),c.push(a),u.push(l)}const f=4*t;s.push(f+0,f+1,f+2),s.push(f+0,f+2,f+3)}return{position:i,normal:c,texcoord:u,indices:s}}function Ot(t,n,r,e,o,i,c){if(e<3)throw new Error("radialSubdivisions must be 3 or greater");if(o<1)throw new Error("verticalSubdivisions must be 1 or greater");const u=void 0===i||i,s=void 0===c||c,f=(u?2:0)+(s?2:0),a=(e+1)*(o+1+f),l=_t(3,a),y=_t(3,a),d=_t(2,a),p=_t(3,e*(o+f/2)*2,Uint16Array),m=e+1,A=Math.atan2(t-n,r),b=Math.cos(A),v=Math.sin(A),h=o+(s?2:0);for(let i=u?-2:0;i<=h;++i){let c,u=i/o,s=r*u;i<0?(s=0,u=1,c=t):i>o?(s=r,u=1,c=n):c=t+i/o*(n-t),-2!==i&&i!==o+2||(c=0,u=0),s-=r/2;for(let t=0;t<m;++t){const n=Math.sin(t*Math.PI*2/e),r=Math.cos(t*Math.PI*2/e);l.push(n*c,s,r*c),i<0?y.push(0,-1,0):i>o?y.push(0,1,0):0===c?y.push(0,0,0):y.push(n*b,v,r*b),d.push(t/e,1-u)}}for(let t=0;t<o+f;++t)if(!(1===t&&u||t===o+f-2&&s))for(let n=0;n<e;++n)p.push(m*(t+0)+0+n,m*(t+0)+1+n,m*(t+1)+1+n),p.push(m*(t+0)+0+n,m*(t+1)+1+n,m*(t+1)+0+n);return{position:l,normal:y,texcoord:d,indices:p}}function Bt(t,n){n=n||[];const r=[];for(let e=0;e<t.length;e+=4){const o=t[e],i=t.slice(e+1,e+4);i.push.apply(i,n);for(let t=0;t<o;++t)r.push.apply(r,i)}return r}function jt(){const t=[0,0,0,0,150,0,30,0,0,0,150,0,30,150,0,30,0,0,30,0,0,30,30,0,100,0,0,30,30,0,100,30,0,100,0,0,30,60,0,30,90,0,67,60,0,30,90,0,67,90,0,67,60,0,0,0,30,30,0,30,0,150,30,0,150,30,30,0,30,30,150,30,30,0,30,100,0,30,30,30,30,30,30,30,100,0,30,100,30,30,30,60,30,67,60,30,30,90,30,30,90,30,67,60,30,67,90,30,0,0,0,100,0,0,100,0,30,0,0,0,100,0,30,0,0,30,100,0,0,100,30,0,100,30,30,100,0,0,100,30,30,100,0,30,30,30,0,30,30,30,100,30,30,30,30,0,100,30,30,100,30,0,30,30,0,30,60,30,30,30,30,30,30,0,30,60,0,30,60,30,30,60,0,67,60,30,30,60,30,30,60,0,67,60,0,67,60,30,67,60,0,67,90,30,67,60,30,67,60,0,67,90,0,67,90,30,30,90,0,30,90,30,67,90,30,30,90,0,67,90,30,67,90,0,30,90,0,30,150,30,30,90,30,30,90,0,30,150,0,30,150,30,0,150,0,0,150,30,30,150,30,0,150,0,30,150,30,30,150,0,0,0,0,0,0,30,0,150,30,0,0,0,0,150,30,0,150,0],n=Bt([18,0,0,1,18,0,0,-1,6,0,1,0,6,1,0,0,6,0,-1,0,6,1,0,0,6,0,1,0,6,1,0,0,6,0,-1,0,6,1,0,0,6,0,-1,0,6,-1,0,0]),r=Bt([18,200,70,120,18,80,70,200,6,70,200,210,6,200,200,70,6,210,100,70,6,210,160,70,6,70,180,210,6,100,70,210,6,76,210,100,6,140,210,80,6,90,130,110,6,160,160,220],[255]),e=t.length/3,o={position:_t(3,e),texcoord:_t(2,e),normal:_t(3,e),color:_t(4,e,Uint8Array),indices:_t(3,e/3,Uint16Array)};o.position.push(t),o.texcoord.push([.22,.19,.22,.79,.34,.19,.22,.79,.34,.79,.34,.19,.34,.19,.34,.31,.62,.19,.34,.31,.62,.31,.62,.19,.34,.43,.34,.55,.49,.43,.34,.55,.49,.55,.49,.43,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0]),o.normal.push(n),o.color.push(r);for(let t=0;t<e;++t)o.indices.push(t);return o}function Rt(t,n,r,e,o,i,c){if(o<=0)throw new Error("subdivisionDown must be > 0");const u=(c=c||1)-(i=i||0),s=2*(o+1)*4,f=_t(3,s),a=_t(3,s),l=_t(2,s);function y(t,n,r){return t+(n-t)*r}function d(n,r,c,s,d,p){for(let m=0;m<=o;m++){const A=r/1,b=m/o,v=2*(A-.5),h=(i+b*u)*Math.PI,z=Math.sin(h),w=Math.cos(h),M=y(t,n,z),_=v*e,C=w*t,T=z*M;f.push(_,C,T);const g=k(N([0,z,w],c),s);a.push(g),l.push(A*d+p,b)}}for(let t=0;t<2;t++){const e=2*(t/1-.5);d(n,t,[1,1,1],[0,0,0],1,0),d(n,t,[0,0,0],[e,0,0],0,0),d(r,t,[1,1,1],[0,0,0],1,0),d(r,t,[0,0,0],[e,0,0],0,1)}const p=_t(3,2*o*4,Uint16Array);function m(t,n){for(let r=0;r<o;++r)p.push(t+r+0,t+r+1,n+r+0),p.push(t+r+1,n+r+1,n+r+0)}const A=o+1;return m(0*A,4*A),m(5*A,7*A),m(6*A,2*A),m(3*A,1*A),{position:f,normal:a,texcoord:l,indices:p}}function kt(t,n,r,e,o,i){return Ot(t,t,n,r,e,o,i)}function Nt(t,n,r,e,o,i){if(r<3)throw new Error("radialSubdivisions must be 3 or greater");if(e<3)throw new Error("verticalSubdivisions must be 3 or greater");o=o||0;const c=(i=i||2*Math.PI)-o,u=r+1,s=e+1,f=u*s,a=_t(3,f),l=_t(3,f),y=_t(2,f),d=_t(3,r*e*2,Uint16Array);for(let i=0;i<s;++i){const s=i/e,f=s*Math.PI*2,d=Math.sin(f),p=t+d*n,m=Math.cos(f),A=m*n;for(let t=0;t<u;++t){const n=t/r,e=o+n*c,i=Math.sin(e),u=Math.cos(e),f=i*p,b=u*p,v=i*d,h=u*d;a.push(f,A,b),l.push(v,m,h),y.push(n,1-s)}}for(let t=0;t<e;++t)for(let n=0;n<r;++n){const r=1+n,e=1+t;d.push(u*t+n,u*e+n,u*t+r),d.push(u*e+n,u*e+r,u*t+r)}return{position:a,normal:l,texcoord:y,indices:d}}function Gt(t,n,r,e,o){if(n<3)throw new Error("divisions must be at least 3");o=o||1,e=e||0;const i=(n+1)*((r=r||1)+1),c=_t(3,i),u=_t(3,i),s=_t(2,i),f=_t(3,r*n*2,Uint16Array);let a=0;const l=t-e,y=n+1;for(let t=0;t<=r;++t){const i=e+l*Math.pow(t/r,o);for(let e=0;e<=n;++e){const o=2*Math.PI*e/n,l=i*Math.cos(o),d=i*Math.sin(o);if(c.push(l,0,d),u.push(0,1,0),s.push(1-e/n,t/r),t>0&&e!==n){const t=a+(e+1),n=a+e,r=a+e-y,o=a+(e+1)-y;f.push(t,n,r),f.push(t,r,o)}}a+=n+1}return{position:c,normal:u,texcoord:s,indices:f}}function Wt(t){return function(n){const r=t.apply(this,Array.prototype.slice.call(arguments,1));return wt(n,r)}}function Lt(t){return function(n){const r=t.apply(null,Array.prototype.slice.call(arguments,1));return ht(n,r)}}Lt(jt),Wt(jt),Lt(Pt),Wt(Pt),Lt($t),Wt($t),Lt(Et),Wt(Et),Lt(Ot),Wt(Ot),Lt(xt),Wt(xt),Lt(Rt),Wt(Rt),Lt(kt),Wt(kt),Lt(Nt),Wt(Nt),Lt(Gt),Wt(Gt);function Dt(t){return!!t.texStorage2D}const Ht=function(){const t={},n={};return function(r,e){return function(r){const e=r.constructor.name;if(!t[e]){for(const t in r)if("number"==typeof r[t]){const e=n[r[t]];n[r[t]]=e?`${e} | ${t}`:t}t[e]=!0}}(r),n[e]||("number"==typeof e?`0x${e.toString(16)}`:e)}}();new Uint8Array([128,192,255,255]),function(){let t}();const Vt=6407,qt=6408,Xt=33319,Yt=6403,Jt={};{const t=Jt;t[6406]={numColorComponents:1},t[6409]={numColorComponents:1},t[6410]={numColorComponents:2},t[Vt]={numColorComponents:3},t[qt]={numColorComponents:4},t[Yt]={numColorComponents:1},t[36244]={numColorComponents:1},t[Xt]={numColorComponents:2},t[33320]={numColorComponents:2},t[Vt]={numColorComponents:3},t[36248]={numColorComponents:3},t[qt]={numColorComponents:4},t[36249]={numColorComponents:4},t[6402]={numColorComponents:1},t[34041]={numColorComponents:2}}const Kt=et;function Zt(t){return"undefined"!=typeof document&&document.getElementById?document.getElementById(t):null}const Qt=33984,tn=34962,nn=5126,rn=5124,en=5125,on=3553,cn=34067,un=32879,sn=35866,fn={};function an(t,n){return fn[n].bindPoint}function ln(t,n){return function(r){t.uniform1i(n,r)}}function yn(t,n){return function(r){t.uniform1iv(n,r)}}function dn(t,n){return function(r){t.uniform2iv(n,r)}}function pn(t,n){return function(r){t.uniform3iv(n,r)}}function mn(t,n){return function(r){t.uniform4iv(n,r)}}function An(t,n,r,e){const o=an(0,n);return Dt(t)?function(n){let i,c;ot(0,n)?(i=n,c=null):(i=n.texture,c=n.sampler),t.uniform1i(e,r),t.activeTexture(Qt+r),t.bindTexture(o,i),t.bindSampler(r,c)}:function(n){t.uniform1i(e,r),t.activeTexture(Qt+r),t.bindTexture(o,n)}}function bn(t,n,r,e,o){const i=an(0,n),c=new Int32Array(o);for(let t=0;t<o;++t)c[t]=r+t;return Dt(t)?function(n){t.uniform1iv(e,c),n.forEach((function(n,e){let o,u;t.activeTexture(Qt+c[e]),ot(0,n)?(o=n,u=null):(o=n.texture,u=n.sampler),t.bindSampler(r,u),t.bindTexture(i,o)}))}:function(n){t.uniform1iv(e,c),n.forEach((function(n,r){t.activeTexture(Qt+c[r]),t.bindTexture(i,n)}))}}function vn(t,n){return function(r){if(r.value)switch(t.disableVertexAttribArray(n),r.value.length){case 4:t.vertexAttrib4fv(n,r.value);break;case 3:t.vertexAttrib3fv(n,r.value);break;case 2:t.vertexAttrib2fv(n,r.value);break;case 1:t.vertexAttrib1fv(n,r.value);break;default:throw new Error("the length of a float constant value must be between 1 and 4!")}else t.bindBuffer(tn,r.buffer),t.enableVertexAttribArray(n),t.vertexAttribPointer(n,r.numComponents||r.size,r.type||nn,r.normalize||!1,r.stride||0,r.offset||0),void 0!==r.divisor&&t.vertexAttribDivisor(n,r.divisor)}}function hn(t,n){return function(r){if(r.value){if(t.disableVertexAttribArray(n),4!==r.value.length)throw new Error("The length of an integer constant value must be 4!");t.vertexAttrib4iv(n,r.value)}else t.bindBuffer(tn,r.buffer),t.enableVertexAttribArray(n),t.vertexAttribIPointer(n,r.numComponents||r.size,r.type||rn,r.stride||0,r.offset||0),void 0!==r.divisor&&t.vertexAttribDivisor(n,r.divisor)}}function zn(t,n){return function(r){if(r.value){if(t.disableVertexAttribArray(n),4!==r.value.length)throw new Error("The length of an unsigned integer constant value must be 4!");t.vertexAttrib4uiv(n,r.value)}else t.bindBuffer(tn,r.buffer),t.enableVertexAttribArray(n),t.vertexAttribIPointer(n,r.numComponents||r.size,r.type||en,r.stride||0,r.offset||0),void 0!==r.divisor&&t.vertexAttribDivisor(n,r.divisor)}}function wn(t,n,r){const e=r.size,o=r.count;return function(r){t.bindBuffer(tn,r.buffer);const i=r.size||r.numComponents||e,c=i/o,u=r.type||nn,s=fn[u].size*i,f=r.normalize||!1,a=r.offset||0,l=s/o;for(let e=0;e<o;++e)t.enableVertexAttribArray(n+e),t.vertexAttribPointer(n+e,c,u,f,s,a+l*e),void 0!==r.divisor&&t.vertexAttribDivisor(n+e,r.divisor)}}fn[5126]={Type:Float32Array,size:4,setter:function(t,n){return function(r){t.uniform1f(n,r)}},arraySetter:function(t,n){return function(r){t.uniform1fv(n,r)}}},fn[35664]={Type:Float32Array,size:8,setter:function(t,n){return function(r){t.uniform2fv(n,r)}}},fn[35665]={Type:Float32Array,size:12,setter:function(t,n){return function(r){t.uniform3fv(n,r)}}},fn[35666]={Type:Float32Array,size:16,setter:function(t,n){return function(r){t.uniform4fv(n,r)}}},fn[5124]={Type:Int32Array,size:4,setter:ln,arraySetter:yn},fn[35667]={Type:Int32Array,size:8,setter:dn},fn[35668]={Type:Int32Array,size:12,setter:pn},fn[35669]={Type:Int32Array,size:16,setter:mn},fn[5125]={Type:Uint32Array,size:4,setter:function(t,n){return function(r){t.uniform1ui(n,r)}},arraySetter:function(t,n){return function(r){t.uniform1uiv(n,r)}}},fn[36294]={Type:Uint32Array,size:8,setter:function(t,n){return function(r){t.uniform2uiv(n,r)}}},fn[36295]={Type:Uint32Array,size:12,setter:function(t,n){return function(r){t.uniform3uiv(n,r)}}},fn[36296]={Type:Uint32Array,size:16,setter:function(t,n){return function(r){t.uniform4uiv(n,r)}}},fn[35670]={Type:Uint32Array,size:4,setter:ln,arraySetter:yn},fn[35671]={Type:Uint32Array,size:8,setter:dn},fn[35672]={Type:Uint32Array,size:12,setter:pn},fn[35673]={Type:Uint32Array,size:16,setter:mn},fn[35674]={Type:Float32Array,size:16,setter:function(t,n){return function(r){t.uniformMatrix2fv(n,!1,r)}}},fn[35675]={Type:Float32Array,size:36,setter:function(t,n){return function(r){t.uniformMatrix3fv(n,!1,r)}}},fn[35676]={Type:Float32Array,size:64,setter:function(t,n){return function(r){t.uniformMatrix4fv(n,!1,r)}}},fn[35685]={Type:Float32Array,size:24,setter:function(t,n){return function(r){t.uniformMatrix2x3fv(n,!1,r)}}},fn[35686]={Type:Float32Array,size:32,setter:function(t,n){return function(r){t.uniformMatrix2x4fv(n,!1,r)}}},fn[35687]={Type:Float32Array,size:24,setter:function(t,n){return function(r){t.uniformMatrix3x2fv(n,!1,r)}}},fn[35688]={Type:Float32Array,size:48,setter:function(t,n){return function(r){t.uniformMatrix3x4fv(n,!1,r)}}},fn[35689]={Type:Float32Array,size:32,setter:function(t,n){return function(r){t.uniformMatrix4x2fv(n,!1,r)}}},fn[35690]={Type:Float32Array,size:48,setter:function(t,n){return function(r){t.uniformMatrix4x3fv(n,!1,r)}}},fn[35678]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:on},fn[35680]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:cn},fn[35679]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:un},fn[35682]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:on},fn[36289]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:sn},fn[36292]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:sn},fn[36293]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:cn},fn[36298]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:on},fn[36299]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:un},fn[36300]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:cn},fn[36303]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:sn},fn[36306]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:on},fn[36307]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:un},fn[36308]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:cn},fn[36311]={Type:null,size:0,setter:An,arraySetter:bn,bindPoint:sn};const Mn={};Mn[5126]={size:4,setter:vn},Mn[35664]={size:8,setter:vn},Mn[35665]={size:12,setter:vn},Mn[35666]={size:16,setter:vn},Mn[5124]={size:4,setter:hn},Mn[35667]={size:8,setter:hn},Mn[35668]={size:12,setter:hn},Mn[35669]={size:16,setter:hn},Mn[5125]={size:4,setter:zn},Mn[36294]={size:8,setter:zn},Mn[36295]={size:12,setter:zn},Mn[36296]={size:16,setter:zn},Mn[35670]={size:4,setter:hn},Mn[35671]={size:8,setter:hn},Mn[35672]={size:12,setter:hn},Mn[35673]={size:16,setter:hn},Mn[35674]={size:4,setter:wn,count:2},Mn[35675]={size:9,setter:wn,count:3},Mn[35676]={size:16,setter:wn,count:4};const _n=/ERROR:\s*\d+:(\d+)/gi;function Cn(t,n="",r=0){const e=[...n.matchAll(_n)],o=new Map(e.map(((t,r)=>{const o=parseInt(t[1]),i=e[r+1],c=i?i.index:n.length;return[o-1,n.substring(t.index,c)]})));return t.split("\n").map(((t,n)=>{const e=o.get(n);return`${n+1+r}: ${t}${e?`\n\n^^^ ${e}`:""}`})).join("\n")}const Tn=/^[ \t]*\n/;function gn(t,n,r,e){const o=e||Kt,i=t.createShader(r);let c=0;Tn.test(n)&&(c=1,n=n.replace(Tn,"")),t.shaderSource(i,n),t.compileShader(i);if(!t.getShaderParameter(i,35713)){const e=t.getShaderInfoLog(i);return o(`${Cn(n,e,c)}\nError compiling ${Ht(t,r)}: ${e}`),t.deleteShader(i),null}return i}function Un(t,n,r){let e,o;if("function"==typeof n&&(r=n,n=void 0),"function"==typeof t)r=t,t=void 0;else if(t&&!Array.isArray(t)){if(t.errorCallback)return t;const n=t;r=n.errorCallback,t=n.attribLocations,e=n.transformFeedbackVaryings,o=n.transformFeedbackMode}const i={errorCallback:r||Kt,transformFeedbackVaryings:e,transformFeedbackMode:o};if(t){let r={};Array.isArray(t)?t.forEach((function(t,e){r[t]=n?n[e]:e})):r=t,i.attribLocations=r}return i}const Sn=["VERTEX_SHADER","FRAGMENT_SHADER"];function Fn(t,n){return n.indexOf("frag")>=0?35632:n.indexOf("vert")>=0?35633:void 0}function xn(t,n){n.forEach((function(n){t.deleteShader(n)}))}function $n(t,n,r,e,o){const i=Un(r,e,o),c=[],u=[];for(let r=0;r<n.length;++r){let e=n[r];if("string"==typeof e){const n=Zt(e),o=n?n.text:e;let c=t[Sn[r]];n&&n.type&&(c=Fn(0,n.type)||c),e=gn(t,o,c,i.errorCallback),u.push(e)}s=e,"undefined"!=typeof WebGLShader&&s instanceof WebGLShader&&c.push(e)}var s;if(c.length!==n.length)return i.errorCallback("not enough shaders for program"),xn(t,u),null;const f=t.createProgram();c.forEach((function(n){t.attachShader(f,n)})),i.attribLocations&&Object.keys(i.attribLocations).forEach((function(n){t.bindAttribLocation(f,i.attribLocations[n],n)}));let a=i.transformFeedbackVaryings;a&&(a.attribs&&(a=a.attribs),Array.isArray(a)||(a=Object.keys(a)),t.transformFeedbackVaryings(f,a,i.transformFeedbackMode||35981)),t.linkProgram(f);if(!t.getProgramParameter(f,35714)){const n=t.getProgramInfoLog(f);return i.errorCallback(`${c.map((n=>{const r=Cn(t.getShaderSource(n),"",0),e=t.getShaderParameter(n,t.SHADER_TYPE);return`${Ht(t,e)}\n${r}}`})).join("\n")}\nError in program linking: ${n}`),t.deleteProgram(f),xn(t,u),null}return f}function En(t,n,r,e,o){const i=Un(r,e,o),c=[];for(let r=0;r<n.length;++r){const e=gn(t,n[r],t[Sn[r]],i.errorCallback);if(!e)return null;c.push(e)}return $n(t,c,i)}function In(t){const n=t.name;return n.startsWith("gl_")||n.startsWith("webgl_")}function Pn(t,n){let r=0;function e(n,e,o){const i=e.name.endsWith("[0]"),c=e.type,u=fn[c];if(!u)throw new Error(`unknown type: 0x${c.toString(16)}`);let s;if(u.bindPoint){const n=r;r+=e.size,s=i?u.arraySetter(t,c,n,o,e.size):u.setter(t,c,n,o,e.size)}else s=u.arraySetter&&i?u.arraySetter(t,o):u.setter(t,o);return s.location=o,s}const o={},i=t.getProgramParameter(n,35718);for(let r=0;r<i;++r){const i=t.getActiveUniform(n,r);if(In(i))continue;let c=i.name;c.endsWith("[0]")&&(c=c.substr(0,c.length-3));const u=t.getUniformLocation(n,i.name);u&&(o[c]=e(0,i,u))}return o}function On(t,n){const r={},e=t.getProgramParameter(n,35971);for(let o=0;o<e;++o){const e=t.getTransformFeedbackVarying(n,o);r[e.name]={index:o,type:e.type,size:e.size}}return r}function Bn(t,n){const r=t.getProgramParameter(n,35718),e=[],o=[];for(let i=0;i<r;++i){o.push(i),e.push({});const r=t.getActiveUniform(n,i);if(In(r))break;e[i].name=r.name}[["UNIFORM_TYPE","type"],["UNIFORM_SIZE","size"],["UNIFORM_BLOCK_INDEX","blockNdx"],["UNIFORM_OFFSET","offset"]].forEach((function(r){const i=r[0],c=r[1];t.getActiveUniforms(n,o,t[i]).forEach((function(t,n){e[n][c]=t}))}));const i={},c=t.getProgramParameter(n,35382);for(let r=0;r<c;++r){const e=t.getActiveUniformBlockName(n,r),o={index:t.getUniformBlockIndex(n,e),usedByVertexShader:t.getActiveUniformBlockParameter(n,r,35396),usedByFragmentShader:t.getActiveUniformBlockParameter(n,r,35398),size:t.getActiveUniformBlockParameter(n,r,35392),uniformIndices:t.getActiveUniformBlockParameter(n,r,35395)};o.used=o.usedByVertexShader||o.usedByFragmentShader,i[e]=o}return{blockSpecs:i,uniformData:e}}function jn(t,n){const r=t.uniformSetters||t,e=arguments.length;for(let t=1;t<e;++t){const n=arguments[t];if(Array.isArray(n)){const t=n.length;for(let e=0;e<t;++e)jn(r,n[e])}else for(const t in n){const e=r[t];e&&e(n[t])}}}function Rn(t,n){const r={},e=t.getProgramParameter(n,35721);for(let o=0;o<e;++o){const e=t.getActiveAttrib(n,o);if(In(e))continue;const i=t.getAttribLocation(n,e.name),c=Mn[e.type],u=c.setter(t,i,c);u.location=i,r[e.name]=u}return r}function kn(t,n){for(const r in n){const e=t[r];e&&e(n[r])}}function Nn(t,n,r){r.vertexArrayObject?t.bindVertexArray(r.vertexArrayObject):(kn(n.attribSetters||n,r.attribs),r.indices&&t.bindBuffer(34963,r.indices))}function Gn(t,n){const r={program:n,uniformSetters:Pn(t,n),attribSetters:Rn(t,n)};return Dt(t)&&(r.uniformBlockSpec=Bn(t,n),r.transformFeedbackInfo=On(t,n)),r}function Wn(t,n,r,e,o){const i=Un(r,e,o);let c=!0;if(n=n.map((function(t){if(t.indexOf("\n")<0){const n=Zt(t);n?t=n.text:(i.errorCallback("no element with id: "+t),c=!1)}return t})),!c)return null;const u=En(t,n,i);return u?Gn(t,u):null}function Ln(t,n,r,e,o,i){r=void 0===r?4:r;const c=n.indices,u=n.elementType,s=void 0===e?n.numElements:e;o=void 0===o?0:o,u||c?void 0!==i?t.drawElementsInstanced(r,s,void 0===u?5123:n.elementType,o,i):t.drawElements(r,s,void 0===u?5123:n.elementType,o):void 0!==i?t.drawArraysInstanced(r,o,s,i):t.drawArrays(r,o,s)}const Dn=36096,Hn=33306,Vn={};Vn[34041]=Hn,Vn[6401]=36128,Vn[36168]=36128,Vn[6402]=Dn,Vn[33189]=Dn,Vn[33190]=Dn,Vn[36012]=Dn,Vn[35056]=Hn,Vn[36013]=Hn;const qn={};qn[32854]=!0,qn[32855]=!0,qn[36194]=!0,qn[34041]=!0,qn[33189]=!0,qn[6401]=!0,qn[36168]=!0;var Xn=r(534),Yn=r.n(Xn),Jn=r(834),Kn=r.n(Jn);const Zn=Yn().uniforms.u_camera.variableName,Qn=Kn().uniforms.u_color.variableName,tr="a_position";let nr,rr;function er(t,n,r){const e=r[l];t.useProgram(nr.program),jn(nr,{[Qn]:e}),bt(t,rr.attribs[tr],n),Nn(t,nr,rr),Ln(t,rr,t.POINTS,n.length/2)}function or(t,n){const r=B(6*n,6*n),e=r.getContext("2d");return e.shadowColor=t,e.shadowBlur=2*n,e.fillStyle=t,e.beginPath(),e.arc(3*n,3*n,n,0,2*Math.PI),e.fill(),r}function ir(t){const{context:n}=t.$;Matter.Render.startViewTransform({...t.$,context:n}),function(t){const n=t.O,r=t.$,e=r.context,o=r.bounds,i=o.max.x-o.min.x,c=o.max.y-o.min.y,u=t.j.B.map((t=>new Float32Array(2*t))),s=Array(u.length).fill(0);for(let n=0;n<t.t.length;n++){const r=t.t[n];if(null===r)continue;const e=t._[n][a],o=u[e];o[s[e]]=r[0],o[s[e]+1]=r[1],s[e]+=2}n.viewport(0,0,n.drawingBufferWidth,n.drawingBufferHeight),n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(nr.program),n.enable(n.BLEND),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),n.blendFunc(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA),jn(nr,{[Zn]:[o.min.x,o.min.y,o.max.x,o.max.y]}),u.forEach(((r,e)=>er(n,r,t.U[e]))),e.drawImage(n.canvas,o.min.x,o.min.y,i,c)}(t)}function cr(t,n){const r=n.min.x,e=n.min.y,o=Math.round((n.max.x-n.min.x)/t);function i(t,n){return n*o+t}function c(t,n,r){const e=t.h[r];void 0===e?(t.h[r]=[n],t.p[n]=r):e.includes(n)||(e.push(n),t.p[n]=r)}function u(t,n,r){return t.h[i(n,r)]||[]}function s(t,n,r){!function(t,n){const r=t.indexOf(n);-1!==r&&t.splice(r,1)}(t.h[r],n),delete t.p[n]}const f={h:[],p:{},update:(n,o,u)=>{const a=Math.trunc((o-r)/t),l=Math.trunc((u-e)/t),y=f.p[n],d=i(a,l);y!==d&&(void 0!==y&&s(f,n,y),c(f,n,d))},insert:(n,o,u)=>{const s=i(Math.trunc((o-r)/t),Math.trunc((u-e)/t));c(f,n,s)},remove:t=>{const n=f.p[t];s(f,t,n)},getNearby:(n,o,i)=>{const c=Math.trunc((n-r)/t),s=Math.trunc((o-e)/t),a=[...u(f,c-1,s-1),...u(f,c,s-1),...u(f,c+1,s-1),...u(f,c-1,s),...u(f,c+1,s),...u(f,c-1,s+1),...u(f,c,s+1),...u(f,c+1,s+1)],l=u(f,c,s).slice();for(let r=0;r<a.length;r++){const e=a[r],c=i[e];(c[0]-n)**2+(c[1]-o)**2<=t**2&&l.push(e)}return l},getFromBounds:t=>f.getFromRect([t.min.x,t.min.y,t.max.x,t.max.y]),getFromRect:n=>{const o=Math.trunc((n[0]-r)/t),i=Math.trunc((n[1]-e)/t),c=Math.trunc((n[2]-r)/t),s=Math.trunc((n[3]-e)/t),a=[];for(let t=i;t<=s;t++)for(let n=o;n<=c;n++)a.push(...u(f,n,t));return a}};return Object.seal(f)}const ur=["pauseChange","particleRemove"];function sr(){const t={};return ur.forEach((n=>t[n]=()=>0)),t}const fr={drip(t,n,r,e){const o=0===t.R.length?t.t.length:t.R.pop(),i=new Float32Array([r,e,0,0]);t._[o]=t.U[n],t.t[o]=i,t.i.insert(o,r,e),t.j.B[n]++},rect(t,n,r,e,o,i,c=t.P){const u=Matter.Liquid.getFluidId(t,n),s=c/2,f=m(Math.trunc(o/c),1),a=m(Math.trunc(i/c),1);for(let n=0;n<f;n++)for(let o=0;o<a;o++){const i=r+s+n*c,l=e+s+o*c;fr.drip(t,u,i,l),n!==f-1&&o!==a-1&&fr.drip(t,u,i+s,l+s)}}},ar={dry(t,n){const r=t._[n],e=t.t[n];t.t[n]=null,t.i.remove(n),t.k.particleRemove(e,n,r),-1===t.R.indexOf(n)&&t.R.unshift(n),t.j.B[r[a]]--},rect(t,n,r,e,o){T(t.i.getFromRect([n,r,n+e,r+o]),(i=>{const s=t.t[i];null!==s&&d(s[c],s[u],[n,r,n+e,r+o])&&ar.dry(t,i)}))}},lr={trans(t,n,r){const e=t._,o=t.U[r];n.forEach((n=>{const r=t._[n];e[n]=o,t.j.B[r[a]]--,t.j.B[o[a]]++}))},transByName(t,n,r){lr.trans(t,n,Matter.Liquid.getFluidId(t,r))},transRect(t,n,r,e,o,i){const s=Matter.Liquid.getFluidId(t,n),f=[];t.t.forEach(((t,n)=>{null!==t&&d(t[c],t[u],[r,e,r+o,e+i])&&f.push(n)})),lr.trans(t,f,s)},reacts(t,n,r){const e=Matter.Liquid.getFluidId(t,n);t.M.T[e]=!0,t.M.S[e]=r}},yr={utils:{VirtualCanvas:B},create:function(t){const n=i().Liquid,r=t.radius||32,e=!!t.enableChemics,o=r*(t.particleTextureScale||.3);let c=[false,false];const u=t.worldWrapping;null!=u&&(c="boolean"==typeof u?[u,u]:u);const s={},f=t.fluids.map(((t,n)=>(t.name&&(s[t.name]=n),function(t,n,r){const e=n.color||"#fff";return[t,e,b(e),n.texture||or(e,r),n.mass||1]}(n,t,o)))),a=t.render.canvas,l=B(a.clientWidth,a.clientHeight).getContext("webgl2",{premultipliedAlpha:!1}),y=ir,d=O,p=t.updateStep||2,m=t.bounds,A=t.engine.timing;let v=0;const h={N:s,P:r,A:c[0],v:c[1],m:[m.min.x,m.min.y,m.max.x,m.max.y,m.max.x-m.min.x,m.max.y-m.min.y],G:t.engine,$:t.render,u:t.engine.world,O:l,F:t.isRegionalComputing||false,U:f,M:t.fluids.reduce(((t,n,r)=>(t.g[r]=!1,t.W[r]=n.chemicsUS||10,t.T[r]=!1,t)),{g:[],W:[],T:[],C:[],S:[]}),l:t.bordersBounce||.5,L:!1,D:t.gravityRatio||.2,i:cr(r,m),H:0,I:0,t:[],R:[],_:{},V:t.timeScale||1,k:sr(),j:{B:f.map((()=>0))},q:()=>{if(v++%p==0){if(e){const t=h.M.g;for(let n=0;n<t.length;n++)t[n]=(v-n)%h.M.W[n]==0}d(h,A.timeScale*h.V)}}};var z;return nr=Wn(z=l,[Yn().sourceCode,Kn().sourceCode],[tr]),rr=ht(z,{[tr]:{numComponents:2,data:[]}}),i().Events.on(t.render,"afterRender",(()=>y(h))),n.setPause(h,!!t.isPaused),Object.seal(h)},drip:fr,dry:ar,chemics:lr,setPause(t,n=!0){n?i().Events.off(t.G,"afterUpdate",t.q):i().Events.on(t.G,"afterUpdate",t.q),t.L=n,t.k.pauseChange(n)},setRenderBoundsPadding(t,n){t.H=n},setActiveBoundsPadding(t,n){t.I=n},setGravityRatio(t,n=t.D){t.D=n},setTimeScale(t,n=t.V){t.V=n},getGravity:t=>[t.u.gravity.x*t.D,t.u.gravity.y*t.D],getParticlesCount:t=>t.t.length-t.R.length,getFluidId:(t,n)=>"number"==typeof n?n:t.N[n]},dr={name:e.u2,version:e.i8,for:"matter-js@0.17.1",install(t){t.Liquid=yr}};Matter.Plugin.register(dr)},534:t=>{t.exports={sourceCode:"#version 300 es\nprecision lowp float;in vec2 a_position;uniform vec4 u_camera;void main(){vec2 offset=u_camera.xy;vec2 resolution=u_camera.zw-offset;vec2 position=(a_position-offset)/resolution;vec2 clipFlipSpace=(position*2.-1.)*vec2(1,-1);gl_PointSize=32.;gl_Position=vec4(clipFlipSpace,1,1);}",uniforms:{u_camera:{variableName:"u_camera",variableType:"vec4"}},consts:{}}},834:t=>{t.exports={sourceCode:"#version 300 es\nprecision lowp float;uniform vec4 u_color;out vec4 outColor;float intensivity=3.;void main(){float alpha=(0.5-length(gl_PointCoord-0.5))*intensivity;outColor=vec4(u_color.rgb,alpha);}",uniforms:{u_color:{variableName:"u_color",variableType:"vec4"}},consts:{}}},538:n=>{"use strict";n.exports=t}},r={};function e(t){var o=r[t];if(void 0!==o)return o.exports;var i=r[t]={exports:{}};return n[t](i,i.exports,e),i.exports}return e.n=t=>{var n=t&&t.X?()=>t.default:()=>t;return e.d(n,{a:n}),n},e.d=(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},e.o=(t,n)=>Object.prototype.hasOwnProperty.call(t,n),e.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"X",{value:!0})},e(702)})()}));