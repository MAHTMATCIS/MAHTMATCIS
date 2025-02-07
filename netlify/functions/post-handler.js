

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/post', (req, res) => {
    console.log(req.body); // 处理请求数据
    res.send('Data received');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});