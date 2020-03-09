let container = document.getElementById('container');
let dataPeople =[
    {Pernr : "11111111", Name : "Lukáš Babinec", lastScroll : 0},
];


let dummyPersonData = [
    {Id: 0,Action : 301, ValidFrom : "January 27, 2020 11:00:00", ValidTo : "January 27, 2020 18:00:00", Pernr : "11111111", Name : "Lukáš Babinec", Reason: null},
    {Id: 1,Action : 500, ValidFrom : "January 27, 2020 11:00:00", ValidTo : "January 27, 2020 11:30:00", Pernr : "11111111", Name : "Lukáš Babinec", Reason: 515},
    {Id: 2,Action : 500, ValidFrom : "January 27, 2020 14:00:00", ValidTo : "January 27, 2020 14:30:00", Pernr : "11111111", Name : "Lukáš Babinec", Reason: 516},
    {Id: 3,Action : 304, ValidFrom : "January 27, 2020 11:35:00", ValidTo : "January 27, 2020 11:39:00", Pernr : "11111111", Name : "Lukáš Babinec", Reason: null},
    {Id: 4,Action : 402, ValidFrom : "January 27, 2020 11:35:00", ValidTo : "January 27, 2020 11:39:00", Index : 0,Pernr : "11111111", Name : "Lukáš Babinec",OrderNumber: "92592490",Piece: "1", Reason: null},
    {Id: 5,Action : 402, ValidFrom : "January 27, 2020 11:35:00", ValidTo : "January 27, 2020 11:39:00", Index : 1,Pernr : "11111111", Name : "Lukáš Babinec",OrderNumber: "92592490",Piece: "1", Reason: null},
    {Id: 6,Action : 402, ValidFrom : "January 27, 2020 13:35:00", ValidTo : "January 27, 2020 13:50:00", Index : 1,Pernr : "11111111", Name : "Lukáš Babinec",OrderNumber: "92592490",Piece: "1", Reason: null},
    {Id: 7,Action : 402, ValidFrom : "January 27, 2020 16:35:00", ValidTo : "January 27, 2020 16:50:00", Index : 1,Pernr : "11111111", Name : "Lukáš Babinec",OrderNumber: "92592490",Piece: "1", Reason: null},        
];


let timeLine = {
    daysRendered: 7,
    hoursOnScreen: 5,
    minWidthToDisplayOrderNumber: 100,
    renderWhole(){
        // Pass hours property to the css styles
        document.documentElement.style.setProperty('--hours-on-screen',timeLine.hoursOnScreen);
        // Clean up the container
        container.innerHTML = "";

        dataPeople.forEach((d) => {
            // Render row            
            let rowString = this.returnRow(d);
            let wrap = document.createElement('div');
            wrap.innerHTML = rowString;
            container.appendChild(wrap);

            // Render timeline for row
            this.renderTimeline(d.Pernr,dummyPersonData);
        });

        // For new rendered DOMs, reset the dragscroll instance
        dragscroll.reset();        
    },
    renderTimeline(pernr,data){ 
        // ================================
        // Reset before render
        // ================================ 
        document.querySelector(`.row[data-pernr="${pernr}"] .tail`).innerHTML = "";
        document.querySelector(`.row[data-pernr="${pernr}"] .pos-0`).innerHTML = "<hr>";
        document.querySelector(`.row[data-pernr="${pernr}"] .pos-1`).innerHTML = "<hr>";
        document.querySelector(`.row[data-pernr="${pernr}"] .pause`).innerHTML = "<hr>";
        document.querySelector(`.row[data-pernr="${pernr}"] .login`).innerHTML = "<hr>";


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
            document.querySelector(`.row[data-pernr="${pernr}"] .tail`).appendChild(element);
        }
        
        // ================================
        // Drawing a head of timeline
        // ================================ 
        data.forEach((el) => {
            // Size of one second on a timeline in Px
            let sizeOfOneSecOnTimeLine = ((document.querySelector(`.row[data-pernr="${pernr}"] .tail div`).getBoundingClientRect().width / 60) / 60);


            // Diference in seconds between start of the timeline and event action
            let diffInSecondFromBeginingOfTimeline = Math.round(new Date(el.ValidFrom).getTime() / 1000) - (new Date(TimelineBeginingDate).getTime() / 1000);
            // Calculate the timespan of action in seconds
            let actionTimespan = Math.round(new Date(el.ValidTo).getTime() / 1000) - (new Date(el.ValidFrom).getTime() / 1000);
            // Create the element action and add the appropriate offset and width
            let element = document.createElement('div');
            element.style.setProperty('left',diffInSecondFromBeginingOfTimeline*sizeOfOneSecOnTimeLine + 'px');
            element.style.setProperty('width',actionTimespan*sizeOfOneSecOnTimeLine + 'px');

            // Add id reference to the dataset record
            let subElement = document.createElement('div');
            subElement.classList.add('relative-part');
            subElement.dataset.id = el.Id;
            
            // Determine to which line to put the action log
            switch (el.Action) {
                case 301:
                    element.appendChild(subElement); 
                    document.querySelector(`.row[data-pernr="${pernr}"] .login`).appendChild(element);                                
                    break;
                case 304:
                case 500:
                    element.appendChild(subElement); 
                    document.querySelector(`.row[data-pernr="${pernr}"] .pause`).appendChild(element);                                
                    break;
                case 402:
                    let OrderNumberText = document.createElement('div');
                    OrderNumberText.classList.add('order-text');
                    // Add order number text
                    OrderNumberText.innerText = `${el.OrderNumber} / ${('0' + el.Piece).slice(-2)}`;
                    // If action element is too small hide the order number label
                    if(actionTimespan*sizeOfOneSecOnTimeLine < this.minWidthToDisplayOrderNumber)
                    {
                        OrderNumberText.style.setProperty('display','none');
                    }

                    subElement.appendChild(OrderNumberText);
                    element.appendChild(subElement);

                    // Apped order to the correct row
                    if(el.Index === 0){

                        document.querySelector(`.row[data-pernr="${pernr}"] .pos-0`).appendChild(element);
                    }
                    else{
                        document.querySelector(`.row[data-pernr="${pernr}"] .pos-1`).appendChild(element);
                    }
                    break;
                default:
                    console.error("Unknown action",el);
                    break;
            }
            
            
                    
            // Click event
            subElement.addEventListener('click',(el) => {
                this.showToolTip(el.currentTarget.dataset.id);
            });
            
        });

        /// Scroll to the center of the timeline
        document.querySelector(`.row[data-pernr="${pernr}"] .head`).scroll((document.querySelector(`.row[data-pernr="${pernr}"] .head`).scrollWidth/2.0),0);

        // Add event to calculate pointer data
        document.querySelector(`.row[data-pernr="${pernr}"] .head`).addEventListener('scroll',(e) => {
            let el = e.target;

            // Size of one second on a timeline in Px            
            let sizeOfOneSecOnTimeLine = (60.0 / (document.querySelector(`.row[data-pernr="${pernr}"] .tail div`).getBoundingClientRect().width));
        // Time offset defined by scroll
            let movedMinutes = (el.scrollLeft * sizeOfOneSecOnTimeLine)*60;
            // calculate offset from the start of the row to the middle
            let offset = (document.querySelector(`.row[data-pernr="${pernr}"] .head`).getBoundingClientRect().width /2)*sizeOfOneSecOnTimeLine *60;
            // Add moved time and offset to the begining of the rendered time
            let scrolledDate = new Date((TimelineBeginingDate.getTime() + offset *1000) + movedMinutes *1000);
            // Format datetime
            const formatter = new Intl.DateTimeFormat('cs-CZ',{
                weekday: 'short',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            const [{ value: shortDay },,{ value: day },,{ value: month },,{value: hour},,{value:minute}] = formatter.formatToParts(scrolledDate);
            // Override new timestamp label
            document.querySelector(`.row[data-pernr="${pernr}"] .pointer-text`).innerText = `${capitalizeFLetter(shortDay)} ${day}.${month}. ${hour}:${minute}`;
        });
    },
    returnRow(data){
        return `
        <div class="row" data-pernr="${data.Pernr}">
            <h1>${data.Name}</h1>
            <div class="timeLine">
                <hr class="pointer">
                <div class="pointer-text">23.3. 14:53</div>
                <div class="arrow-left">
                    <svg >
                        <use class="arrow" xlink:href="src/styles/img/arr-left.svg#arr-left"></use>
                    </svg>
                </div>
                <div class="arrow-right">
                    <svg >
                        <use class="arrow" xlink:href="src/styles/img/arr-right.svg#arr-right"></use>
                    </svg>
                </div>
                <div class="head dragscroll">
                    <div class="lines">
                        <div class="line-wrap pos-0">
                            <hr>
                        </div>
                        <div class="line-wrap pos-1">
                            <hr>                        
                        </div>
                        <div class="line-wrap pause">
                            <hr>                        
                        </div>
                        <div class="line-wrap login">
                            <hr>                        
                        </div>
                    </div>
                    <div class="tail">
                    </div>
                </div>            
            </div>            
        </div>
        `
    },
    templateTooltip301(dataRecord){
        // Format datetime
        const formatter = new Intl.DateTimeFormat('cs-CZ',{
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        const [{ value: shortDay },,{ value: day },,{ value: month },,{value: hour},,{value:minute}] = formatter.formatToParts(new Date(dataRecord.ValidFrom));
        const [{ value: shortDay1 },,{ value: day1 },,{ value: month1 },,{value: hour1},,{value:minute1}] = formatter.formatToParts(new Date(dataRecord.ValidTo));
        return`
        <div class="tooltip tool-login">
            <h4>Uživatel přihlášen</h4>
            <hr>
            <span>${capitalizeFLetter(shortDay)} ${day}.${month}. ${hour}:${minute} - ${capitalizeFLetter(shortDay1)} ${day1}.${month1}. ${hour1}:${minute1}</span>
        </div>
        `;
    },
    templateTooltip500(dataRecord){
        // Format datetime
        const formatter = new Intl.DateTimeFormat('cs-CZ',{
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        const [{ value: shortDay },,{ value: day },,{ value: month },,{value: hour},,{value:minute}] = formatter.formatToParts(new Date(dataRecord.ValidFrom));
        const [{ value: shortDay1 },,{ value: day1 },,{ value: month1 },,{value: hour1},,{value:minute1}] = formatter.formatToParts(new Date(dataRecord.ValidTo));
        let reasonText;
        switch (dataRecord.Reason) {
            case 515:
                reasonText = 'Osobní pauza';
                break;
            case 516:
                reasonText = 'Uklízení';
                break;
            default:
                console.error("Non-existing reason",dataRecord);
                break;
        }
        return`
        <div class="tooltip tool-pause">
            <h4>Uživatel na pauze</h4>
            <hr>
            <span>${capitalizeFLetter(shortDay)} ${day}.${month}. ${hour}:${minute} - ${capitalizeFLetter(shortDay1)} ${day1}.${month1}. ${hour1}:${minute1}</span>
            <div>Druh pauzy: ${reasonText}</div>
        </div>
        `;
    },
    setUpControlls(){
        let el = document.getElementById('controll');
        el.querySelector('.percentage').innerText = `${((12.5)* this.hoursOnScreen)} %`
        el.querySelector('.plus').addEventListener('click',() =>{
            if(this.hoursOnScreen > 1){
                this.hoursOnScreen -= 1;
                this.renderWhole();
                document.querySelector('.percentage').innerText = `${((12.5)* this.hoursOnScreen)} %`
            }            
        });
        el.querySelector('.minus').addEventListener('click',() =>{
            if(this.hoursOnScreen < 8){
                this.hoursOnScreen += 1;
                this.renderWhole();
                document.querySelector('.percentage').innerText = `${((12.5)* this.hoursOnScreen)} %`
            }
        });     
    },
    showToolTip(id){
        document.querySelector('.tooltip')?.remove();
        id = Number(id);
        let dataRecord = dummyPersonData.find(x => x.Id === id);
        let template;
        switch (dataRecord.Action) {
            case 301:
                template = this.templateTooltip301(dataRecord);
                break;
            case 500:
                template = this.templateTooltip500(dataRecord);
                break;
            default:
                console.error("Non-existing tooltip template",id,dataRecord);
                template= ''
                break;
        }

        document.querySelector(`div[data-id="${id}"]`).innerHTML = template;
    }
}

let inputDate = new Date("January 27, 2020 00:00:00");
let TimelineBeginingDate = new Date("January 24, 2020 00:00:00"); // begining of the epoch time will be calculated
TimelineBeginingDate.setDate(inputDate.getDate()-Math.floor(timeLine.daysRendered/2));


// Set css properties
document.documentElement.style.setProperty('--daysRendered',timeLine.daysRendered);

// Run render
timeLine.renderWhole();
timeLine.setUpControlls();

// // Set arrow scrolling events
// let lastScroll;
// document.querySelectorAll('.dragscroll').addEventListener('scroll', (e) => {
//     let el = e.target;
//     if(el.scrollLeft < lastScroll) {
//         //scroll left
//         document.querySelector('.arrow-left use').classList.toggle('arrow-light',true);
//         document.querySelector('.arrow-right use').classList.toggle('arrow-light',false);
//     } else {
//         //scroll right        
//         document.querySelector('.arrow-left use').classList.toggle('arrow-light',false);
//         document.querySelector('.arrow-right use').classList.toggle('arrow-light',true);

//     }
//     // reset highlight
//     setTimeout(() => {
//         document.querySelector('.arrow-right use').classList.toggle('arrow-light',false);
//         document.querySelector('.arrow-left use').classList.toggle('arrow-light',false);
//     },200);
//     lastScroll = el.scrollLeft;
//   });

// On resize re-render event
window.addEventListener("resize",() => {
    timeLine.renderRows();
    console.log("resize");
});

// Help functions
function capitalizeFLetter(word) { 
    return word.replace(/^./, word[0].toUpperCase()); 
};