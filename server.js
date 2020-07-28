'use strict';
require('dotenv').config();

const express = require('express');
const server = express();
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const methodOverride = require('method-override');
const client=new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3030;

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(express.static('./public'));
server.set('view engine', 'ejs');

/////////////////// routes /////////////////////
server.get('/',(req,res)=>{
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url).then(jokeData=>{
        let jokeInfo = jokeData.body.map(ele =>{
            return new Joke(ele);
        });
        res.render('home', ({dataKey : jokeInfo }));
    });
});

function Joke(data) {
    this.id = data.id;
    this.type = data.type;
    this.setup = data.setup;
    this.punchline = data.punchline;
}


server.post('/addToDatabase',(req,res)=>{
    let rb = req.body;
    let sql =  `INSERT INTO exam(type,setup,punchline) VALUES ($1,$2,$3);`;
    let safeValues = [rb.type,rb.setup,rb.punchline];
    client.query(sql,safeValues).then( data =>{
        res.redirect('/favourite');
    });
});

server.get('/favourite',(req,res)=>{
    let sql = `SELECT * FROM exam;`;

    client.query(sql).then( info => {
        res.render('favourite', {retriveData : info.rows });
    });
});


server.post('/delete',(req,res)=>{
    let sql = ` delete from exam  where id=${req.body.id};`;
    client.query(sql).then(ele=>{
        res.redirect('/');
    }); 
});
server.post('/update',(req,res)=>{
    let sql = `update exam set (type = $1, setup = $2, punchline = $3, id = $4);`;
    let rb = req.body;
    let values = [rb.type,rb.setup,rb.punchline];
    client.query(sql,values).then(ele=>{
        res.redirect('favourite');
    });
});





























////////////////// random ///////////////////////////
server.get('/Random',(req,res)=>{
    let url = `https://official-joke-api.appspot.com/jokes/programming/random`;
    superagent.get(url).then(jokeData=>{
        let jokeRandom = jokeData.body.map(ele =>{
            return new Rand(ele);
        });
        res.render('random', ({dataKey : jokeRandom }));
    });
});
function Rand(data) {
    this.id = data.id;
    this.type = data.type;
    this.setup = data.setup;
    this.punchline = data.punchline;
}
//////////////////////// catch error ///////////////////
server.get('*',(req,res)=>{
    res.status(404).send("this page is ! found");
}); 


////////////////////////////////////////////////////
client.connect().then(()=>{
    server.listen(PORT, ()=>{
        console.log(`Thank you ${PORT} Times RAZAN`);
    });
});