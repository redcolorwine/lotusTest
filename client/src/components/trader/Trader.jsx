import React from 'react'
import rstyle from './trader.module.css';
//Компонента отдельного участника
//через пропсы можно передать данные каждого отдельно участника
const Trader = (props) => {
    return (
        <div className={rstyle.trader}>
            {
                props.timer == 'true'
                    ? <h2 className={rstyle.timer}>{props.timerData.minutes} : {props.timerData.seconds}</h2>
                    : <h2 className={rstyle.nontimer}> - </h2>
            }

            <h3>УЧАСТНИК № {props.name}</h3>
            <p>{props.activity}</p>
            <p>{props.productionTime}</p>
            <p>{props.warranty}</p>
            <p>{props.cost}</p>
            <p>{props.actions}</p>
        </div>
    )
}

export default Trader