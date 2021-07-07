const express= require("express");

const TelegramBot = require('node-telegram-bot-api');
const fs = require("fs");
let bodyParser = require("body-parser");

const token = '1814848685:AAEEiaj6WyHySeoNL3-z3iPOLpuD-Rlmr_U';
const bot = new TelegramBot(token, { polling: true });

var weather = require('weather-js');
 
let app = express();

app.set("view engine", "ejs")   //говорим что используем движок еджс

const filePath  = "./db/users.txt";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const checkUnique = (chatId) =>{
    if(fs.existsSync(filePath)){
        let users = fs.readFileSync(filePath);
        users = JSON.parse(users);
        let unique = true;

        for(let i = 0; i < users.length; i++){
            if(users[i].chatId === chatId){
                unique = false;
                break;
            }
        }
        return unique;
    }
}

const saveUser = (username, chatId) => {
    let user = {
        username: username,
        chatId: chatId
    }
    if(checkUnique(chatId)){
        let users = null;

        try{
            users = fs.readFileSync(filePath); 
            users = JSON.parse(users)
            
        }catch{
            users = [];
        }

        //bot.sendMessage(chatId, `${user.username}, ${user.chatId}`);
        users.push(user);

        fs.writeFileSync(filePath,JSON.stringify(users));

        bot.sendMessage(chatId, "Вы успешно зарегистрировались!");
    }else{
        bot.sendMessage(chatId, "Вы уже зарегистрировались!");
    }
}

app.get("/contacts", function(request, response){
    //saveUser("dinara test", 275156835)
    response.render("contacts.ejs", {
        title: "Страница контактов",
        contacts: JSON.parse(fs.readFileSync(filePath))
        
    });
})
app.post("/bot/message", function(request, response){
    let chatId = request.body.chatId;
    bot.sendMessage(chatId, "Вам отправили сообщение из сайта <3<3<3")
})

bot.onText(/\/register/, function(msg, match){  //команда в боте
    let textArray = msg.text.split(" ");     //===match[1];//разделить
    textArray.splice(0, 1);     //удаление первого элемента
    let textWithoutCommand = textArray.join(" ");   //соединить

    saveUser(username, chatId)
    bot.sendMessage(msg.chat.id, "Команда регистации \n с текстом " + textWithoutCommand);
})

bot.onText(/\/weather/, function(msg, match){   //создание команды в боте
    
    
    
    let city = msg.text.split(" ")[1];     //===match[1];//разделить

    weather.find({search: city, degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
       
        bot.sendMessage(msg.chat.id, `Погода в ${city}` + ":" + result[0]['current']['temperature']);
    });

})

bot.on("message", function(msg){
    saveUser(msg.chat.username, msg.chat.id);
})
app.listen(8080);
let port = process.env.PORT === underfined ? 3030 : process.env.PORT;
