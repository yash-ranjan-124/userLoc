let jwt = require('jwt-simple')

class JWT{
    constructor(){
        this.secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');
    }

    encode(payload){
        let token = jwt.encode(payload,this.secret);
        return token;
    }

    decode(token){
        let payload = jwt.decode(token,this.secret);
        return payload;
    }
}

module.exports = new JWT();