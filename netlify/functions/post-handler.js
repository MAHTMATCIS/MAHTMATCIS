const {getStore} = require("@netlify/blobs");
const {response} = require("express");

const siteID = '11c8ee6b-b6e3-40e2-ac72-d318b943066f'; // 替换为实际的Site ID
const token = 'nfp_QiY2SXh1EsPKHR9wYRnRXFz6KDtheXYfcce2'; // 替换为实际的API Token


exports.handler = async (event) => {
  const { httpMethod, body } = event;
  function parseUserData(data) {
    let datas=data.split('\n');
    let result=[];
    for(let i=0; i<datas.length; i++) {
      result.push(JSON.parse(datas[i]))
    }
    return result
  }

  if (httpMethod === 'POST') {
    try {
      // 解析JSON body，假定body格式为{ username: 'username', password: 'password' }
      const parsedBody = JSON.parse(body);
      console.log('Received POST request with body:', parsedBody);

      if (parsedBody.type==="register"){
        const storage=getStore({
            name:'deploy',
            siteID:siteID,
            token:token
        });


        let data = {
          username: parsedBody.username,
          password: parsedBody.password,
          data: ""
        };

        data=JSON.stringify(data);
        let from=await storage.get('userData');

        let datas=parseUserData(from);
        for (let i=0; i<datas.length; i++) {
          if (datas[i].username===parsedBody.username)
            return {
              statusCode: 400, body: JSON.stringify({type:"error", message: 'Register failure', data: 'User already exists!' })
            }
        }

        console.log(`data from the storage`,from,'type of:',typeof from);

        if (from !== null){
          data=from+"\n"+data;
        }
        await storage.set('userData', data);
        console.log(`File uploaded successfully. Blob data: ${data}`);

        return {
          statusCode: 200,
          body: JSON.stringify({type:"info",  message: 'User data recorded successfully', data: `User registered successfully. Data:"${data}"` })
        };
      }else if(parsedBody.type==="login"){

      }
    } catch (error) {
      console.error('Error processing the request:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({type:"error",  message: 'Error processing the request' ,data:error.toString()})
      };
    }
  } else {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({type:"error",  message: 'Only POST method is allowed for user login' ,data:'null'})
    };
  }
};
