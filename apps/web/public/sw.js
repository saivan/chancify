if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>a(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-01fd22c6"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"53594ea215be1281361611744729b542"},{url:"/_next/static/chunks/1226-e3a629ac75031809.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/1867-ad2368dcf0df3bdb.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/1907-b032615fcaea90a2.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/2078-e39d057a8f2cf77d.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/2376-6c084185f83cf8cc.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/2998.743e6306cd132c71.js",revision:"743e6306cd132c71"},{url:"/_next/static/chunks/3444-70a3b839196d20b4.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/3756-b5354f343d1fdd0d.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/4502.7e086e0cd24bbd0f.js",revision:"7e086e0cd24bbd0f"},{url:"/_next/static/chunks/4837-6805c901ce4e6432.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/551d953d-6c75cb41088a3488.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/5540.e45133adc3044171.js",revision:"e45133adc3044171"},{url:"/_next/static/chunks/6667-c8500d86b2117476.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/681-25357490a6519331.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/6911-c9a67fa2ae0eeb7b.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/7648-7c6cc66bd786335f.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/8494-3f20d21f1f2a5198.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/9795-06c48ccc5ebcf03b.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/9834-141fc61cc28bddad.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(authentication)/layout-fe028ad48c0cb724.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(authentication)/sign-in/%5B%5B...sign-in%5D%5D/page-4622a429172b6532.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(authentication)/sign-up/%5B%5B...sign-up%5D%5D/page-6a6cdd0952e90d16.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/campaigns/%5Bid%5D/page-419779b3ddb838a2.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/campaigns/page-3c20d241efd5188c.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/history/%5Bid%5D/page-c4b08a062e2df029.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/history/page-db778733b191d552.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/layout-b00b951ac28ea3d0.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/settings/page-fa724cb7f80a7a76.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/(dashboard)/users/page-3e1ba8fed4d2b196.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/_not-found/page-997b43fa9c0a36ea.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/api/files/%5B...method%5D/route-c626a4e9c066a127.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/api/trpc/%5Btrpc%5D/route-52dfe813d3fe394b.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/error-606ad6da760dbd4a.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/layout-b114f8ea8d77e3c2.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/live/%5BorganizationHandle%5D/(1)/campaigns/page-253503627655d3ff.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/live/%5BorganizationHandle%5D/(2)/action/page-f1a1433e8a42abd1.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/live/%5BorganizationHandle%5D/(3)/details/page-fec05fdec4ce8523.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/live/%5BorganizationHandle%5D/(4)/spin/page-5563ebfab5b0a4ec.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/live/%5BorganizationHandle%5D/(5)/prize/page-d86ba99947514dc9.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/live/%5BorganizationHandle%5D/layout-edfb9a00574b1ed5.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/not-found-daca5a8f695fc257.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/app/page-586f7debce211b85.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/c9d90cee-4886210e7e4526bf.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/e637b8c3-8f501e1af140668a.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/framework-08d1233d2bcb2ebd.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/main-a06bfbde26d89c2a.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/main-app-2b7c20c72de33cb7.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/pages/_app-c4b7b1e7f8ca7200.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/pages/_error-87ead79850895096.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-9feab1cc45bd6c9a.js",revision:"zLk583M7hBVs70APzzRxE"},{url:"/_next/static/css/051f606b6a4b9dff.css",revision:"051f606b6a4b9dff"},{url:"/_next/static/css/6f220cd3c7ff48c5.css",revision:"6f220cd3c7ff48c5"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/e11418ac562b8ac1-s.p.woff2",revision:"0e46e732cced180e3a2c7285100f27d4"},{url:"/_next/static/zLk583M7hBVs70APzzRxE/_buildManifest.js",revision:"f85d252d797af468c0d7bbe051e08332"},{url:"/_next/static/zLk583M7hBVs70APzzRxE/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/favicon.ico",revision:"7f98bbc43ba0d1dbf3564adf0821a304"},{url:"/fonts/Teko.ttf",revision:"4d23bd0f4a6b3d230c22cb7d6d26c866"},{url:"/images/auth-background.jpeg",revision:"089bcfa5f6e3102b7db9d963b89c447e"},{url:"/images/logos/facebook.svg",revision:"48c7c456d94c33d786599177fdaa01c6"},{url:"/images/logos/google.svg",revision:"7fc0aa9904b75f0dc14153caa594560b"},{url:"/images/logos/instagram.svg",revision:"e553678afd83afad58833e6af32a2c94"},{url:"/images/logos/personal.svg",revision:"b4776ebd4e228b5bdd3a7fa5addd3daf"},{url:"/images/logos/tiktok.svg",revision:"3357825afe985d87b5b6c5bfd87f8291"},{url:"/images/logos/unknown.svg",revision:"b4776ebd4e228b5bdd3a7fa5addd3daf"},{url:"/logo-wide.svg",revision:"025d7cb2321f23e7646457849a1f4fc9"},{url:"/logo.svg",revision:"2666ee4475d04264e7fed82189b704fd"},{url:"/pwa/icon512_maskable.png",revision:"b70827c991a5d5b81a5d82c9f73eca3c"},{url:"/pwa/icon512_rounded.png",revision:"cd01407078c697d04d50c1a8f50bb043"},{url:"/pwa/manifest.json",revision:"13d15659296b06b611d892b94e7960a7"},{url:"/videos/circle.mp4",revision:"ed034f38690599baf99bc5adb493116d"},{url:"/videos/square.mp4",revision:"718b2d9b6cf8824d4c255c9e5c5e03a8"},{url:"/videos/tunnel.mp4",revision:"baa83e6402188a939f4cb9ef67c2ea86"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
