const { createLogger, transports, format} = require('winston');

// create the logger
const logger = createLogger({
    level: 'info', // this will log only messages with the level 'info' and above
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'app.log'}), // log to a file
    ]
})


const http = require("http");
const url = require('node:url');
const port = 3000;
const groceryList = [];
const startItem ={
    name: 'Eggs',
    price:5.00,
    quantity: 12,
    purchased: false
};
/*function getGroceryList()
{
    return groceryList;
}
function setGroceryList(groceryList)
{
    this.groceryList = groceryList;
}*/
function closeServer()
{
    server.close();
}
groceryList.push(startItem);
const server = http.createServer((req, res) => {

    // GET
    if (req.method === 'GET' && req.url === '/api/list'){
        
        logger.info('Successful GET')
        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(groceryList));
    //POST
    }else if(req.method === 'POST' && req.url === '/api/addToList'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            groceryList.push(data);
            logger.info(`Successful POST`);
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Resource Created Successfully!'}));
        });

    }else if(req.method === "PUT" && req.url === '/api/update'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const newItem = JSON.parse(body);

            if(modifyList(newItem))
            {
                logger.info(`Successful PUT`);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Resource Edited Successfully!'}));
            }else{
                
                logger.info(`Failed PUT`);
                logger.info(`Item Not Found`);
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Edit Failed! Resource Not Found'}));
            }
            
            
        });
    }else if(req.method === "DELETE"){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const newItem = JSON.parse(body);
            if(delListItem(newItem))
            {
                logger.info(`Successful DELETE`);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Resource Delete Successfully!'}));
            }else{
                
                logger.info(`Failed Delete`);
                logger.info(`Item Not Found`);
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Delete Failed! Resource Not Found'}));
            }
        });
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }

})

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
})
//const fs = require('fs')
/*if(!fs.existsSync('groceryList.txt')){
    fs.writeFile('groceryList.txt','' , 'utf-8', (err) => {
        if(err){
            console.error(err);
            return;
        }
        console.log("File has been written");
    })
}*/
/*function getList(res){
    fs.readFile('groceryList.txt', 'utf-8', (err, data) => {
        if(err){
            logger.error(err);
            return;
        }else{
            logger.info('Successful GET')
            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
            return data;
        }
    })
}
function appendList(data, res)
{
    fs.appendFile('groceryList.txt', data, 'utf-8', (err) =>{
        if(err){
            logger.error(err);
            return;
        }else{
            logger.info('Successful POST')
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Resource Created Successfully!'}));
        }
    })

}*/
function modifyList(grocery)
{
    for (const i in groceryList) {
        if (groceryList[i].name === grocery.name) {
            groceryList[i].price = grocery.price;
            groceryList[i].quantity = grocery.quantity;
            groceryList[i].purchased = grocery.purchased;
            return true;
        }
    }
    return false;
}
function delListItem(grocery)
{
    for (const i in groceryList) {
        if (groceryList[i].name === grocery.name) {
            groceryList.splice(i,1);
            return true;
        }
    }
    return false;
}
module.exports = {closeServer};