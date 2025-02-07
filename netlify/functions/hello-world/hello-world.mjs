// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
export default (request, context) => {
  try {
    const url = new URL(request.url)
    const type = request.type
    const method = request.method;
    const context1 = request.context;

    return new Response(`Hello! 200 ${type} ${url} ${method} ${context} ${context1}`)
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}
