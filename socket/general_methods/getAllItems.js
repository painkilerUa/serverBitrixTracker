const rp = require('request-promise');
const config = require('../../config');

module.exports = (method) => {
    return new Promise((resolve, reject) => {
        let items = [];
        getPartOfItems(0);
        function getPartOfItems(start){
            rp(config.bitrix24_api_url + method + '?start=' + start)
                .then((response) => {
                    let result = JSON.parse(response);
                    items = items.concat(result.result);
                    if(result.next !== undefined){
                        getPartOfItems(result.next)
                    }else{
                        resolve(items)
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        }
    })
}