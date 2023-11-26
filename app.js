//Invocar a express
const express = require('express');
const app = express();

//Setear urlenconded para capturar los datos de nuestro formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Invocar a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//el directorio public
app.use('/', express.static('public'));
app.use('/', express.static(__dirname + '/public'));

//Establecer el motor de plantillas ejs
app.set('view engine', 'ejs');

//Invocar a bcryptjs
const bcryptjs = require('bcryptjs');

//Variables de sesion
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//invocar el modulo de conexion de nuestra BD
const conection = require('./database/db')

const  {name}   = require('ejs');
const connection = require('./database/db');

//Establecer nuestras routes

app.get ('/', (req, res)=> {
    res.render('index');
})

app.get ('/login', (req, res)=> {
    res.render('login');
})

app.get ('/register', (req, res)=> {
    res.render('register');
})

//register

app.post('/register', async(req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordhash = await bcryptjs.hash(pass, 8)
    connection.query('INSERT INTO login set ?' , {
        user:user, name:name, rol:rol, pass:passwordhash
    }, async(error, results) => {
        if(error){
            console.log(error);
        }else{
            //res.send('succesful registrration')
            res.render('register', {
                alert: true,
                alertTitle: 'Registration',
                alertMessage: 'Succesful',
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
})

/*app.get('/', (req, res)=>{
    res.send('Hello');
})*/

app.listen(3000, (req, res) =>{
    console.log('Server running on https://localhost:3000/')
})

