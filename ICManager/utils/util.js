
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

exports.replaceSpecialCharacters = (str) => {
    let temp = str ?? '';
    if (temp.length > 0) {
        temp = temp.replace(/\\n/g, "\\n");
        temp = temp.replace(/\\'/g, "\\'");
        temp = temp.replace(/\\"/g, '\\"');
        temp = temp.replace(/\\&/g, "\\&");
        temp = temp.replace(/\\r/g, "\\r");
        temp = temp.replace(/\\t/g, "\\t");
        temp = temp.replace(/\\b/g, "\\b");
        temp = temp.replace(/\\f/g, "\\f");
        temp = temp.replace(/[\u0000-\u0019]+/g, "");
    }
    return temp;
}