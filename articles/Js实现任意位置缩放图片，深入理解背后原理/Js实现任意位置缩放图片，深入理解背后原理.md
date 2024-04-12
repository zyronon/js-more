---
theme: smartblue
---

## 前言

本文将用一个简单的例子详细讲解如何用原生**JS**一步步实现完整的**任意位置缩放图片**功能，无任何第三方依赖，**指针事件**
进行多端统一的事件监听，干货满满。

## 完整代码

为提升阅读体验，正文中代码展示有部分省略处理，完整代码可以在码上掘金查看：[code.juejin.cn/pen/7158337…](https://code.juejin.cn/pen/7158337368355766285 "https://code.juejin.cn/pen/7158337368355766285")

## 实现原理

实现图片放大的关键点在于 **CSS3** 中的 `transform`
变换，该属性应用于元素在2D或3D上的旋转，缩放，移动，倾斜等等变换，通过设置 `translate(x,y)` 即可偏移元素位置，设置 `scale`
即可缩放元素，当然你也可以只设置 `matrix` 来完成上述所有操作，这涉及到矩阵变换的知识，本文使用的均是CSS提供的语法糖进行变换操作。

PC上的点击、移动，H5的手势操作，都离不开DOM**事件监听**。例如鼠标移动事件对应 `mousemove`
，移动端因为没有鼠标则对应 `touchmove`，而本文将介绍如何仅通过**指针事件**来进行多端**统一**
的事件监听。在监听事件中我们可以通过 `event` 对象获取各种属性，例如常用的 `offsetX`、`offsetY`
相对偏移量，`clientX`、`clientY` 距离窗口的横坐标和纵坐标等。

## 理解transform-origin值

官方文档解释为：**`transform-origin`**CSS 属性让你更改一个元素变形的原点。
https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin

我们可以简单的理解为图片缩放起点，这个值默认为图片的正中心，所以我们进行放大或缩小都是依图片中心来缩放。

# css缩放图片有两种方法

### 一、修改`transform-origin`值进行缩放

> 优点：简单快捷，容易理解
>
>缺点：频繁修改`transform-origin`值会抖动，需要计算修正量

将鼠标**当前的偏移量**即 `offsetX、offsetY` 的值改变 `transform-origin`
来动态设置缩放的原点，再进行缩放，那么最终效果就是依照最新的`transform-origin`值来进行缩放。

比如修改`transform-origin`值为90% 90%。再设置放大倍数`scale`为1.1。效果就是下图的样子

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf5d0f0ba8b746389be9e76f7572a531~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=721&h=729&s=36654&e=png&b=efefef)

### 二、不修改`transform-origin`值，设置偏移量`translate(x,y)`进行缩放

我们利用**滚轮事件**监听并改变 `scale` 值。重点是利用 `deltaY` 值的正负来判断滚轮是朝上还是朝下：

```js
let scale = 1;
image.addEventListener("wheel", function (e) {
  //d值永远是正的0.1或者负的0.1，代表每次缩放的倍数
  let d = e.deltaY < 0 ? 0.1 : -0.1;
  scale = scale * (1 + d);
...
});
``` 

<div>
<img width="100%" src='https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/760628d97f3b4fa4b2102395e7fd50d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image' />
</div>

如上图，怎么样从左图变成右图呢？由于我们未修改`transform-origin`，所以缩放始终都以**图片中心**
为原点进行缩放，这显然不符合我们的操作习惯，我们需要的是以鼠标点为中心对图片进行缩放。

可以清晰的看到，我们先将图片放大0.1倍，再设置偏移量`translate(x,y)`就可以实现任意位置缩放

需要计算的`translate(x,y)`值，实际上就是放大后的图片中心点与原始图片中心点的差值

---

每次需要偏移的xy的`最大值` = 长宽 * 放大倍数 / 2

例如：长400,宽为800的图片。放大0.1倍之后，图片的长为440，宽为880。如果是在中心点放大，那么不需要移动图片，xy等于0。如果在左上角放大，那么图片整体向右下角偏移
x = (440 - 400) / 2 = 20，y = (880 - 800) / 2 = 40.

```js
let d = e.deltaY < 0 ? 0.1 : -0.1;
const max = {
  x: (d * rect.width) / 2,
  y: (d * rect.height) / 2,
};
```

---

用`鼠标点的座标`减去`图片的在页面中的位置`可以得到`鼠标在图片中的位置`

```js
rect = image.getBoundingClientRect()
const mouseOffset = {
  x: e.clientX - rect.x,
  y: e.clientY - rect.y
}
```

---
最后用`mouseOffset`减去已偏移的xy，再剩以放大倍数`d`，再减去`max`，就是当前的xy值

1. 因为mouseOffset的值，基本可以看作为一个常量，如果鼠标不移动位置，那么mouseOffset的值不会变，所以需要减去已偏移的xy，才可累计偏移量
2. 再剩以放大倍数，得到的值，还不能用于偏移
3. 上面求得的max值也算是一个常量，只有正负的区别。我们知道每次缩放后偏移的xy是有一个最大的值，即max
4. 第二步得到的这个值已经超过我们前面求出的最大偏移值max，所以还需要再减去`max`，最终才是当前的偏移量

```js
// 计算每次的偏移量
x -= d * (mouseOffset.x - x) - max.x;
y -= d * (mouseOffset.y - y) - max.y;
image.style.transform = "translate3d(" + x + "px, " + y + "px, 0) scale(" + scale + ")";
```
