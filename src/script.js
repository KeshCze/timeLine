let data = [
    {Action : 411, TimeStamp : "January 27, 2020 11:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 413, TimeStamp : "January 27, 2020 12:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 411, TimeStamp : "January 27, 2020 13:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 413, TimeStamp : "January 27, 2020 14:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
];

let timeLine = {
    daysRendered: 7,
    hoursOnScreen: 8,
    render(){
        for (let index = 0; index < this.daysRendered*24; index++) {
            let element = document.createElement('div');
            document.querySelector('.timeLine-tail').appendChild(element);
            
        }
    }
}

let root = document.documentElement;
root.style.setProperty('--hours-on-screen',timeLine.daysRendered);
timeLine.render();