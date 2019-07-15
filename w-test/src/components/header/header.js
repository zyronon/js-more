import './header.scss'
require('html-loader!./header.html')//导入html，不然不会热更新。

if (document.readyState !== 'loading') {
    onload()
} else {
    document.addEventListener('DOMContentLoaded', onload)
}
function onload() {
    let spans = document.querySelectorAll('.animated')
    spans.forEach(v => {
        v.addEventListener('mouseenter', function () {
            v.classList.add('bounce')
            v.addEventListener('animationend', function () {
                v.classList.remove('bounce')
            })
        })
    })
}
