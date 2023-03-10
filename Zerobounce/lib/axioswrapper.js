let axios = require('axios')

//Dont forget to Npm install the axios wrapper

class AxiosWrapper {
    request(url, opt = {}) {
        let {
            method: methodValue = 'get',
            headers: headerValue = {},
            data: dataValue = {},
        } = opt

        let t = this
        return new Promise(async (resolve, reject) => {
            axios({
                url,
                method: methodValue,
                headers: headerValue,
                data: dataValue,
            }).then(response => {
                resolve(t._responseResolve(response))
            }).catch(err => {
                resolve(t._responseReject(err))
            })
        })
    }
    _responseResolve(response) {
        let {
            status: statusValue,
            headers: headerValue,
            data: dataValue
        } = response
        return {
            status: true,
            statusCode: statusValue,
            header: headerValue,
            error: false,
            data: dataValue
        }
    }
    _responseReject(err) {
        let {
            response,
            request,
            message
        } = err

        let statusCodeValue = false
        let headerValue = []
        let errValue = message
        if (response) {
            statusCodeValue = response.status
            headerValue = response.headers
            errValue = response.data
        } else if (request) {
            errValue = request
        }

        return {
            status: false,
            statusCode: statusCodeValue,
            header: headerValue,
            error: errValue,
            data: false
        }
    }
}

module.exports = AxiosWrapper