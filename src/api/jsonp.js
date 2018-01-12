import originJsonp from "jsonp";

let buildUrl = (url, data) => {
    let params = [];
    for (var k in data) {
        params.push(`${k}=${data[k]}`);
    }
    let param = params.join("&");
    if (url.indexOf("?") === -1) {
        url += "?" + param;
    } else {
        url += "&" + param;
    }
    return url;
};
let jsonp = (url, data, option) => {
    return new Promise((resolve, reject) => {
        originJsonp(buildUrl(url, data), option, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};

export default jsonp;
