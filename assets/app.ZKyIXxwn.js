import{_ as d,o as l,c as u,p as _,q as f,k as s,ah as m,ai as c,v as r,aj as v,ak as g,al as A,am as b,an as P,ao as S,ap as x,aq as y,ar as C,as as k,Y as I,d as L,u as $,j as z,z as B,at as E,au as T,av as V}from"./chunks/framework.aRfm0wQm.js";import{t as p}from"./chunks/theme.xI8CdKv7.js";const D={},h=e=>(_("data-v-19099dcb"),e=e(),f(),e),M={class:"content"},R=h(()=>s("img",{class:"icon",src:m},null,-1)),j=h(()=>s("span",{class:"text"},"微信公众号",-1)),q=[R,j];function F(e,t){return l(),u("div",M,q)}const O=d(D,[["render",F],["__scopeId","data-v-19099dcb"]]),N={},W=e=>(_("data-v-95599058"),e=e(),f(),e),G={class:"VPSocialLinks VPNavBarSocialLinks social-links"},H=W(()=>s("a",{class:"VPSocialLink app","aria-label":"weixin"},[s("svg",{t:"1701186907114",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"17908",width:"48",height:"48"},[s("path",{d:"M347.729118 353.0242c-16.487119 0-29.776737 13.389539-29.776737 29.776737S331.241998 412.677596 347.729118 412.677596s29.776737-13.389539 29.776737-29.776737-13.289617-29.876659-29.776737-29.876659zM577.749415 511.800156c-13.689305 0-24.880562 11.091335-24.880563 24.880562 0 13.689305 11.091335 24.880562 24.880563 24.880562 13.689305 0 24.880562-11.191257 24.880562-24.880562s-11.191257-24.880562-24.880562-24.880562zM500.909446 412.677596c16.487119 0 29.776737-13.389539 29.776737-29.776737s-13.389539-29.776737-29.776737-29.776737c-16.487119 0-29.776737 13.389539-29.776737 29.776737s13.289617 29.776737 29.776737 29.776737zM698.455113 511.600312c-13.689305 0-24.880562 11.091335-24.880562 24.880562 0 13.689305 11.091335 24.880562 24.880562 24.880562 13.689305 0 24.880562-11.091335 24.880562-24.880562-0.099922-13.689305-11.191257-24.880562-24.880562-24.880562z",fill:"#00C800","p-id":"17909"}),s("path",{d:"M511.601093 0.799375C229.12178 0.799375 0.000781 229.820453 0.000781 512.399688s229.021077 511.600312 511.600312 511.600312 511.600312-229.021077 511.600312-511.600312S794.180328 0.799375 511.601093 0.799375z m-90.229508 634.504294c-27.37861 0-49.361436-5.595628-76.839969-10.991413l-76.640125 38.469945 21.882904-65.948477c-54.957065-38.370023-87.73146-87.831382-87.73146-148.084309 0-104.318501 98.722873-186.554254 219.32865-186.554255 107.815769 0 202.34192 65.648712 221.327088 153.979703-6.994536-0.799375-13.989071-1.298985-21.083529-1.298985-104.118657 0-186.454333 77.739266-186.454332 173.564403 0 15.98751 2.498048 31.275566 6.794692 45.964091-6.794692 0.599532-13.689305 0.899297-20.583919 0.899297z m323.547228 76.839969l16.48712 54.757221-60.153006-32.874317c-21.882904 5.495706-43.965652 10.991413-65.848555 10.991413-104.318501 0-186.554254-71.344262-186.554255-159.175644 0-87.631538 82.135831-159.175644 186.554255-159.175644 98.523029 0 186.254489 71.444184 186.254488 159.175644 0.099922 49.461358-32.774395 93.227166-76.740047 126.301327z",fill:"#00C800","p-id":"17910"})]),s("div",{class:"qrcode"},[s("img",{class:"icon",src:m}),s("span",null,"微信公众号")])],-1)),U=[H];function Y(e,t){return l(),u("div",G,U)}const J=d(N,[["render",Y],["__scopeId","data-v-95599058"]]),K={...p,Layout(){return c(p.Layout,null,{"aside-bottom":()=>c(O),"nav-bar-content-after":()=>c(J)})},enhanceApp({app:e,router:t,siteData:a}){let n=!1;e.mixin({mounted(){n||(setTimeout(()=>{const i=document.querySelector(".VPDoc");i&&(i.setAttribute("id","container"),window.btw=new BTWPlugin,window.btw.init({id:"container",blogId:"32228-1698943811239-404",name:"前端研学营",qrcode:"https://codeteenager.github.io/FE/weixin.jpeg",keyword:"前端研学营"}))},1e3),n=!0)}})}};function w(e){if(e.extends){const t=w(e.extends);return{...t,...e,async enhanceApp(a){t.enhanceApp&&await t.enhanceApp(a),e.enhanceApp&&await e.enhanceApp(a)}}}return e}const o=w(K),Q=L({name:"VitePressApp",setup(){const{site:e}=$();return z(()=>{B(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),e.value.router.prefetchLinks&&E(),T(),V(),o.setup&&o.setup(),()=>c(o.Layout)}});async function X(){const e=e1(),t=Z();t.provide(g,e);const a=A(e.route);return t.provide(b,a),t.component("Content",P),t.component("ClientOnly",S),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return a.frontmatter.value}},$params:{get(){return a.page.value.params}}}),o.enhanceApp&&await o.enhanceApp({app:t,router:e,siteData:x}),{app:t,router:e,data:a}}function Z(){return y(Q)}function e1(){let e=r,t;return C(a=>{let n=k(a),i=null;return n&&(e&&(t=n),(e||t===n)&&(n=n.replace(/\.js$/,".lean.js")),i=I(()=>import(n),__vite__mapDeps([]))),r&&(e=!1),i},o.NotFound)}r&&X().then(({app:e,router:t,data:a})=>{t.go().then(()=>{v(t.route,a.site),e.mount("#app")})});export{X as createApp};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}