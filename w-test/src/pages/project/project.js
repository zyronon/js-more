import './project.scss'
// import './project.html' //导入html，不然不会热更新
require('html-loader!./project.html')//导入html，不然不会热更新。注释掉上面的语法是因为，去年了webpack.config.js里面的html-loader的配置。

import '../../components/header/header'



$('.project').on('mouseenter', function ($event) {

    $(this).append('<div class="bg-mark"></div>')
    let mark = $(this).find('.bg-mark')
    let descr = $(this).find('.description')

    let width = $(this).width()
    let height = $(this).height()

    let startX = $event.offsetX
    let startY = $event.offsetY
    // console.log(startX)
    // console.log(startY)

    let distance = 30
    if (startX < width / 2) {
        if (startY < height / 2) {
            //console.log('左上边')
            if (startX < distance) {
                mark.css({top: 0, left: -$(this).width()})
                descr.css({top: 0, left: -$(this).width()})
                //console.log('左边')
            }
            if (startY < distance) {
                mark.css({top: -$(this).height(), left: 0})
                descr.css({top: -$(this).height(), left: 0})
                //console.log('上边')
            }
        } else {
            if (startX < distance) {
                mark.css({top: 0, left: -$(this).width()})
                descr.css({top: 0, left: -$(this).width()})
                //console.log('左边')
            }
            if (height - startY < distance) {
                mark.css({top: $(this).height(), left: 0})
                descr.css({top: $(this).height(), left: 0})
                //console.log('下边')
            }
            //console.log('左下边')
        }
    } else {
        if (startY < height / 2) {
            mark.css({top: 0, left: $(this).width()})
            descr.css({top: 0, left: $(this).width()})

            if (startY < distance) {
                mark.css({top: -$(this).height(), left: 0})
                descr.css({top: -$(this).height(), left: 0})
                //console.log('上边')
            }
            if (width - startX < distance) {
                mark.css({top: 0, left: $(this).width()})
                descr.css({top: 0, left: $(this).width()})
                //console.log('右边')
            }
            //console.log('右上边')
        } else {
            mark.css({top: 0, left: $(this).width()})
            descr.css({top: 0, left: $(this).width()})
            if (width - startX < distance) {
                mark.css({top: 0, left: $(this).width()})
                descr.css({top: 0, left: $(this).width()})
                //console.log('右边')
            }
            if (height - startY < distance) {
                mark.css({top: $(this).height(), left: 0})
                descr.css({top: $(this).height(), left: 0})
                //console.log('下边')
            }
            //console.log('右下边')
        }
    }
    setTimeout(() => {
        mark.css({transition: 'all .2s', top: 0, left: 0})
        descr.css({transition: 'all .4s', top: 0, left: 0})
    }, 5)
})
$('.project').on('mouseleave', function ($event) {
    let distance = 30

    let mark = $(this).find('.bg-mark')
    let descr = $(this).find('.description')

    let width = $(this).width()
    let height = $(this).height()

    let startX = $event.offsetX
    let startY = $event.offsetY

    if (startX < width / 2) {
        if (startY < height / 2) {
            //console.log('左上边')
            if (startX < distance) {
                mark.css({top: 0, left: -$(this).width()})
                descr.css({top: 0, left: -$(this).width()})
                //console.log('左边')
            }
            if (startY < distance) {
                mark.css({top: -$(this).height(), left: 0})
                descr.css({top: -$(this).height(), left: 0})
                //console.log('上边')
            }
        } else {
            if (startX < distance) {
                mark.css({top: 0, left: -$(this).width()})
                descr.css({top: 0, left: -$(this).width()})
                //console.log('左边')
            }
            if (height - startY < distance) {
                mark.css({top: $(this).height(), left: 0})
                descr.css({top: $(this).height(), left: 0})
                //console.log('下边')
            }
            //console.log('左下边')
        }
    } else {
        if (startY < height / 2) {
            mark.css({top: 0, left: $(this).width()})
            descr.css({top: 0, left: $(this).width()})

            if (startY < distance) {
                mark.css({top: -$(this).height(), left: 0})
                descr.css({top: -$(this).height(), left: 0})
                //console.log('上边')
            }
            if (width - startX < distance) {
                mark.css({top: 0, left: $(this).width()})
                descr.css({top: 0, left: $(this).width()})
                //console.log('右边')
            }
            //console.log('右上边')
        } else {
            mark.css({top: 0, left: $(this).width()})
            descr.css({top: 0, left: $(this).width()})
            if (width - startX < distance) {
                mark.css({top: 0, left: $(this).width()})
                descr.css({top: 0, left: $(this).width()})
                //console.log('右边')
            }
            if (height - startY < distance) {
                mark.css({top: $(this).height(), left: 0})
                descr.css({top: $(this).height(), left: 0})
                //console.log('下边')
            }
            //console.log('右下边')
        }
    }
    setTimeout(() => {
        descr.css({transition: 'none'})
        mark.remove()
    }, 200)
})

$(function () {
    let navbar = $('.navbar')
    let offsetTop = navbar.offset().top

    $(window).on('scroll', function () {
        let scrollTop = $(window).scrollTop()
        if (scrollTop > offsetTop) {
            if (!navbar.hasClass('fixed')) {
                navbar.addClass('fixed')
            }
        } else {
            if (navbar.hasClass('fixed')) {
                navbar.removeClass('fixed')
            }
        }
    })
})
