'use strict';
const workQuestions = [
['최근 일을 하면서 보람되고 뿌듯했다고 느꼈던 경험을 우리에게 공유해 주실래요?', 'Could you share with us a recent work experience that made you feel worthwhile?'],
['일을 하면서 혼란스럽거나 어렵다고 느꼈던 경험을 우리에게 말해 주실래요?', 'Could you share with us a working experience when you felt confused or difficult.'],
['최근 업무를 하면서 더 알고 싶었거나 묻고 싶었던 질문이 있었다면 무엇인가요?', 'If you wanted to know more while working recently, What question did you ask?'],
['일하면서 자신 혹은 팀이 걱정되던 순간이 있었나요?', 'Were there moments in which you felt that concern about yourself or your team at work?'],
['혹시 다른 구성원들과 함께 일하면서 존중받지 못하거나 불편한 느낌을 받은 적이 있나요? 있다면 말해 줄 수 있어요?', 'Were there any times today when you felt disrespected by anyone? Tell me about those moments.'],
['최근 일하면서 리더 또는 동료로부터 도움을 받거나, 배려와 존중을 받았다고 느낀 순간이 있었나요?', 'Were there times recently when you felt that one of your team members demonstrated care for you?'],
['최근 일하면서 우리 팀 또는 스스로에게 자부심을 느꼈던 순간이 있었나요?', 'Were there any moments when you felt proud of yourself or our team?'],
['동료나 리더와 소통하면서 즐거웠던 순간이 있었다면 말해줄 수 있나요?', 'Tell we about a conversation you had with a leader or team members that you enjoyed.'],
['최근 특히 도전적이었거나, 힘들었다고 느꼈던 일은 무엇인가요?', 'What was challenging about your work?'],
['함께 일하는 팀 멤버들에게 고마움을 표현하고 싶은 것이 있다면 무엇인가요?', 'What do you appreciate about our team?'],
['일을 하면서 자신에 대해 새롭게 알게 된 것이 있다면, 그것은 무엇인가요?', 'What did you learn about yourself?'],
['혹시 저나 팀원들이 도와주었으면 하는 일이 있다면, 그것은 무엇인가요?', 'What do you want me or our team to do for you?'],
['혹시 걱정되는 일이 있나요?', 'Is there anything you’re worried about?'],
['앞으로 기대되는 것은 무엇인가요?', 'What are you looking forward about the future?'],
['당신의 일과 경험에 대해 우리가 물어봐 주었으면 하는 다른 질문이 있나요?', 'Is there a question you wish that we ask you about your work?']
];
const schoolQuestions = [
['네가 오늘 배운 것 중 정말 뿌듯하다고 느꼈던 순간을 말해줄래?', 'Tell me about a moment today when you felt excited about what you were learning.'],
['네가 수업시간에 혼란스러움을 느꼈던 순간에 대해 말해줄래?', 'Tell me about a moment in class when you felt confused.'],
['오늘 학교에서 뭘 배웠고, 뭘 했는지 생각해봐. 네가 더 알고 싶었던 부분이 있었니? 오늘의 배움에서 생겼던 질문은 뭐야?', 'Think about what you learned and did in school today. What’s something you’d like to know more about? What’s a question you have that came from your learning today?'],
['오늘 네가 염려스럽거나 두려움을 느꼈던 순간이 있었니?', 'Were there any moments today when you felt worried? When you felt scared?'],
['혹시 오늘 다른 친구들에게서 존중받지 못한다는 느낌을 받은 적 있어? 있다면 얘기해 줄 수 있겠니?', 'Were there any times today when you felt disrespected by anyone? Tell me about those moments.'],
['오늘 학교에서 반 친구로부터 보살핌을 받는다는 느낌을 받은 적이 있었니?', 'Were there times today when you felt that one of your classmates demonstrated care for you?'],
['오늘 네가 자랑스럽다고 느꼈던 순간이 있었니?', 'Were there any moments today when you felt proud of yourself?'],
['오늘 친구와 나눈 즐거웠던 이야기가 있다면 혹시 말해줄 수 있겠니?', 'Tell me about a conversation you had with a classmate or friend that you enjoyed.'],
['오늘 하루 도전적이었던 일은 뭐였어?', 'What was challenging about your day?'],
['오늘 하루 고마움을 표현하고 싶은 것은 뭐야?', 'What do you appreciate about your day?'],
['오늘 하루 너 자신에 대해 무엇을 배웠어?', 'What did you learn about yourself today?'],
['혹시 내가 도와줬으면 하는 일이 있다면 말해줄래?', 'Is there anything that you’d like to talk about that I might be able to help you figure out?'],
['혹시 걱정되는 일이 있니?', 'Is there anything you’re worried about?'],
['내일 기대되는 일은 뭐야?', 'What are you looking forward to tomorrow?'],
['오늘 너의 하루에 대해 어떤 질문을 더 받고 싶니?', 'Is there a question you wish I’d ask you about your day?']
];
let questions = workQuestions, remaining = [], current = -1, drawCount = 0;
function setVersion(mode) {
 const school = mode === 'school';
 document.documentElement.dataset.mode = mode;
 questions = school ? schoolQuestions : workQuestions;
 remaining = []; current = -1; drawCount = 0;
 for(const b of document.querySelectorAll('[data-version]')) b.setAttribute('aria-pressed', String(b.dataset.version === mode));
 document.querySelector('#version-label').textContent = school ? 'AFTER SCHOOL QUESTION' : 'AFTER WORK QUESTION';
 document.querySelector('#headline').innerHTML = '경험을 나누는<br>질문 한 장...';
 document.querySelector('#lead').innerHTML = school ? '함께 배우고 지낸 하루를 돌아보며,<br>학교에서의 마음과 경험을 나눠 보세요.' : '분주했던 하루를 잠시 내려놓고,<br>일터에서의 나와 우리를 만나보세요.';
 document.querySelector('#card-label').textContent = school ? '학교생활 질문 카드' : '일터 경험 질문 카드';
 document.querySelector('#card-en-label').textContent = school ? 'AFTER SCHOOL QUESTION CARD' : 'AFTER WORK QUESTION CARD';
 document.querySelector('.draw').setAttribute('aria-label',school ? '학교생활 랜덤 질문 카드' : '일터 경험 랜덤 질문 카드');
 document.querySelector('#status').textContent = '';
}

const card = document.querySelector('#card');
function draw(initial = false) {
 if (!remaining.length) remaining = questions.map((_,i)=>i).filter(i => i !== current);
 // The closing invitation (question 15) joins the draw from the fourth card.
 const eligible = remaining.filter(i => drawCount >= 3 || i !== 14);
 const selected = eligible[Math.floor(Math.random()*eligible.length)];
 current = remaining.splice(remaining.indexOf(selected),1)[0];
 drawCount += 1;
 document.querySelector('.question-content').classList.toggle('long', questions[current][0].length > 62);
 document.querySelector('#question').textContent = questions[current][0];
 document.querySelector('#english').textContent = questions[current][1];
 document.querySelector('#number').textContent = String(current+1).padStart(2,'0')+' / 15';
 if(!initial) {card.classList.remove('reveal'); void card.offsetWidth; card.classList.add('reveal');document.querySelector('#status').textContent='새로운 질문을 뽑았어요.';}
}
document.querySelector('#draw').addEventListener('click',()=>draw());
for (const button of document.querySelectorAll('[data-dialog]')) button.addEventListener('click',()=>document.getElementById(button.dataset.dialog).showModal());
for (const dialog of document.querySelectorAll('dialog')) {
 dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click', e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
}
const mode = location.pathname.startsWith('/school') ? 'school' : 'work';
setVersion(mode);
for (const button of document.querySelectorAll('[data-version]')) button.addEventListener('click',()=>{
 if(button.dataset.version !== mode) location.assign('/'+button.dataset.version+'/');
});
document.querySelector('#share').addEventListener('click',()=>{
 const input = document.querySelector('#share-url');
 input.value = new URL('/'+mode+'/',location.origin).href;
 document.querySelector('#share-status').textContent = '';
 document.querySelector('#share-dialog').showModal();
});
document.querySelector('#share-url').addEventListener('click',event=>event.target.select());
document.querySelector('#copy-link').addEventListener('click',async()=>{
 const input = document.querySelector('#share-url');
 try {
  await navigator.clipboard.writeText(input.value);
  document.querySelector('#share-status').textContent = '공유 링크를 복사했어요.';
 } catch {
  input.focus(); input.select();
  document.querySelector('#share-status').textContent = '선택된 링크를 복사해 주세요.';
 }
});
draw(true);
