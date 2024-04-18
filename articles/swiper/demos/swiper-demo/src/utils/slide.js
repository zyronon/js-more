import Utils from './util.js'
import GM from './util.js'
import {nextTick} from 'vue'

export const SlideType = {
  HORIZONTAL: 0,
  VERTICAL: 1
}

//初始化信息，获取slide dom的长宽、子元素数量，用于move事件判断能否滑动
export function slideInit(el, state, type) {
  state.wrapper.width = GM.$getCss(el, 'width')
  state.wrapper.height = GM.$getCss(el, 'height')
  nextTick(() => {
    state.wrapper.childrenLength = el.children.length
  })

  //获取偏移量
  let t = getSlideOffset(state, type, el)
  let dx1 = 0, dx2 = 0
  if (type === SlideType.HORIZONTAL) dx1 = t
  else dx2 = t
  Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
}

export function slidePointerDown(e, el, state) {
  console.log('down', state.name)
  Utils.$setCss(el, 'transition-duration', `0ms`)
  //设置是否按下tag，因为move事件会一直触发，这里需要一个变量来标识是否已按下
  state.isDown = true
  //记录起点坐标，用于move事件计算移动距离
  state.start.x = e.pageX
  state.start.y = e.pageY
  //记录按下时间，用于up事件判断滑动时间
  state.start.time = Date.now()
}

/**
 * 检测能否滑动
 * @param state
 * @returns {boolean}
 */
export function canSlide(state, type = SlideType.HORIZONTAL) {
  //每次按下都需要检测，up事件会重置为true
  if (state.needCheck) {
    //判断move x和y的距离是否大于判断值，因为距离太小无法判断滑动方向
    if (Math.abs(state.move.x) > state.judgeValue || Math.abs(state.move.y) > state.judgeValue) {
      //放大再相除，根据长宽比判断方向，angle大于1就是左右滑动，小于是上下滑动
      let angle = (Math.abs(state.move.x) * 10) / (Math.abs(state.move.y) * 10)
      //根据当前slide的类型，判断能否滑动，并记录下来，后续不再判断，直接返回记录值
      state.next = type === SlideType.HORIZONTAL ? angle > 1 : angle <= 1
      // console.log('angle', angle, state.next)
      state.needCheck = false
    } else {
      return false
    }
  }
  return state.next
}

/**
 * @param slideOtherDirectionCb 滑动其他方向时的回调，目前用于图集进于放大模式后，上下滑动推出放大模式
 * */
export function slidePointerMove(e, el, state, judgeValue, canNextCb, nextCb, type = SlideType.HORIZONTAL, notNextCb, slideOtherDirectionCb = null) {
  if (!state.isDown) {
    return
  }

  state.move.x = e.pageX - state.start.x
  state.move.y = e.pageY - state.start.y

  console.log('move', state.name)

  let isNext = type === SlideType.HORIZONTAL ? state.move.x < 0 : state.move.y < 0

  let canSlideRes = canSlide(state, type)

  if (canSlideRes && state.localIndex === 0 && !isNext && type === SlideType.VERTICAL) {
    // bus.emit(state.name + '-moveY', state.move.y)
  }

  if (canSlideRes) {
    if (canNextCb?.(isNext, e)) {
      nextCb?.()
      if (type === SlideType.HORIZONTAL) {
        // bus.emit(state.name + '-moveX', state.move.x)
      }

      Utils.$stopPropagation(e)
      let t = getSlideOffset(state, type, el) + (isNext ? judgeValue : -judgeValue)
      let dx1 = 0
      let dx2 = 0
      if (type === SlideType.HORIZONTAL) {
        dx1 = t + state.move.x
      } else {
        dx2 = t + state.move.y
      }
      Utils.$setCss(el, 'transition-duration', `0ms`)
      Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
    } else {
      notNextCb?.()
    }
  } else {
    slideOtherDirectionCb?.(e)
  }
}

export function slidePointerUp(e, state, canNextCb, nextCb, doNotNextCb, type = SlideType.HORIZONTAL) {
  state.isDown = false

  let isHorizontal = type === SlideType.HORIZONTAL
  let isNext = isHorizontal ? state.move.x < 0 : state.move.y < 0

  console.log('up', state.name, state.next)
  if (!canNextCb?.(isNext)) return doNotNextCb?.()
  if (state.next) {
    //用pointer事件，子元素在这里拦截事件之后，会导致父元素触发一次pointermove事件
    //用touch事件，不会出现这种情况
    // Utils.$stopPropagation(e)
    let endTime = Date.now()
    let gapTime = endTime - state.start.time
    let distance = isHorizontal ? state.move.x : state.move.y
    let judgeValue = isHorizontal ? state.wrapper.width : state.wrapper.height
    if (Math.abs(distance) < 20) gapTime = 1000
    if (Math.abs(distance) > judgeValue / 3) gapTime = 100
    if (gapTime < 150) {
      if (isNext) {
        state.localIndex++
      } else {
        state.localIndex--
      }
      return nextCb?.(isNext)
    }
  }
  doNotNextCb?.()
}

export function slideReset(el, state, type, emit) {
  Utils.$setCss(el, 'transition-duration', `300ms`)
  let t = getSlideOffset(state, type, el)
  let dx1 = 0
  let dx2 = 0
  if (type === SlideType.HORIZONTAL) {
    // bus.emit(state.name + '-end', state.localIndex)
    dx1 = t
  } else {
    // bus.emit(state.name + '-end')
    dx2 = t
  }
  Utils.$setCss(el, 'transform', `translate3d(${dx1}px, ${dx2}px, 0)`)
  state.start.x = state.start.y = state.start.time = state.move.x = state.move.y = 0
  state.next = false
  state.needCheck = true
  emit?.('update:index', state.localIndex)
}

//根据当前index，获取slide偏移距离
//如果每个页面的宽度是相同均为100%，只需要当前index * wrapper的宽（高）度即可： -state.localIndex * state.wrapper.width
export function getSlideOffset(state, type = SlideType.HORIZONTAL, el) {
  //横竖判断逻辑基本同理
  if (type === SlideType.HORIZONTAL) {
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
  } else {
    //同上
    let heights = []
    Array.from(el.children).map((v) => {
      heights.push(v.getBoundingClientRect().height)
    })
    heights = heights.slice(0, state.localIndex)
    if (heights.length) {
      return -heights.reduce((a, b) => a + b)
    }
  }
  return 0
}
