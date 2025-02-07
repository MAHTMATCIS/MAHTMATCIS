// post-handler.js
exports.handler = async (event) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    try {
      // 解析JSON body
      const parsedBody = JSON.parse(body);
      console.log('Received POST request with body:', parsedBody);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data received successfully' })
      };
    } catch (error) {
      console.error('Error parsing JSON body:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format' })
      }
    }
  } else {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ error: 'Only POST method is allowed' })
    };
  }
};