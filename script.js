const input_submit = document.querySelector(`input[id=btn_submit]`);
const clear = document.querySelector(`input[id=clear]`);
input_submit.addEventListener(`click`, function (e) {
    e.preventDefault();
    let a = document.querySelector(`input[id=a]`).value;
    let b = document.querySelector(`input[id=b]`).value;
    let c = document.querySelector(`input[id=c]`).value;
    if (a == "" && b != "" && c != "") {
        alert(`ちょっと、aに数字を入れなさいよ！`);
        return;
    }
    if (a != "" && b == "" && c != "") {
        alert(`ちょっと、bに数字を入れなさいよ！`);
        return;
    }
    if (a != "" && b == "" && c != "") {
        alert(`ちょっと、cに数字を入れなさいよ！`);
        return;
    }
    if (a == "" && b == "" && c != "") {
        alert(`ちょっと、aとbに数字を入れなさいよ！`);
        return;
    }
    if (a == "" && b != "" && c == "") {
        alert(`ちょっと、aとcに数字を入れなさいよ！`);
        return;
    }
    if (a != "" && b == "" && c == "") {
        alert(`ちょっと、bとcに数字を入れなさいよ！`);
        return;
    }
    if (a == "" && b == "" && c == "") {
        alert(`ちょっと、aとbとcに数字を入れなさいよ！`);
        return;
    }
    if (a == 0) {
        alert(`ちょっと、aが0じゃ二次方程式にならないでしょ！`);
        return;
    }
    let answer = getAnswer(a, b, c);
    if (answer.length == 1) {
        answer = answer[0];
    } else {
        answer = answer[0] + `<mo>,</mo>` + answer[1];
    }
    if (a == 1) {
      a = `<msup><mi>x</mi><mn>2</mn></msup>`;
    } else if (a == -1) {
      a = `<mo>-</mo><msup><mi>x</mi><mn>2</mn></msup>`;
    } else if (0 < a) {
      a = `<mn>${a}</mn><msup><mi>x</mi><mn>2</mn></msup>`;
    } else if (a < 0) {
      a = `<mo>-</mo><mn>${Math.abs(a)}</mn><msup><mi>x</mi><mn>2</mn></msup>`;
    }
    if (b == 1) {
      b = `<mo>+</mo><mi>x</mi>`;
    } else if (b == -1) {
      b = `<mo>-</mo><mi>x</mi>`;
    } else if (b == 0) {
      b = ``;
    } else if (0 < b) {
      b = `<mo>+</mo><mn>${b}</mn><mi>x</mi>`;
    } else if (b < 0) {
      b = `<mo>-</mo><mn>${Math.abs(b)}</mn><mi>x</mi>`;
    }
    if (c == 0) {
      c = ``;
    } else if (0 < c) {
      c = `<mo>+</mo><mn>${c}</mn>`;
    } else if (c < 0) {
      c = `<mo>-</mo><mn>${Math.abs(c)}</mn>`;
    }
    answer = `<math>${a}${b}${c}<mo>=</mo><mn>0</mn></math><br><math><mi>x</mi><mo>=</mo></math><br>` + answer;
    document.getElementById(`answer`).innerHTML = `か、勘違いしないでよねっ！これは仕事だから解を求めてるだけなんだからねっ！\n` + answer;
});

clear.addEventListener(`click`, function (e) {
    e.preventDefault();
    document.querySelector(`input[id=a]`).value = ``;
    document.querySelector(`input[id=b]`).value = ``;
    document.querySelector(`input[id=c]`).value = ``;
    document.getElementById(`answer`).innerHTML = ``;
});

function getAnswer(a, b, c) {
  let values;
  while (!(a % 1 == 0 && b % 1 == 0 && c % 1 == 0)) {
    a = a * 10;
    b = b * 10;
    c = c * 10;
  }
  values = one(a, b, c);
  a = values[0];
  b = values[1];
  c = values[2];
  let d = 2 * a;
  let e = -1 * b;
  const f = Math.pow(b, 2) - 4 * a * c;
  values = two(f);
  let g = values[0];
  let h = values[1];
  const answers = three(d, e, g, h);
  return answers;
}

function one(a, b, c) {
  while (a % 2 == 0 && b % 2 == 0 && c % 2 == 0) {
    a = a / 2;
    b = b / 2;
    c = c / 2;
  }
  for (let i = 3; i <= Math.max(...[Math.abs(a), Math.abs(b), Math.abs(c)]) + 1; i += 2) {
    while (a % i == 0 && b % i == 0 && c % i == 0) {
      a = a / i;
      b = b / i;
      c = c / i;
    }
  }
  return [a, b, c];
}

function two(a) {
  if (a == 0) {
    return [0, 0];
  }
  let b = 1;
  while (a % 4 == 0) {
    a = a / 4;
    b = b * 2;
  }
  for (let i = 3; i <= Math.abs(a) + 1; i += 2) {
    while (a % Math.pow(i, 2) == 0) {
      a = a / Math.pow(i, 2);
      b = b * i;
    }
  }
  const c = a;
  return [b, c];
}

function three(a, b, c, d) {
  if (a < 0) {
    a = a * -1;
    b = b * -1;
  }
  let a1, a2, values;
  if (d == 0) {
    a1 = five(b, a);
    a2 = a1;
  }
  if (d == 1) {
    values = four(b + c, a);
    a1 = five(values[0], values[1]);
    values = four(b - c, a);
    a2 = five(values[0], values[1]);
  }
  if (1 < d) {
    values = one(a, b, c);
    a = values[0];
    b = values[1];
    c = values[2];
    const showB = b != 0;
    const abs_b = Math.abs(b);
    const sign_b = b < 0 ? `<mo>-</mo>` : (b > 0 ? `<mo>+</mo>` : ``);
    const bPart = showB ? `${sign_b}<mn>${abs_b}</mn>` : ``;
    const abs_c = Math.abs(c);
    const coef = abs_c === 1 ? `` : `<mn>${abs_c}</mn>`;
    const root = `<msqrt><mn>${d}</mn></msqrt>`;
    const numerator = `<mrow>${bPart}${showB ? `<mo>±</mo>` : `<mo>±</mo>`}${coef}${root}</mrow>`;
    if (a === 1) {
      a1 = `<math xmlns="http://www.w3.org/1998/Math/MathML">${numerator}</math>`;
    } else {
      a1 = `<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac>${numerator}<mn>${a}</mn></mfrac></math>`;
    }
    a2 = a1;
  }
  if (d < 0) {
    values = one(a, b, c);
    a = values[0];
    b = values[1];
    c = values[2];
    d = d * -1;
    const showB = b != 0;
    const abs_b = Math.abs(b);
    const sign_b = b < 0 ? `<mo>-</mo>` : ``;
    const bPart = showB ? `${sign_b}<mn>${abs_b}</mn>` : ``;
    const abs_c = Math.abs(c);
    const coef = abs_c === 1 ? `` : `<mn>${abs_c}</mn>`;
    const root = d === 1 ? `` : `<msqrt><mn>${d}</mn></msqrt>`;
    const numerator = `<mrow>${bPart}<mo>±</mo>${coef}${root}<mi>i</mi></mrow>`;
    if (a === 1) {
      a1 = `<math xmlns="http://www.w3.org/1998/Math/MathML">${numerator}</math>`;
    } else {
      a1 = `<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac>${numerator}<mn>${a}</mn></mfrac></math>`;
    }

    a2 = a1;
  }
  if (a1 == a2) {
    return [a1];
  }
  return [a1, a2];
}

function four(a, b) {
  while (a % 2 == 0 && b % 2 == 0) {
    a = a / 2;
    b = b / 2;
  }
  for (let i = 3; i <= Math.max(Math.abs(a), Math.abs(b)) + 1; i += 2) {
    while (a % i == 0 && b % i == 0) {
      a = a / i;
      b = b / i;
    }
  }
  return [a, b];
}

function five(a, b) {
  const values = four(a, b);
  a = values[0];
  b = values[1];
  const result = a / b;
  const isNegative = result < 0;
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  if (absA % absB == 0) {
    const value = absA / absB;
    return `<math>${isNegative ? "<mo>-</mo>" : ""}<mn>${value}</mn></math>`;
  }
  return `<math>${isNegative ? "<mo>-</mo>" : ""}<mfrac><mn>${absA}</mn><mn>${absB}</mn></mfrac></math>`;
}
