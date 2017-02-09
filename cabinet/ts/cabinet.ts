/// <reference path="typings/index.d.ts" />
/// <reference path="src/model.ts" />
/// <reference path="src/view.ts" />
/// <reference path="src/controller.ts" />
$('document').ready(function(){
    let app = new Controller();
    app.hideLoader();
    setTimeout(function () {
        let nav = $('.nav')[0],
            offset = $(nav).offset().top;
        nav.setAttribute('data-offset-top', offset.toString());
    }, 1000);
});
