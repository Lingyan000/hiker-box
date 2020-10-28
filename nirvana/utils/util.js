const version = 0;

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == "object" &&
                Object.prototype.toString.call(obj).toLowerCase() ==
                "[object object]" &&
                !obj.length) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            return false;
        }
    }
    setError('It is not a string!');
}

function haveStatusCode(res) {
    if (!isJSON(res)) return false;
    res = JSON.parse(res);
    if (Object.prototype.hasOwnProperty.call(res, "body") && Object.prototype.hasOwnProperty.call(res, "statusCode")) return true;
    return false;
}

function request(url, param, noTips, needAll) {
    if (param) param["withStatusCode"] = true;
    let res = fetch(url, param || { withStatusCode: true });
    if (this.haveStatusCode(res)) {
        res = JSON.parse(res);
        if (res.statusCode == 200) {
            if (isJSON(res.body)) res.body = JSON.parse(res.body)
            if (needAll) return res;
            return res.body;
        } else {
            if (!noTips) setHomeResult({ data: [{ title: "‘返回错误！！！ Status Code:" + res.statusCode + "’", col_type: "text_1" }] });
            return;
        }
    } else {
        if (isJSON(res)) res = JSON.parse(res)
        return res;
    }
}