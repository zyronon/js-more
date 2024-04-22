import Utils from './util.js'
import {nextTick} from 'vue'

export const SlideType = {
  HORIZONTAL: 0,
  VERTICAL: 1
}

//初始化信息，获取slide dom的长宽、子元素数量，用于move事件判断能否滑动
export function slideInit(el, state) {
  state.wrapper.width = Utils.$getCss(el, 'width')
  state.wrapper.height = Utils.$getCss(el, 'height')
  nextTick(() => {
    state.wrapper.childrenLength = el.children.length
  })

  //获取偏移量
  let t = getSlideOffset(state, el)
  let dx1 = 0,
    dx2 = 0
  if (state.type === SlideType.HORIZONTAL) dx1 = t
  else dx2 = t
  Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
}

export function slidePointerDown(e, el, state) {
  Utils.$setCss(el, 'transition-duration', `0ms`)
  //记录起点坐标，用于move事件计算移动距离
  state.start.x = e.pageX
  state.start.y = e.pageY
  //记录按下时间，用于up事件判断滑动时间
  state.start.time = Date.now()
  state.isDown = true
}

/**
 * 检测在对应方向上能否允许滑动，比如SlideHorizontal组件就只处理左右滑动事件，SlideVertical只处理上下滑动事件
 * @param state
 * @returns {boolean}
 */
export function canSlide(state) {
  //每次按下都需要检测，up事件会重置为true
  if (state.needCheck) {
    //判断move x和y的距离是否大于判断值，因为距离太小无法判断滑动方向
    if (Math.abs(state.move.x) > state.judgeValue || Math.abs(state.move.y) > state.judgeValue) {
      //放大再相除，根据长宽比判断方向，angle大于1就是左右滑动，小于是上下滑动
      let angle = (Math.abs(state.move.x) * 10) / (Math.abs(state.move.y) * 10)
      //根据当前slide的类型，判断能否滑动，并记录下来，后续不再判断，直接返回记录值
      state.next = state.type === SlideType.HORIZONTAL ? angle > 1 : angle <= 1
      // console.log('angle', angle, state.name, state.next, state.type, state.type === SlideType.HORIZONTAL)
      state.needCheck = false
    } else {
      return false
    }
  }
  return state.next
}

/**
 * 能否继续滑动
 * @param state
 * @param isNext 朝向，向右或向下
 * @returns {boolean}
 */
function canNext(state, isNext) {
  return !(
    (state.localIndex === 0 && !isNext) ||
    (state.localIndex === state.wrapper.childrenLength - 1 && isNext)
  )
}

/**
 * move事件
 * @param e
 * @param el
 * @param state
 */
export function slidePointerMove(
  e,
  el,
  state,
) {
  if (!state.isDown) return;

  //计算移动距离
  state.move.x = e.pageX - state.start.x
  state.move.y = e.pageY - state.start.y

  //检测能否滑动
  let canSlideRes = canSlide(state)

  //是否是往下（右）滑动
  let isNext = state.type === SlideType.HORIZONTAL ? state.move.x < 0 : state.move.y < 0

  if (canSlideRes) {
    if (canNext(state, isNext)) {
      //能滑动，那就把事件捕获，不能给父组件处理
      Utils.$stopPropagation(e)
      // console.log('move-name',state.name,canSlideRes)

      //获取偏移量
      let t = getSlideOffset(state, el) + (isNext ? state.judgeValue : -state.judgeValue)
      let dx1 = 0,
        dx2 = 0
      //偏移量加当前手指移动的距离就是slide要偏移的值
      if (state.type === SlideType.HORIZONTAL) {
        dx1 = t + state.move.x
      } else {
        dx2 = t + state.move.y
      }
      Utils.$setCss(el, 'transition-duration', `0ms`)
      Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
    }
  }
}

/**
 * 滑动结束事件
 * @param e
 * @param state
 * @returns {*}
 */
export function slidePointerUp(e, state) {

  if (!state.isDown) return;

  let isHorizontal = state.type === SlideType.HORIZONTAL
  let isNext = isHorizontal ? state.move.x < 0 : state.move.y < 0

  if (state.next) {
    //同move事件
    if (canNext(state, isNext)) {
      // console.log('end-name', state.name)

      //能滑动，那就把事件捕获，不能给父组件处理
      // Utils.$stopPropagation(e)
      //结合时间、距离来判断是否成功滑动
      let endTime = Date.now()
      let gapTime = endTime - state.start.time
      let distance = isHorizontal ? state.move.x : state.move.y
      let judgeValue = isHorizontal ? state.wrapper.width : state.wrapper.height
      //1、距离太短，直接不通过
      if (Math.abs(distance) < 20) gapTime = 1000
      //2、距离太长，直接通过
      if (Math.abs(distance) > judgeValue / 3) gapTime = 100
      //3、若不在上述两种情况，那么只需要判断时间即可
      if (gapTime < 150) {
        if (isNext) {
          state.localIndex++
        } else {
          state.localIndex--
        }
      }
    }
  }
}

/**
 * 结束后重置变量
 * @param e
 * @param el
 * @param state
 * @param emit
 */
export function slideReset(e, el, state, emit = null) {
  Utils.$setCss(el, 'transition-duration', `300ms`)
  let t = getSlideOffset(state, el)
  let dx1 = 0
  let dx2 = 0
  if (state.type === SlideType.HORIZONTAL) {
    dx1 = t
  } else {
    dx2 = t
  }
  Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
  state.start.x = state.start.y = state.start.time = state.move.x = state.move.y = 0
  state.next = false
  state.needCheck = true
  state.isDown = false
  emit?.('update:index', state.localIndex)
}

//根据当前index，获取slide偏移距离
//如果每个页面的宽度是相同均为100%，只需要当前index * wrapper的宽（高）度即可： -state.localIndex * state.wrapper.width
export function getSlideOffset(state, el) {
  //横竖判断逻辑基本同理
  if (state.type === SlideType.HORIZONTAL) {
    let widths = []
    //获取所有子元素的宽度
    Array.from(el.children).map((v) => {
      widths.push(v.getBoundingClientRect().width)
    })
    //取0到当前index的子元素的宽度
    widths = widths.slice(0, state.localIndex)
    if (widths.length) {
      //累计就是当前index之前所有页面的宽度
      return -widths.reduce((a, b) => a + b)
    }
    return 0
    // return -state.localIndex * state.wrapper.width
  } else {
    if (state.type === SlideType.VERTICAL_INFINITE) {
      //同上
      let heights = []
      Array.from(el.children).map((v) => {
        heights.push(v.getBoundingClientRect().height)
      })
      heights = heights.slice(0, state.localIndex)
      if (heights.length) return -heights.reduce((a, b) => a + b)
      return 0
    } else {
      //VERTICAL_INFINITE 列表只需要计算index * 高就行
      return -state.localIndex * state.wrapper.height
    }
  }
}
