const cookieName = '加油广东'
const signurlKey = 'chavy_signurl_gdoil'
const signheaderKey = 'chavy_signheader_gdoil'
const chavy = init()
const value = 'https://gha.ghac.cn:8805/task/app/api/sign/save'
const headers = {
    'X-Access-Token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiNjVjZTQ4YzVmMzU0MTQ2OTBkZjg5MDQ5NjdlMWFlNSIsImV4cCI6MTcwNTQ2ODIyNCwidXNlcklkIjoiMTczOTk0MDU3MDk1NDA3NjE2MCIsImlhdCI6MTcwNTM4MTgyNH0.q_BxRIU0ARIf420161nFTkMOERl9oZv_h-lse8c6a50',
    'customerCode':'e7803471a1994110bb61b8244bd22ad6'
}

sign()

function sign() {
    const url = { value, headers}
    url.body = '{}'
    chavy.get(url, (error, response, data) => {
        chavy.log(`${cookieName}, data: ${data}`)
        const result = JSON.parse(data)
        const title = `${cookieName}`
        let subTitle = ''
        let detail = ''
        if (result.success === true) {
            subTitle = `签到结果: 成功`
        } else {
            if (result.message.indexOf('今天已经签到') >= 0) subTitle = `签到结果: 成功 (重复签到)`
            else subTitle = `签到结果: 失败`
            detail = `说明: ${result.message}`
        }
        chavy.msg(title, subTitle, detail)
        chavy.done()
    })
}

function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}