import{_ as d,o as l,c as _,p as f,m,k as i,a5 as o,W as c,a6 as h,a7 as A,a8 as g,a9 as v,aa as y,ab as b,ac as w,ad as P,ae as x,af as C,Z as E,d as R,u as S,j as B,A as I,ag as j,ah as D,ai as L}from"./chunks/framework.30c8cb75.js";import{t as r}from"./chunks/theme.63881bd7.js";const T="/theia-analysis/weixin.jpeg";const O={},p=e=>(f("data-v-19099dcb"),e=e(),m(),e),V={class:"content"},k=p(()=>i("img",{class:"icon",src:T},null,-1)),F=p(()=>i("span",{class:"text"},"微信公众号",-1)),$=[k,F];function N(e,t){return l(),_("div",V,$)}const G=d(O,[["render",N],["__scopeId","data-v-19099dcb"]]);const H={...r,Layout(){return o(r.Layout,null,{"aside-bottom":()=>o(G)})}};function u(e){if(e.extends){const t=u(e.extends);return{...t,...e,async enhanceApp(a){t.enhanceApp&&await t.enhanceApp(a),e.enhanceApp&&await e.enhanceApp(a)}}}return e}const s=u(H),M=R({name:"VitePressApp",setup(){const{site:e}=S();return B(()=>{I(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),j(),D(),L(),s.setup&&s.setup(),()=>o(s.Layout)}});async function U(){const e=Z(),t=W();t.provide(A,e);const a=g(e.route);return t.provide(v,a),t.component("Content",y),t.component("ClientOnly",b),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return a.frontmatter.value}},$params:{get(){return a.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:t,router:e,siteData:w}),{app:t,router:e,data:a}}function W(){return P(M)}function Z(){let e=c,t;return x(a=>{let n=C(a);return n?(e&&(t=n),(e||t===n)&&(n=n.replace(/\.js$/,".lean.js")),c&&(e=!1),E(()=>import(n),[])):null},s.NotFound)}c&&U().then(({app:e,router:t,data:a})=>{t.go().then(()=>{h(t.route,a.site),e.mount("#app")})});export{U as createApp};
