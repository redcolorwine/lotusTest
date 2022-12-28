const express = require('express');
const cors = require('cors');
const app = express();
const { createServer } = require("http");
const { Server } = require('socket.io');

//Переменные для таймера
let time = 120;
let minutes;
let seconds;

//Вызываем функцию с интервалом в 1 секунду 
setInterval(updateTimer, 1000);
//В функции обновляем значение таймера

function updateTimer() {
    //Если время закончилось, то обновляем таймер, 
    //перед этим отключив всех подключенных пользователей 
    if (time <= 0) {
        io.disconnectSockets();
        time = 120;
    }

    //Реализация таймера
    minutes = Math.floor(time / 60);
    seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    //По запросу события 'getTimer' возвращаем клиенту текущие значения таймера
    io.emit('getTimer', { minutes, seconds });
    //Каждую секунду вычитаем значение(единицу) из таймера
    time--;
}

//Для JSON формата данных
app.use(express.json());

//CORS для работы на localhost
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
//Инициализируем сервер для работы с сокетами (Socket.io)
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
});

//Переменные для хранения id участников 
//и для хранения сокетов подключенных пользователей
var userConnections = [];
var allClients = [];
//При подключении пользователя:
io.on('connection', async (socket) => {
    //Добавляем в массив id сокетов, и сами сокеты
    userConnections.push(socket.id);
    allClients.push(socket);
    //Сообщение о подключении пользователя
    console.log("user connected", socket.id);
    //Возвращаем на клиент (при запросе getUser) id сокета текущего пользователя
    //а также всех подключенных на данных момент пользователей
    //чтобы была возможность их отобразить на клиенте
    io.emit('getUser', { data: socket.id, usersOnline: userConnections });
    //При отключении пользователя: 
    socket.on('disconnect', function () {
        //Выводим соответствующее сообщение
        console.log('A user disconnected', socket.id);
        //Очищаем массивы пользователей (чтобы они не остались на клиенте)
        delete allClients[socket.id];
        userConnections = userConnections.filter((user) => user != socket.id);
        //Для наглядности отображаем в консоли
        console.log(userConnections);
    });

})

//Сервер запускаем на 5000 порту
httpServer.listen(5000, () => {
    console.log('server is working');
})