
let data = [
    {Action : 301, ValidFrom : "January 27, 2020 11:00:00", ValidTo : "January 27, 2020 18:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 500, ValidFrom : "January 27, 2020 11:00:00", ValidTo : "January 27, 2020 11:30:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 304, ValidFrom : "January 27, 2020 11:35:00", ValidTo : "January 27, 2020 11:39:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 402, ValidFrom : "January 27, 2020 11:35:00", ValidTo : "January 27, 2020 11:39:00", Index : 0,Pernr : "89065325", Name : "Lukáš Babinec"},
    {Action : 402, ValidFrom : "January 27, 2020 11:35:00", ValidTo : "January 27, 2020 11:39:00", Index : 1,Pernr : "89065325", Name : "Lukáš Babinec"},
    
    // {Action : 411, TimeStamp : "January 27, 2020 13:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
    // {Action : 413, TimeStamp : "January 27, 2020 14:00:00", Pernr : "89065325", Name : "Lukáš Babinec"},
];

let timeLine = {
    daysRendered: 7,
    hoursOnScreen: 7,
    render(){ 
        // ================================
        // Reset before render
        // ================================ 
        document.querySelector('.tail').innerHTML = "";
        document.querySelector('.pos-0').innerHTML = "<hr>";
        document.querySelector('.pos-1').innerHTML = "<hr>";
        document.querySelector('.pause').innerHTML = "<hr>";
        document.querySelector('.login').innerHTML = "<hr>";


        // ================================
        // Drawing a tail of timeline
        // ================================ 
        for (let index = 0; index < this.daysRendered*24; index++) {
            let element = document.createElement("div");
            for(let i = 0; i < 6;i++)
            {
                let hr = document.createElement("hr");
                hr.classList.add("l");
                hr.classList.add(`l${i}`);
                element.appendChild(hr);
            }    
            element.dataset.content = index % 24;
            document.querySelector('.tail').appendChild(element);
        }
        
        // ================================
        // Drawing a head of timeline
        // ================================ 
        data.forEach((el) => {
            // Size of one second on a timeline in Px
            let sizeOfOneSecOnTimeLine = ((document.querySelector('.tail div').getBoundingClientRect().width / 60) / 60);


            // Diference in seconds between start of the timeline and event action
            let diffInSecondFromBeginingOfTimeline = Math.round(new Date(el.ValidFrom).getTime() / 1000) - (new Date(TimelineBeginingDate).getTime() / 1000);
            // Calculate the timespan of action in seconds
            let actionTimespan = Math.round(new Date(el.ValidTo).getTime() / 1000) - (new Date(el.ValidFrom).getTime() / 1000);
            // Create the element action and add the appropriate offset and width
            let element = document.createElement('div');
            element.style.setProperty('left',diffInSecondFromBeginingOfTimeline*sizeOfOneSecOnTimeLine + 'px');
            element.style.setProperty('width',actionTimespan*sizeOfOneSecOnTimeLine + 'px');


            // Determine to which line to put the action log
            switch (el.Action) {
                case 301: 
                    document.querySelector('.login').appendChild(element);                                
                    break;
                case 304:
                case 500: 
                    document.querySelector('.pause').appendChild(element);                                
                    break;
                case 402:
                    if(el.Index === 0){
                        document.querySelector('.pos-0').appendChild(element);
                    }
                    else{
                        document.querySelector('.pos-1').appendChild(element);
                    }
                    break;
                default:
                    console.log("Unknown action",el);
                    break;
            }
        });
    }
}

let inputDate = new Date("January 27, 2020 00:00:00");
let TimelineBeginingDate = new Date("January 24, 2020 00:00:00"); // begining of the epoch time will be calculated
TimelineBeginingDate.setDate(inputDate.getDate()-Math.floor(timeLine.daysRendered/2));


// Set css properties
document.documentElement.style.setProperty('--hours-on-screen',timeLine.hoursOnScreen);
document.documentElement.style.setProperty('--daysRendered',timeLine.daysRendered);

// Run render
timeLine.render();

/// Scroll to the center of the timeline
document.querySelector('.head').scroll((document.querySelector('.head').scrollWidth/2.0),0);

// Set arrow scrolling events
let lastScroll;
document.querySelector('.dragscroll').addEventListener('scroll', (e) => {
    let el = document.querySelector('.dragscroll');
    if(el.scrollLeft < lastScroll) {
        //scroll left
        document.querySelector('.arrow-left use').classList.toggle('arrow-light',true);
        document.querySelector('.arrow-right use').classList.toggle('arrow-light',false);
    } else {
        //scroll right        
        document.querySelector('.arrow-left use').classList.toggle('arrow-light',false);
        document.querySelector('.arrow-right use').classList.toggle('arrow-light',true);

    }
    setTimeout(() => {
        document.querySelector('.arrow-right use').classList.toggle('arrow-light',false);
        document.querySelector('.arrow-left use').classList.toggle('arrow-light',false);
    },200);
    lastScroll = el.scrollLeft;
  });

// On resize re-render event
window.addEventListener("resize",() => {
    timeLine.render();
    console.log("resize");
});