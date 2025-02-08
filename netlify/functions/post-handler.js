const {getStore} = require("@netlify/blobs");

exports.handler = async (event) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    try {
      // 解析JSON body，假定body格式为{ username: 'username', password: 'password' }
      const parsedBody = JSON.parse(body);
      console.log('Received POST request with body:', parsedBody);


      const construction = getStore("construction");

      await construction.setJSON("nails", { type: "common", finish: "bright" });


      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User data recorded successfully' })
      };
    } catch (error) {
      console.error('Error processing the request:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Error processing the request' })
      };
    }
  } else {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ error: 'Only POST method is allowed for user login' })
    };
  }
};
