import React, { useEffect, useState } from 'react';
import Trader from '../../components/trader/Trader';
import socket from '../../socket/socket';
import rstyle from './main.module.css';

const Main = (props) => {
    //Для получения данных с сервера
    const [servData, setServData] = useState(null);
    const [usersData, setUsersData] = useState(null);

    useEffect(() => {
        //Действия при подключении:
        socket.on("connect", () => {

        });
        //При отлючении:
        //Можно для наглядности сделать форму входа
        //и при "дисконнекте" возвращать на форму входа
        //после чего заного авторизовываться
        //на данный момент для переподключения нужно перезагрузить страницу(f5)
        socket.on("disconnect", () => {
            alert('Торги окончены!')
        });
        //Подписываемся на событие 'getTimer' для получения значений таймера
        socket.on('getTimer', function (data) {
            setServData(data);
        })
        //Подписываемся на событие 'getUser' для своего id
        //и для получения других пользователей (онлайн)
        socket.on('getUser', function (data) {
            setUsersData(data);
        })
        //При размонтировании
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        }
    }, [])

    if (servData !== null) {
        //Если данные с сервера получены
        //При помощи метода map возвращаем массив "участников" 
        //Можно в качестве имени использовать id сокета, но я присвоил индексы
        //По хорошему, после реализации полноценной авторизации можно передавать имя участника на сервер
        let users = usersData.usersOnline.map((item, index) => {
            //Таймер отобразим только у первого участника
            if (index == 0) {
                return (<Trader name={index + 1} activity="-" productionTime='76' warranty='36' cost='40%' actions='3.500.000 руб.' timer='true' timerData={servData} />)
            } else {
                return (<Trader name={index + 1} activity="-" productionTime='76' warranty='36' cost='40%' actions='3.500.000 руб.' timer='false' timerData={servData} />)
            }

        })
        return (
            <div className={rstyle.main}>
                <div className={rstyle.heading}>
                    <h2>Ход торгов <span>{props.type} {props.item} {props.date}</span></h2>
                    <hr className='hr' />
                </div>
                <h4>Уважаемые участники, во время Вашего хода Вы можете изменить параметры торгов, указанных в таблицe:</h4>
                <div className={rstyle.tradeBlock}>

                    <div className={rstyle.trade}>

                        <div className={rstyle.tradeParams}>
                            <h2>ХОД</h2>
                            <h3>ПАРАМЕТРЫ и ТРЕБОВАНИЯ</h3>
                            <p>Наличие комплекса мероприятий, повышающих стандарты качества изготовления</p>
                            <p>Срок изготовления, дней</p>
                            <p>Гарантийные обязательства, мес</p>
                            <p>Стоимость изготовления лота, руб. (без НДС)</p>
                            <p>Действия: </p>
                        </div>
                        {users}
                    </div>
                </div>
            </div>
        )
    } else {
        //Если нет соединения
        //Тут можно реализовать прелоадер...
        return (
            <div>
                <h1>Загрузка</h1>
            </div>
        )
    }

}

export default Main;