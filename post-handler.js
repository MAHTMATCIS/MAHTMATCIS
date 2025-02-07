// post-handler.js
exports.handler = async (event) => {
    const { method, body } = event;
    if (method === 'POST') {
        // 这里你可以添加你的后端逻辑，例如发送数据到另一个服务器
        const response = await fetch('https://your-api-endpoint.com/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(JSON.parse(body))
        });
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    }
    return { statusCode: 405, body: 'Method Not Allowed' };
};