const PORT = process.env.Port || 8080
const express = require('express')
const db = require('sqlite')
const moment = require('moment')
const methodOverRide = require('method-override')

const app = express()

let date = moment().format('LLL');

app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))

app.set('views', './views')
app.set('view engine', 'pug')
app.use(methodOverRide('_method'))

console.log(date)

db.open('todolist.db').then(() => {
    console.log('Database todo ready')
    return Promise.all([
    db.run(" CREATE TABLE IF NOT EXISTS todos (message, completion, created_at, updated_at)"),
    db.run('CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, email, password, created_at, updated_at)' )
    ])
}).then(() => {
    console.log('tables ready')
})

.catch(() => console.log('Une erreur est survenue'))





app.get('/todos', (req, res, next) => {
    db.all('SELECT ROWID as id, * FROM todos ').then((todos) => {
        res.format({
            'text/html': function(){
               res.render('todos/index',{
                   todo : todos
               })
            },
            'application/json': function(){
                res.json(todos)
            },
            
        })
    }).catch((err) => {
        res.send('404 : Not Found')
    })
   
})

app.post('/todos', (req, res, next) => {
    db.run('INSERT INTO todos VALUES (?,?,?,?);', req.body.message, 'a faire', date, date).then((todos) => {
        res.format({
                'text/html': function(){
                   res.redirect('/todos')
                },
                'application/json': function(){
                    res.json(todos)
                },
                
            })
    }).catch((err) => {
        console.log('erreur:')
        res.send('erreur')
    })
})

app.get('/todos/add', (req, res, next) => {
        res.format({
            'text/html': function(){
               res.render('todos/add')
            }
            
        })
    })



app.get('/todos/:id', (req, res, next) => {
    db.get('SELECT ROWID as id, * FROM todos WHERE ROWID=?', req.params.id).then((todo) => {
        console.log(todo)
        res.format({
            'text/html': function(){
               res.render('todos/show',{
                   todo : todo
               })
            },
            'application/json': function(){
                res.json(todo)
            },
            
        })
    }).catch((err) => {
        res.send('404 : Not Found'+ err)
    })
})
 

app.delete('/todos/:id', (req, res, next) => {
    db.run("DELETE FROM todos WHERE ROWID=?", req.params.id).then((todo) => {
        res.format({
            'text/html': function(){
               res.redirect('/todos')
            },
            'application/json': function(){
                res.json(todo)
            }
            
        })
    }).catch((err) => {
        res.send('error: no Delete' + err)
    })
})


app.patch('/todos/:ROWID', (req, res, next) => {
    let date = moment().format('LLL');
    db.run("UPDATE todos SET completion=?, updated_at=? WHERE ROWID=? ", "fait", date, req.params.ROWID).then((todos) => {
        res.format({
            'text/html': function(){
               res.redirect('/todos')
            },
            'application/json': function(){
                res.json(todos)
            },
            
        })
    }).catch((err) => {
        res.send('error: no update')
    })
})

//--------------------------------------------------------------------------------------------------------------------------------

app.get('/users',(req,res, next)=>{
    db.all('SELECT ROWID as id, * FROM users').then((users)=>{
        res.format({
            'text/html':function(){
                res.render('users/index',{
                    user : users
                })
            },
            'application/json': function(){
                res.json(users)
            },
        })
    }).catch((err) => {
        res.send('erreur: 404 NOT FOUND, la page users n\'as pas étais trouvé')
        console.log(err)
    })

})

app.get('/users/edit', (req, res, next) => {
    res.format({
        'text/html': function(){
           res.render('users/edit')
        }
        
    })
})


app.post('/users',(req,res, next)=>{
    let date = moment().format('LLL');
    let pswd = 
    db.run('INSERT INTO users VALUES (?,?,?,?,?,?,?);', req.body.firstname, req.body.lastname, req.body.username, req.body.email, req.body.password, date, date).then((users) => {
        res.format({
            'text/html': function(){
                res.redirect('/users')
            },
            'application/json': function(){
                res.json('sucess add')
            },
        })
    }).catch((err)=>{
        res.send('Erreur: Nous n\'avons pas pu vous enregistrer')
        console.log(err)
    })
})

app.get('/users/:id', (req, res, next) => {
    db.get('SELECT ROWID as id, * FROM users WHERE id=?', req.params.id).then((user) => {
        console.log(user)
        res.format({
            'text/html': function(){
               res.render('users/show',{
                   user : user
               })
            },
            'application/json': function(){
                res.json(todo)
            },
            
        })
    }).catch((err) => {
        res.send('404 : Not Found'+ err)
    })
})


app.delete('/users/:id', (req, res, next) => {
    db.run("DELETE FROM users WHERE ROWID=?", req.params.id).then((todo) => {
        res.format({
            'text/html': function(){
               res.redirect('/users')
            },
            'application/json': function(){
                res.json(user)
            }
            
        })
    }).catch((err) => {
        res.send('error: no Delete' + err)
    })
})

//---------------------------------------------------------------------------------------------------------------------------------

app.use((req, res) => {
    res.status(404)
    res.send('404 : Not Found\n' )
})

app.listen(8080);



//rec.param.todoID