const express = require('express')
const fs = require("fs");

const app = express();
const port = 8000

app.listen(port, () => {
    console.log('work on ' + port)
})

app.use(express.urlencoded({ extended: false })) 
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })

const filePath = "books.json";
const loginPath = "users.json"

app.get("/api/books", function(req, res){
    console.log('get')
    let content = fs.readFileSync(filePath); // Читаем файл. Название файла поменять на свое
   
    let parseddata= JSON.parse(content); // парсим и получаем JS объект из строки
    
    res.send(parseddata);
});


app.post("/api/addBook", function (req, res) {
    console.log('post')
   
    if(!req.body) return res.sendStatus(400);
      
   
    let book = req.body;
      
    let content = fs.readFileSync(filePath); // Читаем файл. Название файла поменять на свое
   
    let parseddata= JSON.parse(content); // парсим и получаем JS объект из строки
  
    // находим максимальный id
    let id = Math.max.apply(Math,parseddata.map(function(o){return o.id;}))
    
    if(parseddata.length === 0){
        id = 0
        
    } 
    // увеличиваем его на единицу
    book.id = id+1;
    console.log(book.id)
    // добавляем пользователя в массив
    parseddata.push(book);
    data = JSON.stringify(parseddata);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(filePath, data);
    res.send(parseddata);
});


 // удаление пользователя по id
app.delete("/api/delete", function(req, res){
    
    console.log('delete')
    const id = req.body.id;
    let data = fs.readFileSync(filePath);
   
    let parseddata = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < parseddata.length; i++){
        if(parseddata[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const book = parseddata.splice(index, 1)[0];
        data = JSON.stringify(parseddata);
        fs.writeFileSync(filePath, data);
        // отправляем удаленного пользователя
        res.send(parseddata);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/api/edit", function(req, res){
    console.log('edit')
    if(!req.body) return res.sendStatus(400);
    
    const bookId = req.body.id;
  
      
    let data = fs.readFileSync(filePath);
    let parseddata = JSON.parse(data);
    let editBook;
    for(var i=0; i<parseddata.length; i++){
        if(parseddata[i].id==bookId){
            editBook = parseddata[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(editBook){
        editBook.picture = req.body.picture;
        editBook.name = req.body.name;
        editBook.year = req.body.year;
        editBook.genre = req.body.genre;
        editBook.author = req.body.author;
        
        data = JSON.stringify(parseddata);
        fs.writeFileSync(filePath, data);
        res.send(parseddata);
    }
    else{
        res.status(404).send(editBook);
    }
});
   






// логинизация
app.post("/api/auth", function (req, res) {
    console.log('post login')
    console.log(req.body)
    if(!req.body) return res.sendStatus(400);
      
   
    let user = req.body;
      
    let users = fs.readFileSync(loginPath); // Читаем файл. Название файла поменять на свое
   
    let parsedUsers= JSON.parse(users); // парсим и получаем JS объект из строки

    let loginUser = parsedUsers.find(item => ((item.login === user.login) && (item.password === user.password)) )
 
    // добавляем пользователя в массив
     if(!!loginUser) return res.sendStatus(200);
    parsedUsers.push(user);
    data = JSON.stringify(parsedUsers);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(loginPath, data);

    res.send({login: user.login});
});

app.post("/api/login", function (req, res) {
    console.log('post login')
    
    if(!req.body) return res.sendStatus(400);
      
   
    let user = req.body;
      
    let users = fs.readFileSync(loginPath); // Читаем файл. Название файла поменять на свое
   
    let parsedUsers= JSON.parse(users); // парсим и получаем JS объект из строки

    let loginUser = parsedUsers.find(item => ((item.login === user.login) && (item.password === user.password)) )
    
    console.log(loginUser)
 
    if(!loginUser) return res.sendStatus(400);
  
    res.send({login: loginUser.login});
});

