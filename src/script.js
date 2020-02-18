let inputDate = new Date("January 27, 2020 00:00:00");
let BeginingDate = new Date("January 24, 2020 00:00:00"); // begining of the epoch time will be calculated

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
        // here you should draw the timeline backbone 
        for (let index = 0; index < this.daysRendered*24; index++) {
            let element = document.createElement('div');
            document.querySelector('.timeLine-tail').appendChild(element);
        }


        data.forEach((el) => {
            let diffInSecond = Math.round(new Date(el.TimeStamp).getTime() / 1000) - (new Date(BeginingDate).getTime() / 1000);
            let sizeOfOneSecOnTimeLine = ((document.querySelector('.timeLine-tail div').offsetWidth / 60) / 60);
            let element = document.createElement('div');
            element.style.setProperty('left',diffInSecond*sizeOfOneSecOnTimeLine + 'px');
            document.querySelector('.lines').appendChild(element);
            console.log(diffInSecond,sizeOfOneSecOnTimeLine);
        });
    }
}

document.documentElement.style.setProperty('--hours-on-screen',timeLine.hoursOnScreen);
document.documentElement.style.setProperty('--daysRendered',timeLine.daysRendered);
timeLine.render();
document.querySelector('.center').scroll((document.querySelector('.center').scrollWidth/2.0),0);