const API_DOMAIN = "https://localhost:7199/api";
export const get = async (path: string) => {
    const response = await fetch(`${API_DOMAIN}/${path}`);
    const result = await response.json();
    return result;

}
export const post = async (data: {}, path: string) => {
    const response = await fetch(`${API_DOMAIN}/${path}`, {
        method: "POST",
        headers: {
            Accept: "application/json"
            , "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    return result;

}
export const patch = async (path: string, data: {}) => {
    const response = await fetch(`${API_DOMAIN}/${path}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json"
            , "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;

}
export const put = async (path: string, data: {}) => {
    try {
        const response = await fetch(`${API_DOMAIN}/${path}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text(); // Read the response as text first
        return text ? JSON.parse(text) : null; // Parse it if there's something to parse
    } catch (error) {
        console.error("Error during PUT request:", error);
        return null;
    }
};

export const deleteRequest = async (path: string) => {
    try {
        const response = await fetch(`${API_DOMAIN}/${path}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : 'Delete successful';
    } catch (error) {
        console.error("Error during DELETE request:", error);
        throw error;
    }
};
