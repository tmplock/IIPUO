
exports.checkBlockCharSpecial = (id) => {
    const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
    if (id.match(regExp)) {
        return true;
    }
    return false;
}

exports.checkBlockCharNickname = (id) => {
    var regExp = /[ \{\}\[\]\/?.,;:|\)`\-┼<>\#%&\'\"\\\(\=]/gi;
    if (id.match(regExp)) {
        return true;
    }
    return false;
}

exports.checkBlockNum = (id) => {
    var regExp = /[^0-9]/g;
    if (id.match(regExp)) {
        return true;
    }
    return false;
}