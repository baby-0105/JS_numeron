{
  'use strict';

  // ランダムな三桁の数字
  var makeRivalNumArray = (function() { // ※safari、iOSでは、letでReferenceError→そのため、var
    let rivalNumArray = [];

    return function() {
      //　配列の長さが3になるまで繰り返す。
      for (let i=0; rivalNumArray.length < 3; i++) {
        const randNum = Math.floor(Math.random() * 10)

        if(!rivalNumArray.includes(randNum)){
          rivalNumArray.push(randNum);
        }
      }

      return rivalNumArray;
    }
  })();

  var rivalNumText = makeRivalNumArray().join('');

  // eat（場所も数字も同じ数）
  function eat(myNumArray) { // eatは変化する値なので、const × → let
    let eatNum = 0;

    for(let i=0; i < myNumArray.length; i++) {
      if (myNumArray[i] === makeRivalNumArray()[i]) {
        eatNum++;
      }
    }

    return eatNum;
  }

  // bite（数字のみ同じ数）
  function bite(myNumArray) {
    let EatBiteArray = makeRivalNumArray().concat(myNumArray),

        // 2つの配列の重複した要素を、重複せずに取り出したもの
        biteArray = EatBiteArray.filter(function(val, i, arr) {
                      return arr.indexOf(val) === i && i !== arr.lastIndexOf(val);
                    });

    return biteArray.length - eat(myNumArray);
  }

  // その時々の結果の描画
  function writeResultText(myNum, myNumArray, gameNum) { // 引数の順番重要
    const result_block = document.getElementById('result_block'),
          eat_bite     = document.getElementById('eat_bite'),
          li           = document.createElement('li');

    let writeEatNum     = eat(myNumArray),
        writeBiteNum    = bite(myNumArray),
        writeEatBiteNum = `${writeEatNum}EAT ${writeBiteNum}BITE`;

    li.textContent = `${gameNum}回目：${myNum} → ${writeEatBiteNum}`;
    result_block.appendChild(li);

    eat_bite.textContent = writeEatBiteNum; // ?eat ?bite 描画
  }

  // 数字が重複していないかのチェック
  function checkDuplicate(inputNum) {
    let newInputNum = new Set(inputNum);
    return newInputNum.size === inputNum.length
  }

  function advanceGame(gameNum) {
    const input    = document.getElementById('input_num'),
          inputNum = input.value.replace(/[^\d-.]/g,'');

    if(inputNum.length === 3 && checkDuplicate(inputNum)) {
      let myNumArray = [], // 選んだ数字の定義
          my_num     = document.getElementById('my_num');

      my_num.innerHTML = inputNum; // my numberの欄に打った数字表示
      myNumArray = my_num.innerHTML.split('').map(str => parseInt(str, 10));

      setTimeout(function() {
        writeResultText(my_num.innerHTML, myNumArray, gameNum); // その時々の結果の描画

        // 3eat 0bite時
        if(eat(myNumArray) === 3) {
          setTimeout(function() {
            alert(`NumerOn! 相手の数字は、'${rivalNumText}'でした！`);
            location.reload();
          }, 1000);
        }
      }, 1000);
    } else {
      alert('※3ケタの異なる数字（半角）で入力してください!');
    }

    input.value = '';
  }

  let btnClick = (function() {
    let gameNum = 0;

    return function() {
      gameNum++;

      advanceGame(gameNum);
    }
  })();

  document.getElementById('numeron_btn').onclick = function() {
    btnClick();
  };

  // これも同様に動作する
  // document.getElementById('numeron_btn').addEventListener('click', function() {
  //   btnClick();
  // });
}