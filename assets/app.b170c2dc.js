import{_ as l,o as _,c as m,p as f,m as h,k as p,a3 as i,s as c,a4 as g,a5 as w,a6 as A,a7 as y,a8 as b,a9 as v,aa as P,ab as x,ac as C,ad as E,X as I,d as S,u as B,j as D,y as R,ae as T,af as j,ag as L}from"./chunks/framework.0847507f.js";import{t as r}from"./chunks/theme.03c0b113.js";const V="/theia-analysis/weixin.jpeg";const k={},u=e=>(f("data-v-19099dcb"),e=e(),h(),e),F={class:"content"},O=u(()=>p("img",{class:"icon",src:V},null,-1)),$=u(()=>p("span",{class:"text"},"微信公众号",-1)),q=[O,$];function M(e,t){return _(),m("div",F,q)}const N=l(k,[["render",M],["__scopeId","data-v-19099dcb"]]);const G={...r,Layout(){return i(r.Layout,null,{"aside-bottom":()=>i(N)})},enhanceApp({app:e,router:t,siteData:a}){let n=!1;e.mixin({mounted(){n||(setTimeout(()=>{const s=document.querySelector(".VPDoc");s&&(s.setAttribute("id","container"),window.btw=new BTWPlugin,window.btw.init({id:"container",blogId:"32228-1698943811239-404",name:"前端研学营",qrcode:"https://codeteenager.github.io/FE/weixin.jpeg",keyword:"前端研学营"}))},1e3),n=!0)}})}};function d(e){if(e.extends){const t=d(e.extends);return{...t,...e,async enhanceApp(a){t.enhanceApp&&await t.enhanceApp(a),e.enhanceApp&&await e.enhanceApp(a)}}}return e}const o=d(G),H=S({name:"VitePressApp",setup(){const{site:e}=B();return D(()=>{R(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),T(),j(),L(),o.setup&&o.setup(),()=>i(o.Layout)}});async function U(){const e=X(),t=W();t.provide(w,e);const a=A(e.route);return t.provide(y,a),t.component("Content",b),t.component("ClientOnly",v),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return a.frontmatter.value}},$params:{get(){return a.page.value.params}}}),o.enhanceApp&&await o.enhanceApp({app:t,router:e,siteData:P}),{app:t,router:e,data:a}}function W(){return x(H)}function X(){let e=c,t;return C(a=>{let n=E(a),s=null;return n&&(e&&(t=n),(e||t===n)&&(n=n.replace(/\.js$/,".lean.js")),s=I(()=>import(n),[])),c&&(e=!1),s},o.NotFound)}c&&U().then(({app:e,router:t,data:a})=>{t.go().then(()=>{g(t.route,a.site),e.mount("#app")})});export{U as createApp};
