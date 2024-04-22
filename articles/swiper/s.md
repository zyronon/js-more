---
theme: cyanosis
---

## 前言

大家在开发过程中，或多或少都会用到轮播图之类的组件，PC和Mobile上使用 [Swiper.js](https://swiperjs.com/react)  ，小程序上使用swiper组件等。

本文将详细讲解如何用**Vue**一步步实现的类似**Swiper.js**的功能，无任何第三方依赖，干货满满。

## 最终效果

在线预览：<https://zyronon.github.io/douyin/>

项目源代码：https://github.com/zyronon/douyin

**注意**：`PC` 必须将浏览器切到手机模式，先按 `F12` 调出控制台，再按 `Ctrl+Shift+M`才能正常预览

## Demo代码

> **上面的预览地址是最终实现的效果，下面才是本文代码实现的效果**
>
> 为提升阅读体验，正文中代码展示有部分省略处理，完整代码可以在码上掘金查看：
> <https://code.juejin.cn/pen/7356824634160840730>
>

## 实现原理

### 布局
我们需要用到两个div，父元素 `slide` 设置 **overflow: hidden 禁止滚动**，子元素 `slide-list` **使用 flex 布局**，然后将需要滚动的**页面**做为**孙元素**放在子元素 `slide-list` 中，由于子元素 `slide-list` 是 `flex` 布局，**页面**会自然的平铺排列

由于父元素 `slide` 的`overflow: hidden`属性会将内容裁减，不提供滚动条，也不允许用户滚动，所以我们只能看到父元素 `slide` 宽高的内容。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89d3c9412f2c412c87861336254c3bb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1385&h=558&s=194330&e=png&b=26093f)

```html
<div class="slide">
  <div class="slide-slide-list">
    <slot></slot>
  </div>
</div>
```

***
```
.slide {
  touch-action: none;
  height: 100%;
  width: 100%;
  transition: height 0.3s;
  position: relative;
  overflow: hidden;
}

 .slide-list {
    height: 100%;
    width: 100%;
    display: flex;
    position: relative;
  }
```


### 滑动

实现滚动的关键点在于**CSS3**的 [transform: translate(0, 0)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/translate) 属性。

**`translate()`**  这个 CSS 函数在水平和/或垂直方向上重新定位元素，它的坐标定义了元素在每个方向上移动了多少。

因为子元素 `slide-list` 的内容是平铺的，我们只需要在子元素 `slide-list` 监听对应的事件，计算滑动的距离`x`或`y`，再动态设置到子元素 `slide-list` 的`transform: translate(x, y)`里面，就可以实现页面滚动了

### 总结
#### 大家可以将整个流程理解为播放胶片电影：父元素 `A` 是放映机，子元素 `B` 是胶片，而`页面`是印刷在胶片上的内容。胶片每移动一格，我们就能看到新的一帧电影

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17238e01f2b54cf78b61220e429156a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=468&h=468&s=255008&e=png&b=807679)

## 实现

### 监听事件
PC上我们可以监听mousedown，mousemove，mouseup三个事件

移动设备上我们可以监听touchstart，touchmove，touchend三个事件

至于[ Pointer ](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_events)系列事件，我发现在移动端上和overflow:sroll冲突

比如，有一个页面，需要内部滚动，设置了overflow:scroll，如果用的是Pointer事件，那么滑动到这个页面时，将无法触发Pointer事件。

给页面设置touch-action:none之后，能触发Pointer事件，但页面又无法滚动了

### 页面布局


### 初始化

### 移动过程

### 结束滑动

## 难点

- 如何判断滑动方向？是向上下还是左右？
- 如何处理嵌套组件中的事件冲突？什么时候捕获和放行？

















