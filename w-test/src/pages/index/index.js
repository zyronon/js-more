// import './index.html' //导入html，不然不会热更新
require('html-loader!./index.html')//导入html，不然不会热更新。注释掉上面的语法是因为，去年了webpack.config.js里面的html-loader的配置。
// 只能用require了
import './index.scss'
import '../../components/header/header'
// let w1 = require('../../assets/img/winxin1.jpg')
//let w2 = require('../../assets/img/winxin2.jpg')
import w1 from '../../assets/img/winxin1.jpg'
import w2 from '../../assets/img/winxin2.jpg'
import w3 from '../../assets/img/winxin3.jpg'
import w4 from '../../assets/img/winxin4.jpg'
import w5 from '../../assets/img/winxin5.jpg'
import w6 from '../../assets/img/winxin6.jpg'


let data = {
    navItemHeight: 0,
    colors: ['#dce2ee', '#d8ece3', '#ecd189', '#d4eca0', '#a6ecc4'],
    wxbg: [w1, w2, w3, w4, w5, w6]
}

let winxin = document.querySelectorAll('.winxin')
winxin.forEach(v => {
    v.addEventListener('click', function () {
        if (!$('.mask').hasClass('show')) {
            let random = Math.floor(Math.random() * Math.floor(data.wxbg.length))
            $('.winxin-dialog img').attr('src',  data.wxbg[random])
        }
        $('.mask').toggleClass('show')
        $('.winxin-dialog').toggleClass('show')
    })
})
