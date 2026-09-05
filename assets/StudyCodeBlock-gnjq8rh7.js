import{c as i,r as c,j as e}from"./index-Dfa4Lwsv.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=i("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=i("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);function f({children:a,className:l="",language:p="Code",...u}){const o=c.useRef(null),[n,s]=c.useState("");c.useEffect(()=>{s("")},[a]);async function x(){var r;try{await navigator.clipboard.writeText(((r=o.current)==null?void 0:r.textContent)||""),o.current&&s("Copied")}catch{if(!o.current)return;const t=window.getSelection(),d=document.createRange();d.selectNodeContents(o.current),t==null||t.removeAllRanges(),t==null||t.addRange(d),s("Clipboard unavailable. Code selected.")}}return e.jsxs("div",{className:"lesson-code",children:[e.jsxs("div",{className:"lesson-code-toolbar",children:[e.jsx("span",{children:p}),e.jsx("span",{className:"lesson-copy-status",role:"status",children:n}),e.jsx("button",{type:"button",onClick:x,"aria-label":"Copy code",title:"Copy code",children:n==="Copied"?e.jsx(y,{size:16}):e.jsx(C,{size:16})})]}),e.jsx("pre",{...u,ref:o,className:l,tabIndex:0,children:a})]})}export{f as S};
