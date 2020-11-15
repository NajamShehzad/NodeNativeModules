const http = require('http');
const url = require('url');
const StringDecorder = require('string_decoder').StringDecoder

const server = http.createServer((req, res) => {

    // Get the URL
    const parseUrl = url.parse(req.url, true);

    // Get path
    const pathName = parseUrl.pathname
    const trimPath = pathName.replace(/^\/+|\/+$/g, '');

    // Get query string from req
    const queryStringObject = parseUrl.query;

    // Get the headers
    const headers = req.headers;


    // Get the method
    const method = req.method;

    // Get the payload if any
    const decorder = new StringDecorder('utf-8')
    let buffer = '';
    req.on('data', (data) => {
        buffer += decorder.write(data)
    })
    req.on('end', () => {
        // End the buffer after listening 
        buffer += decorder.end();

        // Chose the handler if the path is not found throw 404 with notFound route
        const chosenHandler = typeof (router[trimPath]) !== "undefined" ? router[trimPath] : handler.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        }

        chosenHandler(data, (statusCode, payload) => {
            // Use the status code if found or use the default status code
            statusCode = typeof (statusCode) == "number" ? statusCode : 200;
            // Use the payload if found or use the default empty object
            payload = typeof (payload) == "object" ? payload : {};

            //Convert the object into JSON;
            const payloadString = JSON.stringify(payload);
            console.log({statusCode});

            res.writeHead(statusCode);
            res.end(payloadString);


            // Log path here
            // console.log({ trimPath });
            // console.log({ method });
            // console.log({ queryObject: queryStringObject });
            // console.log({ headers });
            // console.log({ buffer });
            console.log("Request recived with payload: " + buffer);
        })

    })

});


server.listen(3000, (e, s) => {
    console.log({ e, s });
    console.log("Server running on port 3000");
})



const handler = {} // Object.freeze({});

// Sample handler
handler.sample = (data, callback) => {
    // Sample http status code and a paylod object
    callback(406, { name: "Sample handler" })
}
// Not found handler
handler.notFound = (data, callback) => {
    callback(404)
}

const router = {
    'sample': handler.sample
}