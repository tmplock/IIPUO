$(document).ready(function(){
    if (window.addEventListener) {
        window.addEventListener('contextmenu', function(e) { try { if (typeof e != 'undefined') { e.preventDefault(); return false; } else { return false; }} catch(e) {} } , false);
    } else {
        window.attachEvent('oncontextmenu', function(e) { try { if (typeof e != 'undefined') { e.preventDefault(); return false; } else { return false; }} catch(e) {} } );
    }
    var handlemouseEvent = function(e) {
        try {
            if (typeof e == 'undefined') {
                if (window.event.button && window.event.button == "2") {
                    return false;
                }
            } else if ((e.which && e.which == 3) || (e.button && e.button == 2)) {
                e.preventDefault();
                return false;
            }

        } catch (e) {}
    };
    window.onkeydown = handlemouseEvent;
    window.onkeyup = handlemouseEvent;
    //-
    function detectDevTool(allow) {
        var a = false;
        if(isNaN(+allow)) allow = 100;
        var start = +new Date();
        debugger;
        var end = +new Date(); // Validates too.
        if(isNaN(start) || isNaN(end) || end - start > allow) {
            window.location.href = '/account/logout';
        }
    }
    if(window.attachEvent) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            detectDevTool();
            window.attachEvent('onresize', detectDevTool);
            window.attachEvent('onmousemove', detectDevTool);
            window.attachEvent('onfocus', detectDevTool);
            window.attachEvent('onblur', detectDevTool);
        } else {
            setTimeout(argument.callee, 0);
        }
    } else {
        window.addEventListener('load', detectDevTool);
        window.addEventListener('resize', detectDevTool);
        window.addEventListener('mousemove', detectDevTool);
        window.addEventListener('focus', detectDevTool);
        window.addEventListener('blur', detectDevTool);
    }
    //-
});

// Detect Key Shortcuts
window.addEventListener('keydown', function(e) {
    if (
        // CMD + Alt + I (Chrome, Firefox, Safari)
        e.metaKey == true && e.altKey == true && e.keyCode == 73 ||
        // CMD + Alt + J (Chrome)
        e.metaKey == true && e.altKey == true && e.keyCode == 74 ||
        // CMD + Alt + C (Chrome)
        e.metaKey == true && e.altKey == true && e.keyCode == 67 ||
        // CMD + Shift + C (Chrome)
        e.metaKey == true && e.shiftKey == true && e.keyCode == 67 ||
        // Ctrl + Shift + I (Chrome, Firefox, Safari, Edge)
        e.ctrlKey == true && e.shiftKey == true && e.keyCode == 73 ||
        // Ctrl + Shift + J (Chrome, Edge)
        e.ctrlKey == true && e.shiftKey == true && e.keyCode == 74 ||
        // Ctrl + Shift + C (Chrome, Edge)
        e.ctrlKey == true && e.shiftKey == true && e.keyCode == 67 ||
        // F12 (Chome, Firefox, Edge)
        e.keyCode == 123 ||
        // CMD + Alt + U, Ctrl + U (View source: Chrome, Firefox, Safari, Edge)
        e.metaKey == true && e.altKey == true && e.keyCode == 85 ||
        e.ctrlKey == true && e.keyCode == 85
    ) {
        e.preventDefault();
        return false;
    }
});