/* ================= STATE ================= */

const State = {
  xp: parseInt(localStorage.getItem("xp")) || 0,
  level: parseInt(localStorage.getItem("level")) || 1,
  medals: JSON.parse(localStorage.getItem("medals")) || [],

  save(){
    localStorage.setItem("xp",this.xp);
    localStorage.setItem("level",this.level);
    localStorage.setItem("medals",JSON.stringify(this.medals));
  },

  addXP(amount){
    this.xp+=amount;
    if(this.xp>=100){
      this.level++;
      this.xp=0;
      this.addMedal("Новый уровень");
    }
    this.save();
    UI.updateProfile();
  },

  addMedal(text){
    if(!this.medals.includes(text)){
      this.medals.push(text);
      UI.showMedal(text);
    }
  }
};

/* ================= CURRICULUM 4 MONTHS ================= */

const Curriculum = {

1:{
  russian:[
    {title:"Части речи",theory:"Алексия пишет сказку о летающей машине.",question:"Что такое глагол?",answer:null},
    {title:"Главные члены",theory:"Иван охраняет замок.",question:"Кто? Что делает?",answer:null}
  ],
  math:[
    {title:"Многозначные числа",theory:"Дом на 16 этаже.",question:"Сколько десятков в 16?",answer:"1"},
    {title:"Сложение",theory:"7 мест в машине.",question:"7 - 5 =",answer:"2"}
  ],
  english:[
    {title:"Family",theory:"Brother, sister, parents.",question:"Translate brother",answer:"брат"}
  ]
},

2:{
  russian:[
    {title:"Текст и абзацы",theory:"Алексия пишет рассказ.",question:"Что такое абзац?",answer:null}
  ],
  math:[
    {title:"Умножение",theory:"3 ряда по 4 игрушки.",question:"3x4=",answer:"12"}
  ],
  english:[
    {title:"Present Simple",theory:"She sings.",question:"Add -s to sing",answer:"sings"}
  ]
},

3:{
  russian:[
    {title:"Сочинение",theory:"Сказка про город под облаками.",question:"Придумай начало сказки",answer:null}
  ],
  math:[
    {title:"Периметр",theory:"Коврик-город 4x5.",question:"Периметр?",answer:"18"}
  ],
  english:[
    {title:"Past Simple",theory:"She danced.",question:"Past of dance?",answer:"danced"}
  ]
},

4:{
  russian:[
    {title:"Проект месяца",theory:"Создай свою историю.",question:"Название истории?",answer:null}
  ],
  math:[
    {title:"Квест задач",theory:"Летающая машина.",question:"10 - 3 =",answer:"7"}
  ],
  english:[
    {title:"Show time",theory:"Prepare a mini show.",question:"Translate show",answer:"шоу"}
  ]
}

};

/* ================= UI ================= */

const UI = {

init(){
  this.initMonths();
  this.updateProfile();
  this.loadSubjects(1);
},

initMonths(){
  const select=document.getElementById("monthSelect");
  for(let i=1;i<=4;i++){
    select.innerHTML+=`<option value="${i}">Месяц ${i}</option>`;
  }
  select.addEventListener("change",e=>{
    this.loadSubjects(e.target.value);
  });
},

loadSubjects(month){
  const container=document.getElementById("subjects");
  container.innerHTML="";
  const subjects=Object.keys(Curriculum[month]);
  subjects.forEach(sub=>{
    container.innerHTML+=`
      <div class="subject-btn" onclick="UI.loadLessons(${month},'${sub}')">
        ${sub.toUpperCase()}
      </div>`;
  });
},

loadLessons(month,subject){
  const content=document.getElementById("content");
  content.innerHTML="";
  Curriculum[month][subject].forEach((lesson,index)=>{
    content.innerHTML+=`
      <div class="lesson-card">
        <div class="lesson-title">${lesson.title}</div>
        <p>${lesson.theory}</p>
        <div class="button" onclick="UI.openLesson(${month},'${subject}',${index})">
          Открыть урок
        </div>
      </div>`;
  });
},

openLesson(month,subject,index){
  const lesson=Curriculum[month][subject][index];
  document.getElementById("modalContent").innerHTML=`
    <h2>${lesson.title}</h2>
    <p>${lesson.question}</p>
    <input id="answer">
    <div class="button" onclick="UI.checkAnswer(${month},'${subject}',${index})">
      Проверить
    </div>
    <div id="feedback" class="feedback"></div>
  `;
  document.getElementById("modal").style.display="flex";
},

checkAnswer(month,subject,index){
  const lesson=Curriculum[month][subject][index];
  const val=document.getElementById("answer").value.toLowerCase();
  const fb=document.getElementById("feedback");

  if(!lesson.answer || val===lesson.answer){
    fb.innerHTML="Верно 👑 +20 XP";
    fb.style.color="var(--success)";
    State.addXP(20);
  }else{
    fb.innerHTML="Попробуй ещё";
    fb.style.color="var(--danger)";
  }
},

updateProfile(){
  document.getElementById("level").innerText=State.level;
  document.getElementById("xpFill").style.width=State.xp+"%";
  document.getElementById("medals").innerHTML=
    State.medals.map(m=>`🏅 ${m}`).join("<br>");
},

showMedal(text){
  alert("🏅 "+text);
}

};

document.getElementById("modal").addEventListener("click",e=>{
  if(e.target.id==="modal") e.target.style.display="none";
});

UI.init();
