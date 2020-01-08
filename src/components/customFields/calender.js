import React, { PureComponent } from 'react';

import '../../style/calender.scss';
const MONTH = ["January","February","March","April","May","June","July",
"August","September","October","November","December"]
class Calendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            calendar: this.init()
        };
    }

    init = (date = null) =>{
        date = date ? date : new Date();
        let c = new Date();
        c.setHours(0,0,0,0);
        let m = date.getMonth();
        var firstDay =  new Date(date.getFullYear(), date.getMonth(), 1); 
        var lastDay =   new Date(date.getFullYear(), date.getMonth() + 1, 0); 
        let calender = {
            month: m,
            dateObj: date,
            monthName: MONTH[m],
            date: date.getDate(),
            firstDay: firstDay.getDay(),
            totalDay: lastDay.getDate(),
            year: date.getFullYear(),
            currentDate: c,
            currentTimestamp: c.getTime(),
        };
        let days = [];
        if(calender.firstDay > 0){
             days = new Array(calender.firstDay).fill(null);
        }
        for(var i = 1; i<= calender.totalDay; i++){
            i =  i > 9 ? i : `0${i}`;
            let d = new Date(calender.year, calender.month, i, 0,0,0,0);
            let t = d.getTime();
            let isCurrent =  calender.currentTimestamp === t;
            let isDisabled = this.isDisabled(t);
            let className  = isCurrent ? 'active' : '';
            className = isDisabled ? className + ' disable' : className;
            days = [...days, { day: i, isCurrent, timestamp: t, date: d, hd: `${i}/${calender.month}/${calender.year}`, isDisabled, className } ];
        }
        calender.days = days;
        return calender;
    }

    isDisabled = (date) =>{
        let {maxdate, mindate} = this.props;
        if(maxdate){
            maxdate.setHours(0,0,0,0);
            return maxdate.getTime() < date;
        }
        if(mindate){
            mindate.setHours(0,0,0,0);
            return mindate.getTime() > date;
        }
        return false
    }

    goToMonth = (e, isPrev)=>{
        let calendar = Object.assign({},this.state.calendar);
        calendar.month = isPrev ? calendar.month - 1 : calendar.month + 1;
        if(calendar.month < 0){
            calendar.month = 11;
            calendar.year = calendar.year - 1;
        }

        if(calendar.month > 11){
            calendar.month = 0;
            calendar.year = calendar.year + 1;
        } 
        let date = new Date(`${calendar.year}-${calendar.month + 1}-01`);
         this.setState({calendar: this.init(date)})

    }

    onDateSelect = (dobj) => {
        if(dobj.isDisabled){
            return;
        }
        if(this.props.onDateSelect){
            this.props.onDateSelect(dobj);
        }
    }

    render() {
        let { calendar } = this.state;
        return (
            <div className="calendar">
                <div className="month">
                    <ul>
                    <li className="prev" onClick={(e)=>this.goToMonth(e, true)}>&#10094;</li>
                    <li className="next" onClick={(e)=>this.goToMonth(e, false)}>&#10095;</li>
                        <li>
                            {calendar.monthName}
                            <span style={{ fontSize: "20px", paddingLeft: '10px' }}>{calendar.year}</span>
                        </li>
                    </ul>
                </div>

                <ul className="weekdays">
                    <li>S</li>
                    <li>M</li>
                    <li>T</li>
                    <li>W</li>
                    <li>T</li>
                    <li>F</li>
                    <li>S</li>
                </ul>

                <ul className="days">
                    {calendar.days.map((day, i)=>{
                        return(
                        <li key={i}>{day && <span className={day.className } onClick={(e)=>this.onDateSelect(day)}>{day.day}</span>}</li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}
export default Calendar
