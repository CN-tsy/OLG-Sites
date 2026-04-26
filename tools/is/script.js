console.log('is/ script.js v=3.0');
let name_=document.querySelector('.name');
let isHaveInfo=false;

const ts=document.querySelector(".i1");
const te=document.querySelector(".i2");
const Cbtn=document.querySelector(".confirm");
const Ts=document.querySelector(".Ts_btn");
const subdoc=document.querySelector(".sub");
const startT=document.querySelector(".startT");
const endT=document.querySelector(".endT");
const toggleCheckbox = document.querySelector('.toggle');
const mode=document.querySelector('.mode');
const basicInfoSubBtn=document.getElementById("basicInfoSubBtn");
const examNameI=document.querySelector("#examNameI input");
const subjectI=document.querySelector("#examSubI input");
const Exam={
    name:"",
    subject:"",
    startTime:"",
    endTime:""
}

mode.style.display="none";
basicInfoSubBtn.addEventListener("click",()=> {
    Exam.name=examNameI.value.trim();
    Exam.subject=subjectI.value.trim();
    if(Exam.name===""||Exam.subject===""){
        alert("请完整填写考试信息");
        return;
    }
    name_.textContent=`${Exam.name}指令系统`;
    isHaveInfo=true;
    console.log(Exam);
})
let hour=0, min=0, hour2=0, min2=0;
let ifplaysound=false;

Cbtn.addEventListener("click", () => {
    Exam.startTime=ts.value;
    Exam.endTime=te.value;
    [hour, min] = Exam.startTime.split(':');
    [hour2, min2] = Exam.endTime.split(':');
    hour=Number(hour), min=Number(min), hour2=Number(hour2), min2=Number(min2);
    console.log(hour, min, hour2, min2);
    startT.textContent=`开考时间：${Exam.startTime}:00`;
    endT.textContent=`结束时间：${Exam.endTime}:00`;
    mode.style.display="block";
    console.log(Exam);
});

let currentT = '';
function getCurrentTime(){
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            currentT=this.responseText;
            //console.log(this.responseText.substring(39,47));
        }
    });

    xhr.open('GET', 'https://world-time-api3.p.rapidapi.com/timezone/Asia/Shanghai.txt');
    xhr.setRequestHeader('x-rapidapi-key', '799934e3a2msh685215e540a345ep1a5c38jsnb54229037a61');
    xhr.setRequestHeader('x-rapidapi-host', 'world-time-api3.p.rapidapi.com');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
};

function calibrate(){
    function getTimeDifference(t1, t2) {
        // 将时间字符串拆分为小时、分钟和秒
        const [h1, m1, s1] = t1.split(':').map(Number);
        const [h2, m2, s2] = t2.split(':').map(Number);
    
        // 将时间转换为总秒数
        const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
        const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;
    
        // 计算差值
        return totalSeconds1 - totalSeconds2;
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0'); 

    const localTstr= `${hours}:${minutes}:${seconds}`;
    const currentTObj = {
        time: currentT.substring(39,47),
        inaccuracy: '±300ms',
        localtime: localTstr,
        difference: getTimeDifference(localTstr, currentT.substring(39,47))
    }
    console.group("caliInfo");
    console.log(currentTObj);
    console.table(currentTObj);
    console.groupEnd('caliInfo');

    document.getElementById("calibrateStatus").textContent = "pending... 校准中";
    const status=document.getElementById("calibrateStatus");
    status.style.setProperty('--before-bg-color','yellow');
    setTimeout(()=>{
        document.getElementById("calibrateStatus").textContent = "Success";
        status.style.setProperty('--before-bg-color','green');
        document.getElementById("calibrateResult").innerHTML = `
            <p>校准结果:</p>
            <p>currentTime:${currentTObj.time}</p>
            <p>CurrentTimeInaccuracy:${currentTObj.inaccuracy}</p>
            <p>localtime:${currentTObj.localtime}</p>
            <p>localTime与currentTime的差值（秒）:${currentTObj.difference}</p>
            <p>${currentTObj.difference<=2?'无需调整您设备的时间':'建议调整您设备的时间'}</p>
        `;
    },2000);
}
document.getElementById("calibrateBtn").addEventListener('click', function () {
    const calibrateBtn = this; // 保存按钮的引用
    calibrateBtn.disabled = true; // 禁用按钮，防止重复点击

    // 启用 turnstile 验证
    document.getElementById('turnstile').innerHTML = `
        <div class="cf-turnstile" 
             data-sitekey="0x4AAAAAACl-8md3DM_LOzG0" 
             data-callback="onVerify">
        </div>
    `;

    // 定义验证成功后的回调函数
    window.onVerify = function (token) {
        console.log("验证成功，收到的 token:", token);

        // 调用 getCurrentTime 和 calibrate
        getCurrentTime();
        setTimeout(() => {
            calibrate();
        }, 1000);

        // 10 秒后重新启用按钮
        setTimeout(() => {
            calibrateBtn.disabled = false;
        }, 10000);
    };
});
function updateTime() {
    const now = new Date(); 
    const Now_hours = String(now.getHours()).padStart(2, '0');   
    const Now_minutes = String(now.getMinutes()).padStart(2, '0'); 
    const Now_seconds = String(now.getSeconds()).padStart(2, '0'); 
    
    const timeString = `${Now_hours}:${Now_minutes}:${Now_seconds}`;
    document.querySelector(".T").textContent = timeString;
}
updateTime();
setInterval(updateTime, 1000);

//Belows are updateExamStatus()
function updateExamStatus() {
    if(!isHaveInfo){
        return;
    }
    const now = new Date();
    const Now_hours = now.getHours();
    const Now_minutes = now.getMinutes();

    if (Now_hours < hour || (Now_hours === hour && Now_minutes < min)) {//准备
        subdoc.textContent = `科目：${Exam.subject} 准备`;

        const remainingMinutes = (hour * 60 + min) - (Now_hours * 60 + Now_minutes);
        const hoursLeft = Math.floor(remainingMinutes / 60);
        const minutesLeft = remainingMinutes % 60;

        if (hoursLeft > 0) {
            mode.textContent = `距离开始还有 ${hoursLeft}小时${minutesLeft}分`;
        } else {
            mode.textContent = `距离开始还有 ${minutesLeft}分钟`;
        }
    } else if (//进行中
        (Now_hours > hour || (Now_hours === hour && Now_minutes >= min)) &&
        (Now_hours < hour2 || (Now_hours === hour2 && Now_minutes < min2))
    ) {
        subdoc.textContent = `科目：${Exam.subject} 进行中`;

        let remainingMinutes = (hour2 * 60 + min2) - (Now_hours * 60 + Now_minutes);
        let hoursLeft = Math.floor(remainingMinutes / 60);
        let minutesLeft = remainingMinutes % 60;

        if (hoursLeft > 0) {
            mode.textContent = `距离结束还有 ${hoursLeft}小时${minutesLeft}分`;
        } else {
            minutesLeft-=1;
            if (minutesLeft<=0){
                mode.textContent = `距离结束还有 少于1分钟`;
                return;
            }
            mode.textContent = `距离结束还有 ${minutesLeft}分钟`;
        }
    } else if (Now_hours >= hour2 && Now_minutes >= min2) {//结束
        subdoc.textContent = `科目：${Exam.subject} 结束`;
        mode.textContent = `请全体考生停笔，起立，待检测无误后方可离开考场`;
    }
    if (((Now_hours == hour && Now_minutes == min) || (Now_hours == hour2 && Now_minutes == min2)) && 
        (now.getSeconds()==0 || now.getSeconds()==1) && ifplaysound
    ) {//播放提示音
        playSound();
    }
}
updateExamStatus();
setInterval(updateExamStatus, 1000);

const audio = new Audio('bell.mp3');
function playSound() {
  audio.play().catch(error => {
    console.log('播放失败：', error); // 处理播放限制（如未用户交互）
  });
  console.log(`提示音:播放 [${new Date().getHours()}:${new Date().getMinutes()}]`);
}

console.log("提示音:"+ifplaysound);
toggleCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        ifplaysound=true;
        console.log("提示音:"+ifplaysound);
    } else {
        ifplaysound=false;
        console.log("提示音:"+ifplaysound);
    }
});


function updateInfo(){
    if(!confirm("使用这种方式开考不会对输入的信息进行任何格式检查，确认后考试立即开始")){
        console.log('已终止');
        return;
    }
    isHaveInfo=true;
    name_.textContent=`${Exam.name}指令系统`;
    [hour, min] = Exam.startTime.split(':');
    [hour2, min2] = Exam.endTime.split(':');
    hour=Number(hour), min=Number(min), hour2=Number(hour2), min2=Number(min2);
    console.log(hour, min, hour2, min2);
    startT.textContent=`开考时间：${Exam.startTime}:00`;
    endT.textContent=`结束时间：${Exam.endTime}:00`;
    mode.style.display="block";

}
