function foo(arg) {
  arg();
}

function bar() {
  console.log(bar);
}

foo(bar);
foo(bar)();

function foo2(arg = 1) {
  console.log(arg); //1
}

foo();

function foo3(arg, ...rest) {
  console.log(rest);
}

foo(1, 2, 3, 4);

// 함수 표현식
const foo = function () {
  console.log('foo2');
};

// 생성자 함수
const foo = new Function(console.log('foo3'));

// 화살표함수
const foo = () => {};

//1. IIFE (즉시 실행 함수)
function foo(arg) {
  if (arg === 3) return;

  console.log(arg);
  foo(arg + 1);
}
foo(1);

//2. 중첩 함수
function foo(arg) {
  function bar() {
    console.log(arg);
  }
  bar();
}

// 3 콜백함수
function foo(arg) {
  arg();
}

foo(() => {
  console.log(1);
});
