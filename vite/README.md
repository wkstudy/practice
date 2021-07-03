# 手写 vite

## step1

1. 实现一个服务器，能够返回 index.html
2. 对于 html 里的<script src = './index.js'>的 js 请求文件也能返回

### step2

对于`import { createApp } from 'vue'`这样的语法，浏览器会直接报错，[报错](./imgs/error.png), 因为`from` 后面只能是相对路径或者绝对路径，这样才能正确向后端发起请求，而 `from 'vue'`这种是不对的，根本都不会发起请求。**所以这里我们需要解决这个问题，让这条语句能够向后端发起请求**
这里的解决方法是把`import { createApp } from 'vue'` 改成`import { createApp } from '/@modules/vue'`，骗过浏览器，向端发起请求

### step3

把`import { createApp } from '/@modules/vue'` 这个文件给前端请求（把这个第三方库的**es 入口**返回前端）

这个路径一般在/node_modules/vue(第三方库)/package.json 的 modules 字段[举例](imgs/vue.png)

### step4

小问题解决：第三方库里有用'process.env'，但前端其实是没有这个概念的，所以这里仍然要 mock 一下

到这里 加载第三方库'vue'就完事了
