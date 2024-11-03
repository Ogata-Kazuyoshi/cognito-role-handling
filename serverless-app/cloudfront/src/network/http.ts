import axios, {AxiosRequestConfig} from 'axios'

export interface Http {
    post<B, R> (url: string, requestBody: B, config?: AxiosRequestConfig): Promise<R>
    get<R> (url: string): Promise<R>
    delete<R> (url: string): Promise<R>
}

export class HttpClient implements Http {

    async post<B, R> (url: string, requestBody: B, config?: AxiosRequestConfig): Promise<R> {
        return axios
            .post(url, requestBody, config)
            .then((res) => res.data)
            .catch((error) => {
                if (error.code === 'ECONNABORTED') {
                    console.error('POST Request:', error.name, error.message)
                } else {
                    console.error(error)
                }
                return error
            })
    }

    async get<R>(url: string): Promise<R> {
        return axios
            .get(url)
            .then(res => res.data)
    }

    async delete<R>(url: string): Promise<R> {
        return await axios.delete(url)
            .then(res => res.data)
    }
}
