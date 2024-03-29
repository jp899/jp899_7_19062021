class APIConnection {
    constructor () {
    this.urlRoot = 'http://localhost:3000/'
    }
  
    headers(withFormData) {
        const contentType = withFormData ? {} : {'Content-Type': 'application/json'};
        return { ...contentType, Accept:'application/json', Authorization: 'Bearer ' + localStorage.getItem('userToken')};
    }

    async resultHandle(result){
        if(result.ok){
            return result.json();
        }
        else if(result.status === 429){
            throw new Error("ERREUR " + result.status + " apiMessage:" + "Too Many Requests");
        }
        else{
            const error = await result.json();
            if(error.error){
                throw new Error("ERREUR " + result.status + " apiMessage:" + error.error);
            } else {
                throw new Error("ERREUR " + result.status);
            }
        }
    }
  
    async get(endpoint) {
        const result = await fetch(this.urlRoot + endpoint, {headers: this.headers()});
        return await this.resultHandle(result);
    }
  
    async post(endpoint, body, withFormData = false) {
        const result = await fetch(this.urlRoot + endpoint, {
            method: 'POST',
            body: withFormData ? body : JSON.stringify(body),
            headers: this.headers(withFormData)}
        );
        return await this.resultHandle(result);
    }
  
    async delete(endpoint) {
        const result = await fetch(this.urlRoot + endpoint, {method: 'DELETE', headers: this.headers()});
        return await this.resultHandle(result);
    }
  
    async put(endpoint, body, withFormData = false) {
        const result = await fetch(this.urlRoot + endpoint, {
            method: 'PUT',
            body: withFormData ? body : JSON.stringify(body),
            headers: this.headers(withFormData)}
        );
        return await this.resultHandle(result);
    }
}

const apiConnection = new APIConnection();
  
export default apiConnection;