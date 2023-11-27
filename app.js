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


app.post('/auth', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass,8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=> {
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                //res.send('Usuario y/o contraseña incorrecta');
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "User or password incorrect!",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            
            }else{
                //res.send('Login correcto');
                req.session.loggedin = true;
                req.session.name = results[0].name
                res.render('login', {
                    alert: true,
                    alertTitle: "Successful conection",
                    alertMessage: "Login correcto!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        })
    }else{
        //res.send('Por favor ingrese un usuario y/o password');
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese un usuario y/o password",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'login'
        });
    }

})

//13 Auth Pages
app.get('/', (req, res) =>{
    if(req.session.loggedin){
        res.render('index', {
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión'
        })
    }
})

//14.- Logout

app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})


/*app.get('/', (req, res)=>{
    res.send('Hello');
})*/

app.listen(3000, (req, res) =>{
    console.log('Server running on https://localhost:3000/')
})

