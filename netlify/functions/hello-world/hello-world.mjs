export default async (request, context) => {
  try {
    if (request.method === 'POST') {
      const { formData } = await request.formData(); // 获取POST请求的表单数据

      let postData = {}; // 初始化一个空对象来存储表单数据
      // 遍历formData中的条目并将它们添加到postData对象中


      // 返回POST数据作为JSON响应
      return new Response(`<div><h1>Hello, World!</h1><div>You've sent: <u>${formData}</u></div></div>`);
    } else if(request.method === 'GET') {
      // 如果不是POST请求，返回一个提示信息
      return new Response(`<div><h1>Hello, Everybody!</h1><div>Thank you to visit this page <u>"Far from the distance".</u></div><div><p style="font-family: 'Arial Black',serif ; color: red ; text-underline: red"><u>BUT</u></p> this page isn't any public page. So you'd better go away <p style="font-family: 'Arial Black',serif ; color: red ; text-underline: red; font-size: 40px"><u>NOW</u></p></div></div>`, {
        status: 405, // Method Not Allowed
      });
    }else{
        // 如果不是POST请求，返回一个提示信息
        return new Response(`This endpoint only accepts POST requests.`, {
          status: 405, // Method Not Allowed
        });
    }
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    });
  }
};
