const version = 0;

function isJSON(str) {
    if (typeof str == "string") {
        try {
            var obj = JSON.parse(str);
            if (
                typeof obj == "object" &&
                Object.prototype.toString.call(obj).toLowerCase() ==
                "[object object]" &&
                !obj.length
            ) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    setError("It is not a string!");
}

function haveStatusCode(res) {
    if (!isJSON(res)) return false;
    res = JSON.parse(res);
    if (
        Object.prototype.hasOwnProperty.call(res, "body") &&
        Object.prototype.hasOwnProperty.call(res, "statusCode")
    )
        return true;
    return false;
}

function request(url, param, noTips, needAll) {
    if (param) param["withStatusCode"] = true;
    let res = fetch(url, param || { withStatusCode: true });
    if (this.haveStatusCode(res)) {
        res = JSON.parse(res);
        if (res.statusCode == 200) {
            if (isJSON(res.body)) res.body = JSON.parse(res.body);
            if (needAll) return res;
            return res.body;
        } else {
            if (!noTips)
                setHomeResult({
                    data: [
                        {
                            title: "““返回错误！！！ Status Code:" + res.statusCode + "””",
                            col_type: "text_center_1",
                        },
                    ],
                });
            return "hiker request error";
        }
    } else {
        if (isJSON(res)) res = JSON.parse(res);
        return res;
    }
}

function getUrlPath(url) {
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);
    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

function getUrlDomain(url) {
    var arrUrl = url.split(getUrlPath(url));
    var domain = arrUrl[0];
    return domain;
}

function GetUrlParam(url) {
    if (url.indexOf("?") != -1) {
        var arrUrl = url.split("?");
        var param = arrUrl[1];
    } else {
        var param = null;
    }
    return param;
}

function getDoubanResources(method, url, param) {
    eval(getCryptoJS());
    let ts = Math.round(new Date() / 1000);
    let path = getUrlPath(url);
    let str = method + "&" + encodeURIComponent(path) + "&" + ts;
    let sig = encodeURIComponent(
        CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(str, "bf7dddc7c9cfe6f7"))
    );
    let domain = getUrlDomain(url);
    let body = GetUrlParam(url);
    let requestUrl =
        domain +
        path +
        "?&apikey=0dad551ec0f84ed02907ff5c42e8ec70" +
        "&_sig=" +
        sig +
        "&_ts=" +
        ts +
        (body ? "&" + body : "");
    let res = request(requestUrl, param || {
        headers: {
            "User-Agent": "api-client/1 com.douban.frodo/6.44.0(196)"
        }
    });
    return res;
}
