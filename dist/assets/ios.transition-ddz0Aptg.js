import{m as r,o as Z}from"./index-VVS4iuBB.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const j=540,z=o=>document.querySelector("".concat(o,".ion-cloned-element")),b=o=>o.shadowRoot||o,H=o=>{const s=o.tagName==="ION-TABS"?o:o.querySelector("ion-tabs"),c="ion-content ion-header:not(.header-collapse-condense-inactive) ion-title.title-large";if(s!=null){const e=s.querySelector("ion-tab:not(.tab-hidden), .ion-page:not(.ion-page-hidden)");return e!=null?e.querySelector(c):null}return o.querySelector(c)},M=(o,s)=>{const c=o.tagName==="ION-TABS"?o:o.querySelector("ion-tabs");let e=[];if(c!=null){const t=c.querySelector("ion-tab:not(.tab-hidden), .ion-page:not(.ion-page-hidden)");t!=null&&(e=t.querySelectorAll("ion-buttons"))}else e=o.querySelectorAll("ion-buttons");for(const t of e){const p=t.closest("ion-header"),i=p&&!p.classList.contains("header-collapse-condense-inactive"),u=t.querySelector("ion-back-button"),l=t.classList.contains("buttons-collapse"),y=t.slot==="start"||t.slot==="";if(u!==null&&y&&(l&&i&&s||!l))return u}return null},J=(o,s,c,e,t)=>{const p=M(e,c),i=H(t),u=H(e),l=M(t,c),y=p!==null&&i!==null&&!c,E=u!==null&&l!==null&&c;if(y){const _=i.getBoundingClientRect(),f=p.getBoundingClientRect(),T=b(p).querySelector(".button-text"),R=T.getBoundingClientRect(),L=b(i).querySelector(".toolbar-title").getBoundingClientRect();G(o,s,c,i,_,L,T,R),k(o,s,c,p,f,T,R,i,L)}else if(E){const _=u.getBoundingClientRect(),f=l.getBoundingClientRect(),T=b(l).querySelector(".button-text"),R=T.getBoundingClientRect(),L=b(u).querySelector(".toolbar-title").getBoundingClientRect();G(o,s,c,u,_,L,T,R),k(o,s,c,l,f,T,R,u,L)}return{forward:y,backward:E}},k=(o,s,c,e,t,p,i,u,l)=>{var y,E;const _=s?"calc(100% - ".concat(t.right+4,"px)"):"".concat(t.left-4,"px"),f=s?"right":"left",T=s?"left":"right",R=s?"right":"left",q=((y=p.textContent)===null||y===void 0?void 0:y.trim())===((E=u.textContent)===null||E===void 0?void 0:E.trim()),L=l.width/i.width,g=(l.height-U)/i.height,v=q?"scale(".concat(L,", ").concat(g,")"):"scale(".concat(g,")"),P="scale(1)",x=b(e).querySelector("ion-icon").getBoundingClientRect(),n=s?"".concat(x.width/2-(x.right-t.right),"px"):"".concat(t.left-x.width/2,"px"),S=s?"-".concat(window.innerWidth-t.right,"px"):"".concat(t.left,"px"),h="".concat(l.top,"px"),C="".concat(t.top,"px"),a=[{offset:0,transform:"translate3d(".concat(n,", ").concat(h,", 0)")},{offset:1,transform:"translate3d(".concat(S,", ").concat(C,", 0)")}],d=[{offset:0,transform:"translate3d(".concat(S,", ").concat(C,", 0)")},{offset:1,transform:"translate3d(".concat(n,", ").concat(h,", 0)")}],X=c?d:a,A=c?[{offset:0,opacity:1,transform:P},{offset:1,opacity:0,transform:v}]:[{offset:0,opacity:0,transform:v},{offset:1,opacity:1,transform:P}],I=c?[{offset:0,opacity:1,transform:"scale(1)"},{offset:.2,opacity:0,transform:"scale(0.6)"},{offset:1,opacity:0,transform:"scale(0.6)"}]:[{offset:0,opacity:0,transform:"scale(0.6)"},{offset:.6,opacity:0,transform:"scale(0.6)"},{offset:1,opacity:1,transform:"scale(1)"}],N=r(),F=r(),w=r(),m=z("ion-back-button"),D=b(m).querySelector(".button-text"),K=b(m).querySelector("ion-icon");m.text=e.text,m.mode=e.mode,m.icon=e.icon,m.color=e.color,m.disabled=e.disabled,m.style.setProperty("display","block"),m.style.setProperty("position","fixed"),F.addElement(K),N.addElement(D),w.addElement(m),w.beforeStyles({position:"absolute",top:"0px",[R]:"0px"}).keyframes(X),N.beforeStyles({"transform-origin":"".concat(f," top")}).beforeAddWrite(()=>{e.style.setProperty("display","none"),m.style.setProperty(f,_)}).afterAddWrite(()=>{e.style.setProperty("display",""),m.style.setProperty("display","none"),m.style.removeProperty(f)}).keyframes(A),F.beforeStyles({"transform-origin":"".concat(T," center")}).keyframes(I),o.addAnimation([N,F,w])},G=(o,s,c,e,t,p,i,u)=>{var l,y;const E=s?"right":"left",_=s?"calc(100% - ".concat(t.right,"px)"):"".concat(t.left,"px"),f="0px",T="".concat(t.top,"px"),R=8,q=s?"-".concat(window.innerWidth-u.right-R,"px"):"".concat(u.x-R,"px"),g="".concat(u.y-2,"px"),v=((l=i.textContent)===null||l===void 0?void 0:l.trim())===((y=e.textContent)===null||y===void 0?void 0:y.trim()),P=u.width/p.width,W=u.height/(p.height-U),x="scale(1)",n=v?"scale(".concat(P,", ").concat(W,")"):"scale(".concat(W,")"),S=[{offset:0,opacity:0,transform:"translate3d(".concat(q,", ").concat(g,", 0) ").concat(n)},{offset:.1,opacity:0},{offset:1,opacity:1,transform:"translate3d(".concat(f,", ").concat(T,", 0) ").concat(x)}],h=[{offset:0,opacity:.99,transform:"translate3d(".concat(f,", ").concat(T,", 0) ").concat(x)},{offset:.6,opacity:0},{offset:1,opacity:0,transform:"translate3d(".concat(q,", ").concat(g,", 0) ").concat(n)}],C=c?S:h,a=z("ion-title"),d=r();a.innerText=e.innerText,a.size=e.size,a.color=e.color,d.addElement(a),d.beforeStyles({"transform-origin":"".concat(E," top"),height:"".concat(t.height,"px"),display:"",position:"relative",[E]:_}).beforeAddWrite(()=>{e.style.setProperty("opacity","0")}).afterAddWrite(()=>{e.style.setProperty("opacity",""),a.style.setProperty("display","none")}).keyframes(C),o.addAnimation(d)},V=(o,s)=>{var c;try{const e="cubic-bezier(0.32,0.72,0,1)",t="opacity",p="transform",i="0%",l=o.ownerDocument.dir==="rtl",y=l?"-99.5%":"99.5%",E=l?"33%":"-33%",_=s.enteringEl,f=s.leavingEl,T=s.direction==="back",R=_.querySelector(":scope > ion-content"),q=_.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *"),L=_.querySelectorAll(":scope > ion-header > ion-toolbar"),g=r(),v=r();if(g.addElement(_).duration(((c=s.duration)!==null&&c!==void 0?c:0)||j).easing(s.easing||e).fill("both").beforeRemoveClass("ion-page-invisible"),f&&o!==null&&o!==void 0){const n=r();n.addElement(o),g.addAnimation(n)}if(!R&&L.length===0&&q.length===0?v.addElement(_.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")):(v.addElement(R),v.addElement(q)),g.addAnimation(v),T?v.beforeClearStyles([t]).fromTo("transform","translateX(".concat(E,")"),"translateX(".concat(i,")")).fromTo(t,.8,1):v.beforeClearStyles([t]).fromTo("transform","translateX(".concat(y,")"),"translateX(".concat(i,")")),R){const n=b(R).querySelector(".transition-effect");if(n){const S=n.querySelector(".transition-cover"),h=n.querySelector(".transition-shadow"),C=r(),a=r(),d=r();C.addElement(n).beforeStyles({opacity:"1",display:"block"}).afterStyles({opacity:"",display:""}),a.addElement(S).beforeClearStyles([t]).fromTo(t,0,.1),d.addElement(h).beforeClearStyles([t]).fromTo(t,.03,.7),C.addAnimation([a,d]),v.addAnimation([C])}}const P=_.querySelector("ion-header.header-collapse-condense"),{forward:W,backward:x}=J(g,l,T,_,f);if(L.forEach(n=>{const S=r();S.addElement(n),g.addAnimation(S);const h=r();h.addElement(n.querySelector("ion-title"));const C=r(),a=Array.from(n.querySelectorAll("ion-buttons,[menuToggle]")),d=n.closest("ion-header"),X=d==null?void 0:d.classList.contains("header-collapse-condense-inactive");let $;T?$=a.filter(I=>{const N=I.classList.contains("buttons-collapse");return N&&!X||!N}):$=a.filter(I=>!I.classList.contains("buttons-collapse")),C.addElement($);const B=r();B.addElement(n.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])"));const A=r();A.addElement(b(n).querySelector(".toolbar-background"));const O=r(),Y=n.querySelector("ion-back-button");if(Y&&O.addElement(Y),S.addAnimation([h,C,B,A,O]),C.fromTo(t,.01,1),B.fromTo(t,.01,1),T)X||h.fromTo("transform","translateX(".concat(E,")"),"translateX(".concat(i,")")).fromTo(t,.01,1),B.fromTo("transform","translateX(".concat(E,")"),"translateX(".concat(i,")")),O.fromTo(t,.01,1);else if(P||h.fromTo("transform","translateX(".concat(y,")"),"translateX(".concat(i,")")).fromTo(t,.01,1),B.fromTo("transform","translateX(".concat(y,")"),"translateX(".concat(i,")")),A.beforeClearStyles([t,"transform"]),(d==null?void 0:d.translucent)?A.fromTo("transform",l?"translateX(-100%)":"translateX(100%)","translateX(0px)"):A.fromTo(t,.01,"var(--opacity)"),W||O.fromTo(t,.01,1),Y&&!W){const N=r();N.addElement(b(Y).querySelector(".button-text")).fromTo("transform",l?"translateX(-100px)":"translateX(100px)","translateX(0px)"),S.addAnimation(N)}}),f){const n=r(),S=f.querySelector(":scope > ion-content"),h=f.querySelectorAll(":scope > ion-header > ion-toolbar"),C=f.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *");if(!S&&h.length===0&&C.length===0?n.addElement(f.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")):(n.addElement(S),n.addElement(C)),g.addAnimation(n),T){n.beforeClearStyles([t]).fromTo("transform","translateX(".concat(i,")"),l?"translateX(-100%)":"translateX(100%)");const a=Z(f);g.afterAddWrite(()=>{g.getDirection()==="normal"&&a.style.setProperty("display","none")})}else n.fromTo("transform","translateX(".concat(i,")"),"translateX(".concat(E,")")).fromTo(t,1,.8);if(S){const a=b(S).querySelector(".transition-effect");if(a){const d=a.querySelector(".transition-cover"),X=a.querySelector(".transition-shadow"),$=r(),B=r(),A=r();$.addElement(a).beforeStyles({opacity:"1",display:"block"}).afterStyles({opacity:"",display:""}),B.addElement(d).beforeClearStyles([t]).fromTo(t,.1,0),A.addElement(X).beforeClearStyles([t]).fromTo(t,.7,.03),$.addAnimation([B,A]),n.addAnimation([$])}}h.forEach(a=>{const d=r();d.addElement(a);const X=r();X.addElement(a.querySelector("ion-title"));const $=r(),B=a.querySelectorAll("ion-buttons,[menuToggle]"),A=a.closest("ion-header"),O=A==null?void 0:A.classList.contains("header-collapse-condense-inactive"),Y=Array.from(B).filter(D=>{const K=D.classList.contains("buttons-collapse");return K&&!O||!K});$.addElement(Y);const I=r(),N=a.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])");N.length>0&&I.addElement(N);const F=r();F.addElement(b(a).querySelector(".toolbar-background"));const w=r(),m=a.querySelector("ion-back-button");if(m&&w.addElement(m),d.addAnimation([X,$,I,w,F]),g.addAnimation(d),w.fromTo(t,.99,0),$.fromTo(t,.99,0),I.fromTo(t,.99,0),T){if(O||X.fromTo("transform","translateX(".concat(i,")"),l?"translateX(-100%)":"translateX(100%)").fromTo(t,.99,0),I.fromTo("transform","translateX(".concat(i,")"),l?"translateX(-100%)":"translateX(100%)"),F.beforeClearStyles([t,"transform"]),(A==null?void 0:A.translucent)?F.fromTo("transform","translateX(0px)",l?"translateX(-100%)":"translateX(100%)"):F.fromTo(t,"var(--opacity)",0),m&&!x){const K=r();K.addElement(b(m).querySelector(".button-text")).fromTo("transform","translateX(".concat(i,")"),"translateX(".concat((l?-124:124)+"px",")")),d.addAnimation(K)}}else O||X.fromTo("transform","translateX(".concat(i,")"),"translateX(".concat(E,")")).fromTo(t,.99,0).afterClearStyles([p,t]),I.fromTo("transform","translateX(".concat(i,")"),"translateX(".concat(E,")")).afterClearStyles([p,t]),w.afterClearStyles([t]),X.afterClearStyles([t]),$.afterClearStyles([t])})}return g}catch(e){throw e}},U=10;export{V as iosTransitionAnimation,b as shadow};
