// import toastr from 'toastr';
// import 'toastr/build/toastr.min.css';

export function getAuthenticated() {

    const token = getCookie('token')

    // checks if token evaluates to false
    // - token === undefined
    // - token === null
    // - token === ""
    if (!token || token === "undefined" || token === "null") {
        return false
    }
    return true
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function showToastMessage(type, msg) {
    console.log(type, msg)
    // if (type === "error") {
    //     toastr.error(msg)
    // }
    // if (type === "success") {
    //     toastr.success(msg)
    // }
    // return
}

