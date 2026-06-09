\# Glasses Scroll Hero – AI‑Powered Eyewear Landing Section
> Built as a product/UX experiment to see how AI tools can speed up shipping a real scroll-driven hero section on a live store.


> Scroll-driven hero section for an eyewear brand, built with Google Flow, Google Antigravity, and Vite.



\---


> این پروژه به‌عنوان یک تجربه‌ی پروداکت/UX ساخته شده تا ببینم چطور می‌شود با ابزارهای هوش مصنوعی، یک سکشن هیروی واقعی را سریع به نسخه‌ی قابل استقرار روی سایت تبدیل کرد.
\## 🇮🇷 معرفی پروژه (فارسی)



این پروژه یک سکشن هیرو اسکرولی (Scroll‑Driven Hero) برای فروش عینک است که با کمک چند ابزار هوش مصنوعی و تکنولوژی‌های فرانت‌اند ساخته شده است.  

هدف این بود که برای صفحه اصلی یک فروشگاه پوشاک و اکسسوری، یک بنر مدرن و «Apple‑Style» داشته باشیم که با اسکرول کاربر، حرکت نرم گذاشتن عینک روی صورت را نمایش بدهد.



\### ویژگی‌ها



\- انیمیشن اسکرولی فریم‑به‑فریم از کاراکتر مرد:

&#x20; - شروع: عینک در دست، لبخند ملایم.

&#x20; - پایان: عینک روی چشم، ژست مطمئن.

\- طراحی مدرن و تاریک (dark theme) مناسب برندینگ لوکس.

\- Canvas‑based animation با لود تدریجی فریم‌ها برای تجربه نرم.

\- سکشن متن کنار/زیر انیمیشن:

&#x20; - تیتر برند و محصول.

&#x20; - متن توضیحی کوتاه.

&#x20; - دکمه CTA برای مشاهده/خرید عینک.

\- ریسپانسیو برای دسکتاپ و موبایل.



\### دموی زنده



> 🟢 Live Demo:  

> `https://tchibokurdeh.ir/glasses-test/`



\---



\## 🧠 استک و ابزارها



\- \*\*Google Flow\*\* – ساخت فریم‌های اول و آخر ویدیو و تولید انیمیشن بین آن‌ها.

\- \*\*EZGif\*\* – تبدیل ویدیو به GIF و استخراج ۱۴۴ فریم PNG.

\- \*\*Google Antigravity\*\* – تولید کد فرانت‌اند (HTML, CSS, JS, Vite) بر اساس پرامپت.

\- \*\*Vite\*\* – باندلر و dev server برای توسعه و build.

\- \*\*Canvas + JavaScript\*\* – نمایش sequence فریم‌ها و اتصال آن به اسکرول.

\- \*\*WordPress Host\*\* – استقرار خروجی نهایی در زیرپوشه `/glasses-test/`.



\---



\## ⚙️ راه‌اندازی لوکال (Local Setup)



پیش‌نیاز: Node.js نصب باشد (مثلاً v18+ یا v20+).



```bash

\# 1. دریافت پروژه

git clone https://github.com/aliM75065/glasses-scroll-hero.git

cd glasses-scroll-hero



\# 2. نصب وابستگی‌ها

npm install



\# 3. اجرای سرور توسعه

npm run dev

```



سپس در مرورگر به این آدرس بروید:



\- `http://localhost:5173/`



\---



\## 📦 Build و استقرار در زیرپوشه (مثلاً /glasses-test/)



برای استقرار روی زیرپوشه یک دامنه (مثل وردپرس)، در فایل `vite.config.js` این تنظیم مهم است:



```js

import { defineConfig } from 'vite';



export default defineConfig({

&#x20; base: '/glasses-test/',   // نام پوشه زیرپوشه روی هاست



&#x20; root: '.',

&#x20; publicDir: false,



&#x20; build: {

&#x20;   outDir: 'dist',

&#x20;   assetsInlineLimit: 0,

&#x20; },



&#x20; server: {

&#x20;   port: 5173,

&#x20;   open: true,

&#x20; },



&#x20; assetsInclude: \['\*\*/\*.png'],

});

```



سپس:



```bash

npm run build

```



خروجی نهایی در پوشه `dist` ساخته می‌شود و می‌توان آن را در زیرپوشه هاست (مثل `public\_html/glasses-test`) آپلود کرد.



\---



\## 📝 روند ساخت (Short Story)



1\. ساخت فریم‌های اول و آخر کاراکتر مرد عینکی در Google Flow.  

2\. تولید ویدیوی ۶ ثانیه‌ای از حرکت «عینک در دست → عینک روی چشم».  

3\. تبدیل ویدیو به ۱۴۴ فریم PNG با EZGif.  

4\. کپی فریم‌ها داخل پوشه پروژه و توصیف سناریو برای Antigravity با یک پرامپت مفصل.  

5\. تولید خودکار ساختار پروژه Vite (HTML/CSS/JS) توسط Antigravity.  

6\. اتصال اسکرول صفحه به پیشرفت انیمیشن روی canvas.  

7\. تنظیم `base` در Vite برای استقرار در زیرپوشه هاست وردپرس.  

8\. استقرار روی `https://tchibokurdeh.ir/glasses-test/`.



\---



\## 🇬🇧 Project Overview (English)



This project is a scroll‑driven hero section for an eyewear brand.  

As the user scrolls, a frame‑by‑frame animation shows a stylish young man smoothly putting on his glasses, creating a high‑end Apple‑style product reveal.



\### Features



\- Scroll‑linked frame sequence animation (144 PNG frames).

\- Canvas‑based rendering with lerped frame transitions.

\- Premium dark theme with modern typography.

\- Hero copy and CTA section for an eyewear product.

\- Responsive layout for desktop and mobile.



\### Live Demo



> 🟢 Live Demo:  

> `https://tchibokurdeh.ir/glasses-test/`



\---



\## 🧰 Tech Stack



\- Google Flow (video generation from keyframes)

\- EZGif (video → GIF → PNG frames)

\- Google Antigravity (AI‑powered code generation)

\- Vite (dev server + bundler)

\- JavaScript + Canvas (scroll → frame mapping)

\- Deployed under a WordPress host subfolder (`/glasses-test/`)



\---



\## 🚀 Local Development



```bash

git clone https://github.com/aliM75065/glasses-scroll-hero.git

cd glasses-scroll-hero



npm install

npm run dev

```



Open `http://localhost:5173/` in your browser.



\---



\## 📤 Deploying to a Subfolder



When deploying under a subfolder like `/glasses-test/`, make sure `vite.config.js` includes:



```js

export default defineConfig({

&#x20; base: '/glasses-test/',

&#x20; // ...

});

```



Then run:



```bash

npm run build

```



Upload the contents of `dist/` (index.html + assets) into the target subfolder on your host.



\---



\## 📎 Notes



\- This is a real production‑like hero section used for an actual clothing \& accessories store landing page.  

\- The goal was not only to test AI tools, but to ship a working, scroll‑driven experience on a real domain.

