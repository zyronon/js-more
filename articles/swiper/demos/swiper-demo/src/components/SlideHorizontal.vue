<script setup>
import {onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import GM from '../utils/util.js'
import {
  getSlideDistance,
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
  name: props.name,
  localIndex: props.index,
  needCheck: true,
  next: false,
  start: {x: 0, y: 0, time: 0},
  move: {x: 0, y: 0},
  wrapper: {width: 0, height: 0, childrenLength: 0},
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
            `translate3d(${getSlideDistance(state, SlideType.HORIZONTAL, wrapperEl.value)}px, 0, 0)`
        )
      }
    }
)

onMounted(() => {
  slideInit(wrapperEl.value, state, SlideType.HORIZONTAL)

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
</script>

<template>
  <div class="slide horizontal">
    <div
        class="slide-list"
        ref="wrapperEl"
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerUp"
    >
      <slot></slot>
    </div>
  </div>
</template>
