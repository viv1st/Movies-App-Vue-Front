export const fetchData = async (url, method, additionalHeaders = {}, body = {}) => {
    const baseOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
            ...additionalHeaders
        }
    }
    if(method !== "HEAD" && method !== "GET" && Object.keys(body).length > 0)  baseOptions.body = JSON.stringify(body)

    try {
        const response = await fetch(url, { ...baseOptions, method: method });
        

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Session expired");
            }
            else throw new Error(response.status)
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
}