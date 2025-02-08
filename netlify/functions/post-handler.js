const fs = require('fs').promises; // 引入fs模块的Promise版本以支持异步操作

exports.handler = async (event) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    try {
      // 解析JSON body，假定body格式为{ username: 'username', password: 'password' }
      const parsedBody = JSON.parse(body);
      console.log('Received POST request with body:', parsedBody);

      // 简单地假设所有提交的登录信息都是有效的（实际应用中需要验证）
      // 构造用户数据对象
      const userData = {
        timestamp: new Date().toISOString(), // 记录时间戳
        ...parsedBody // 包含用户名和密码
      };

      // 将用户数据写入文件，这里使用'unix_timestamp-username.txt'作为文件名示例
      const fileName = `../../users/usersdata.txt`;
      await fs.appendFile(fileName, JSON.stringify(userData, null, 2)); // 追加模式写入，保持数据格式整洁

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
