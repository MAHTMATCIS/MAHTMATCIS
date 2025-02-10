const {getStore} = require("@netlify/blobs");
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

//
app.use(cors());

function encrypt(text) {
  // 将中文字符串转换为Buffer，以便进行加密处理
  const buffer = Buffer.from(text, 'utf8');

  // 创建一个SHA256的哈希对象
  const hash = crypto.createHash('sha256');

  // 更新哈希内容
  hash.update(buffer);

  // 获取哈希的 hexadecimal 字符串表示形式
  return hash.digest('hex');

}


const headers={
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":"Content-Type, Authorization, content-type, authorization, Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With, Authorization, Content-Type, X-Requested-With, Accept, Accept-Language, Origin, Cache-Control, Pragma, Expires, Range, DNT, X-XSRF-TOKEN, X-Traceid, X-Gseq, Traceid, Token, X-Language-Category, x-timestamp, yxw-accounttype, yxw-secretid, _env_name_, X-Tenant-Id, X-Appid, X-D2, X-Aid, X-Token, X-Token-Type, X-Nonce, X-Platform, X-Sign, X-Ts, X-App-Version, X-Sign-Retry, X-Auto-Test, X-Aid-Skey, X-Login-Type, X-Corp-Uin, x-ijt",
  "Content-Type": "application/json",
}


const siteID = '11c8ee6b-b6e3-40e2-ac72-d318b943066f'; // 替换为实际的Site ID
const token = 'nfp_QiY2SXh1EsPKHR9wYRnRXFz6KDtheXYfcce2'; // 替换为实际的API Token


exports.handler = async (event) => {
  const { httpMethod, body } = event;
  console.log('Received request with method:', httpMethod);
  function parseUserData(data) {
    let result=[];
    if (data!=null){
      let datas=data.split('\n');
      for(let i=0; i<datas.length; i++) {
        if (datas[i])
        result.push(JSON.parse(datas[i]))
      }
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
          data: "",
          cridID:encrypt(parsedBody.username),
          passwordID:encrypt(parsedBody.password),
          power: 0
        };

        data=JSON.stringify(data);
        let from=await storage.get('userData');

        let datas=parseUserData(from);
        for (let i=0; i<datas.length; i++) {
          if (datas[i].username===parsedBody.username)
            return {
              statusCode: 200, body: JSON.stringify({type:"error", message: 'Register failure', data: 'User already exists!' }),

              headers:headers}
        }

        console.log(`data from the storage`,from,'type of:',typeof from);

        if (from !== null){
          data=from+"\n"+data;
        }
        await storage.set('userData', data);
        console.log(`File uploaded successfully. Blob data: ${data}`);

        return {
          statusCode: 200,
          body: JSON.stringify({type:"info",  message: 'User data recorded successfully', data: `User registered successfully.` }),

          headers:headers};
      }else if(parsedBody.type==="login"){
        const storage=getStore({
          name:'deploy',
          siteID:siteID,
          token:token
        });
        let from=await storage.get('userData');
        let flg = false;
        let data = null;
        let datas=parseUserData(from);
        for (let i=0; i<datas.length; i++) {
          if (datas[i].username===parsedBody.username && datas[i].password===parsedBody.password) {
            flg=true;
            data=datas.data;
          }
        }
        if (!flg)return{
          statusCode: 200,
          body: JSON.stringify({type:"error",  message: 'Login failure' ,data:"Check username and password failure!"}),
          headers:headers
        };
        return{
          statusCode: 200,
          body: JSON.stringify({type:"info",  message: 'Login susses' ,data:data}),
          headers:headers
        };
      }else if (parsedBody.type==="setData"){
        const storage=getStore({
          name:'deploy',
          siteID:siteID,
          token:token
        });
        let from=await storage.get('userData');
        console.log(`data from the storage`,from,'type of:',typeof from);

        let datas=parseUserData(from);
        let data=parsedBody.data;
        data=JSON.stringify(data);
        let newText="";
        let sus=false;
        for (let i=0; i<datas.length; i++) {
          if (datas[i].username===parsedBody.username){
            datas[i].data=data;
            sus=true;
          }
          newText+=JSON.stringify(datas[i])+'\n';
        }


        if (sus)
          return{
            statusCode: 200,
            body: JSON.stringify({type:"info",  message: 'Setting susses' ,data:null}),
            headers:headers
          }
        else
          return{
            statusCode: 200,
            body: JSON.stringify({type:"error",  message: 'Setting fail' ,data:"Cannot find user!"}),
            headers:headers
          }

      }else if (parsedBody.type==="getData"){
        const storage=getStore({
        name:'deploy',
        siteID:siteID,
        token:token
      });
        let from=await storage.get('userData');
        console.log(from);
        let datas=parseUserData(from);
        for (let i=0; i<datas.length; i++) {
          if (datas[i].username===parsedBody.username){
            return{
              statusCode: 200,
              body: JSON.stringify({type:"info",  message: 'Getting susses' ,data:JSON.parse(datas[i].data)}),
              headers:headers
            };
          }
        }
        return{
          statusCode: 200,
          body: JSON.stringify({type:"error",  message: 'Setting fail' ,data:"Cannot find user!"}),
          headers:headers
        };

      }else if (parsedBody.type==="logoff"){

        if (parsedBody.username==="ADMIN"){
          window.console.log('%cCannot logoff ADMIN!',"color: red")
          return{
            statusCode: 200,
            body: JSON.stringify({type:"error",  message: 'Logoff fail' ,data:"Cannot logoff ADMIN!"}),
            headers:headers
          };
        }

        const storage=getStore({
          name:'deploy',
          siteID:siteID,
          token:token
        });
        let from=await storage.get('userData');
        console.log(`data from the storage`,from,'type of:',typeof from);

        let datas=parseUserData(from);
        let newText="";
        let sus=false;
        for (let i=0; i<datas.length; i++) {
          if (datas[i].username===parsedBody.username){
            sus=true;
            continue;
          }
          newText+=JSON.stringify(datas[i])+'\n';
        }
        console.log("newText:\n",newText)
        await storage.set('userData', newText)
        if (sus){
          return{
            statusCode: 200,
            body: JSON.stringify({type:"info",  message: 'Logoff susses' ,data:null}),
            headers:headers
          };
        }else{
          return{
            statusCode: 200,
            body: JSON.stringify({type:"error",  message: 'Logoff fail' ,data:"Unknown username!"}),
            headers:headers
          };
        }

      }
    } catch (error) {
      console.error('Error processing the request:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({type:"error",  message: 'Error processing the request' ,data:error.toString()}),
        headers:headers
      };
    }

  } else if (httpMethod==='OPTIONS'){
    return {
      statusCode: 200,
      headers:headers
    }
  }
  else  {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({type:"error",  message: 'Only POST method is allowed for user login' ,data:'null'}),
      headers:headers
    };
  }
};
