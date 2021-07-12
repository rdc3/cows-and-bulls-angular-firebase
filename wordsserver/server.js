const express = require('express')
const fs = require('fs');
const hostname = '127.0.0.1';
const app = express()

app.use(express.json())
app.post(
    '/test',
    (req, res) => {
        console.log(req.body);

        fs.appendFile('./test.txt', JSON.stringify(req.body), err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })
        res.send(JSON.stringify(req.body));
    }
)
app.get('/', (req, res) => {
    res.send('Hello World!')
})
const PORT = process.env.PORT || 5200
app.listen(PORT, hostname, () => {
    console.log(`Server listening on port ${PORT}`)
})
const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
                return;
            }
            visited.add(value);
        }
        return value;
    };
};