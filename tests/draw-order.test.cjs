const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../experience/app.js'), 'utf8');
function load(mode, random) {
 const elements = new Map();
 const document = {
  documentElement: { dataset: {} },
  querySelector(selector) {
   if (!elements.has(selector)) elements.set(selector, {
    textContent: '', innerHTML: '', dataset: {},
    classList: { toggle() {}, remove() {}, add() {} },
    addEventListener() {}, setAttribute() {}
   });
   return elements.get(selector);
  },
  querySelectorAll() { return []; }
 };
 const math = Object.create(Math); math.random = random;
 const context = vm.createContext({ document, Math: math, location: { pathname: '/'+mode+'/' } });
 vm.runInContext(source, context);
 return { context, number: () => Number(elements.get('#number').textContent.split(' / ')[0]), draw: () => vm.runInContext('draw()', context) };
}
for (const mode of ['work', 'school']) {
 test(mode+': question 15 can first appear on draw four', () => {
  const app = load(mode, () => 0.999999);
  const sequence = [app.number()];
  for (let i=1;i<4;i++) {app.draw(); sequence.push(app.number());}
  assert.ok(sequence.slice(0,3).every(n => n !== 15));
  assert.equal(sequence[3], 15);
 });
 test(mode+': first three exclude question 15 and all 15 remain available', () => {
  for (let seed=1;seed<=200;seed++) {
   let state = seed;
   const app=load(mode, () => ((state=(state*1664525+1013904223)>>>0)/4294967296));
   const sequence=[app.number()];
   for(let i=1;i<15;i++){app.draw();sequence.push(app.number());}
   assert.ok(sequence.slice(0,3).every(n=>n!==15));
   assert.equal(new Set(sequence).size, 15);
  }
 });
 test(mode+': switching mode resets the first three draw restriction',()=>{
  const app=load(mode,()=>0.999999);
  for(let i=1;i<4;i++) app.draw();
  assert.equal(app.number(),15);
  vm.runInContext("setVersion('"+(mode==='school'?'work':'school')+"')",app.context);
  for(let i=0;i<3;i++){app.draw();assert.notEqual(app.number(),15);}
  app.draw();assert.equal(app.number(),15);
 });
}
