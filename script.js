const input_submit = document.querySelector('#btn_submit');
const clear = document.querySelector('#clear');

const formatCoef = (val, type='x2') => {
  if(val === 1) return type==='x2' ? `<msup><mi>x</mi><mn>2</mn></msup>` : `<mi>x</mi>`;
  if(val === -1) return type==='x2' ? `<mo>-</mo><msup><mi>x</mi><mn>2</mn></msup>` : `<mo>-</mo><mi>x</mi>`;
  if(val === 0 && type!=='x2') return '';
  const sign = val > 0 ? `<mo>+</mo>` : `<mo>-</mo>`;
  const absVal = Math.abs(val);
  return type==='x2' ? `${sign}<mn>${absVal}</mn><msup><mi>x</mi><mn>2</mn></msup>` : `${sign}<mn>${absVal}</mn><mi>x</mi>`;
};

input_submit.addEventListener('click', e => {
  e.preventDefault();
  const ids = ['a','b','c'];
  const values = ids.map(id => document.querySelector(`#${id}`).value.trim());
  const missing = ids.filter((_,i) => !values[i]);
  if(missing.length) return alert(`ちょっと、${missing.join("と")}に数字を入れなさいよ！`);

  let [a, b, c] = values.map(Number);
  if(a === 0) return alert(`ちょっと、aが0じゃ二次方程式にならないでしょ！`);

  let answer = getAnswer(a, b, c);
  answer = answer.length === 1 ? answer[0] : answer.join(`<mo>,</mo>`);

  const aHTML = formatCoef(a,'x2');
  const bHTML = formatCoef(b,'x');
  const cHTML = formatCoef(c,'c');

  document.getElementById('answer').innerHTML = 
    `か、勘違いしないでよねっ！これは仕事だから解を求めてるだけなんだからねっ！<br>` +
    `<math>${aHTML}${bHTML}${cHTML}<mo>=</mo><mn>0</mn></math><br><math><mi>x</mi><mo>=</mo></math><br>${answer}`;
});

clear.addEventListener('click', e => {
  e.preventDefault();
  ['a','b','c'].forEach(id => document.querySelector(`#${id}`).value='');
  document.getElementById('answer').innerHTML='';
});

// -------------------- 数学計算関数 --------------------
function getAnswer(a, b, c){
  while(a % 1 || b % 1 || c % 1) [a,b,c] = [a*10, b*10, c*10];
  [a,b,c] = reduceGCD(a,b,c);
  const f = b*b - 4*a*c;
  const [g,h] = reduceSquare(f);
  return solveQuadratic(2*a, -b, g, h);
}

function reduceGCD(a,b,c){
  while(a%2===0 && b%2===0 && c%2===0) [a,b,c] = [a/2, b/2, c/2];
  for(let i=3, max=Math.max(...[Math.abs(a),Math.abs(b),Math.abs(c)])+1;i<=max;i+=2)
    while(a%i===0 && b%i===0 && c%i===0) [a,b,c] = [a/i,b/i,c/i];
  return [a,b,c];
}

function reduceSquare(a){
  if(a===0) return [0,0];
  let b=1;
  while(a%4===0) [a,b]=[a/4,b*2];
  for(let i=3;i<=Math.abs(a)+1;i+=2)
    while(a%i**2===0) [a,b]=[a/(i**2),b*i];
  return [b,a];
}

function solveQuadratic(a,b,c,d){
  if(a<0) [a,b]=[-a,-b];
  let x1,x2, values;
  if(d===0) x1=x2=fraction(b,a);
  if(d===1){ values=reduceFraction(b+c,a); x1=fraction(values[0],values[1]); values=reduceFraction(b-c,a); x2=fraction(values[0],values[1]); }
  if(d>1){
    [a,b,c] = reduceGCD(a,b,c);
    const signB = b!==0 ? (b<0?'<mo>-</mo>':'<mo>+</mo>') : '';
    const absB = Math.abs(b);
    const absC = Math.abs(c);
    const coef = absC===1?'':`<mn>${absC}</mn>`;
    const numerator = `<mrow>${signB}${b!==0?'<mo>±</mo>':'<mo>±</mo>'}${coef}<msqrt><mn>${d}</mn></msqrt></mrow>`;
    x1=x2=a===1?`<math>${numerator}</math>`:`<math><mfrac>${numerator}<mn>${a}</mn></mfrac></math>`;
  }
  if(d<0){
  [a,b,c] = reduceGCD(a,b,c); 
  const negB = -b; // ← b を反転して符号を正しくする
  const absB = Math.abs(negB);
  const absC = Math.abs(c);
  const coef = absC===1?'':`<mn>${absC}</mn>`;
  const numerator = `<mrow>${negB!==0?(negB<0?'<mo>-</mo>':'<mo>+</mo>'):''}<mo>±</mo>${coef}<msqrt><mn>${-d}</mn></msqrt><mi>i</mi></mrow>`;
  x1=x2=a===1?`<math>${numerator}</math>`:`<math><mfrac>${numerator}<mn>${a}</mn></mfrac></math>`;
}
  return x1===x2?[x1]:[x1,x2];
}

function reduceFraction(a,b){
  while(a%2===0 && b%2===0) [a,b]=[a/2,b/2];
  for(let i=3, max=Math.max(Math.abs(a),Math.abs(b))+1;i<=max;i+=2)
    while(a%i===0 && b%i===0) [a,b]=[a/i,b/i];
  return [a,b];
}

function fraction(a,b){
  [a,b] = reduceFraction(a,b);
  const neg = a/b<0; const absA=Math.abs(a), absB=Math.abs(b);
  return absA%absB===0?`<math>${neg?'<mo>-</mo>':''}<mn>${absA/absB}</mn></math>`:`<math>${neg?'<mo>-</mo>':''}<mfrac><mn>${absA}</mn><mn>${absB}</mn></mfrac></math>`;
}
