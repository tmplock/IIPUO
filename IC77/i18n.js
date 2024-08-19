const i18n = require('i18n');

i18n.configure({
    locales:['en', 'ko', 'jp'],
    directory:__dirname + '/locales',
    defaultLocale:'ko',
    cookie:'unover_lang',
});

module.exports = (req, res, next) => {

    // lang 쿠키가 없으면 jp 로 설정시킨다.

    if(!req.cookies.unover_lang) {
        res.cookie('unover_lang', 'ko');
    }

    // let {lang} = req.query;
    // lang = lang ? lang : 'jp';

    // console.log(lang);

    i18n.init(req, res);
    res.locals.__ = res.__;

    // var current_locale = i18n.getLocale();
    // i18n.setLocale(req, current_locale);
    // console.log(current_locale);

    return next();
}