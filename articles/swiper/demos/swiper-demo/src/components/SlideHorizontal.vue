<script setup>
import {onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import GM from '../utils/util.js'
import {
  getSlideOffset,
  slideInit,
  slideReset,
  slidePointerUp,
  slidePointerMove,
  slidePointerDown
} from '../utils/slide.js'

const SlideType = {
  HORIZONTAL: 0,
  VERTICAL: 1
}
const props = defineProps({
  index: {
    type: Number,
    default: () => {
      return 0
    }
  },
  name: {
    type: String,
    default: () => ''
  },
  //改变index，是否使用动画
  changeActiveIndexUseAnim: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:index'])

let ob = null
const judgeValue = 20
const wrapperEl = ref(null)
const state = reactive({
  judgeValue:20,
  name: props.name,
  localIndex: props.index,
  needCheck: true,
  next: false,
  start: {x: 0, y: 0, time: 0},
  move: {x: 0, y: 0},
  wrapper: {
    width: 0,
    height: 0,
    childrenLength: 0
  },
  isDown: false
})

watch(
    () => props.index,
    (newVal) => {
      if (state.localIndex !== newVal) {
        state.localIndex = newVal
        if (props.changeActiveIndexUseAnim) {
          GM.$setCss(wrapperEl.value, 'transition-duration', `300ms`)
        }
        GM.$setCss(
            wrapperEl.value,
            'transform',
            `translate3d(${getSlideOffset(state, SlideType.HORIZONTAL, wrapperEl.value)}px, 0, 0)`
        )
      }
    }
)

onMounted(() => {
  slideInit(wrapperEl.value, state, SlideType.HORIZONTAL)

  //观察子元素数量变动，获取最新数量
  //childrenLength用于canNext方法判断当前页是否是最后一页，是则不能滑动，不捕获事件
  ob = new MutationObserver(() => {
    state.wrapper.childrenLength = wrapperEl.value.children.length
  })
  ob.observe(wrapperEl.value, {childList: true})
})

onUnmounted(() => {
  ob.disconnect()
})

function pointerDown(e) {
  slidePointerDown(e, wrapperEl.value, state)
}

function pointerMove(e) {
  slidePointerMove(
      e,
      wrapperEl.value,
      state,
      judgeValue,
      canNext,
      null,
      SlideType.HORIZONTAL,
      null,
      null
  )
}

function pointerUp(e) {
  slidePointerUp(e, state, canNext, () => {
  })
  slideReset(wrapperEl.value, state, SlideType.HORIZONTAL, emit)
}

function canNext(isNext) {
  return !(
      (state.localIndex === 0 && !isNext) ||
      (state.localIndex === state.wrapper.childrenLength - 1 && isNext)
  )
}

function pointerLeave(e) {
  pointerUp(e)
}
</script>

<template>
  <div class="slide horizontal">
    <div
        class="slide-list"
        ref="wrapperEl"
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerUp"
        @pointerleave="pointerLeave"
    >
      <slot></slot>
    </div>
  </div>
</template>
