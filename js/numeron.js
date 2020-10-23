{
  'use strict';

  // ランダムな三桁の数字
  let makeRivalNumArray = (function() {
    let rivalNumArray = [];

    return function() {
      //　配列の長さが3になるまで繰り返す。
      for (let i = 0; rivalNumArray.length < 3; i++) {
        const randNum = Math.floor(Math.random() * 10) // 0~9までのランダムな整数

        if(!rivalNumArray.includes(randNum)){ // 一度出た数字がなければ、配列に数字を足す
          rivalNumArray.push(randNum);
        }
      }

      return rivalNumArray;
    }
  })();

  let rivalNumText = makeRivalNumArray().join('');
  // console.log(rivalNumText);

  // eat（場所も数字も同じ数）
  function eat(myNumArray) { // eatは変化する値なので、const × → let
    let eatNum = 0;

    for(let i=0; i < myNumArray.length; i++) { // eatの数
      if (myNumArray[i] === makeRivalNumArray()[i]) {
        eatNum++;
      }
    }

    return eatNum;
  }

  // bite（数字のみ同じ数）
  function bite(myNumArray) {
    let EatBiteArray = makeRivalNumArray().concat(myNumArray), // 2つの配列を足した配列

        // 2つの配列の重複した要素を、重複せずに取り出したもの
        biteArray = EatBiteArray.filter(function(val, i, arr) {
                      // arr.indexOf(val)：配列の中でその要素が最初に現れるindex番号の取得
                      return arr.indexOf(val) === i && i !== arr.lastIndexOf(val);
                    });

    return biteArray.length - eat(myNumArray);
  }

  // その時々の結果の描画
  function writeResultText(myNum, myNumArray, gameNum) { // 引数の順番は大事！
    const result_block   = document.getElementById('result_block'),
          eatBite        = document.getElementById('eat_bite'),
          li             = document.createElement('li');

    let writeEatNum     = eat(myNumArray),
        writeBiteNum    = bite(myNumArray),
        writeEatBiteNum = `${writeEatNum}EAT ${writeBiteNum}BITE`;

    li.textContent = `${gameNum}回目：${myNum} → ${writeEatBiteNum}`;
    result_block.appendChild(li);

    eatBite.textContent = writeEatBiteNum; // ?eat ?bite 描画（main）
  }

  // 数字が重複していないかのチェック
  function checkDuplicate(inputNum) {
    let newInputNum = new Set(inputNum);
    return newInputNum.size === inputNum.length
  }

  function advanceGame(gameNum) {
    const input = document.getElementById('input_num'),
          inputNum = input.value.replace(/[^\d-.]/g,''); // 数字であれば値を返す（replace(/[^\d-.]/g,'')）

    // 3文字以内、かつ、異なる数字→テキスト表示 / そうでないなら、ゲーム進まない
    if(inputNum.length === 3 && checkDuplicate(inputNum)) {
      let myNumArray = [], // 選んだ数字の定義
          my_num = document.getElementById('my_num');

      my_num.innerHTML = inputNum; // my numberの欄に打った数字表示
      myNumArray = my_num.innerHTML.split('').map(str => parseInt(str, 10)); // my_numの数字の文字列をデータ型numberとして配列に格納

      setTimeout(function() {
        writeResultText(my_num.innerHTML, myNumArray, gameNum); // その時々の結果の描画

        // 3eat 0biteになった時
        if(eat(myNumArray) === 3) {
          setTimeout(function() {
            alert(`NumerOn! 相手の数字は、'${rivalNumText}'でした！`);
            location.reload(); // ゲームリセット（ページの再読み込み）
          }, 1000);
        }
      }, 1000);
    } else {
      alert('※3ケタの異なる数字（半角）で入力してください!');
    }

    input.value = ''; // ボタンクリック後、inputの中をカラに。
  }

  let btnClick = (function() {
    let gameNum = 0; // ゲーム回数

    return function() {
      gameNum++; // ゲーム回数のカウント

      advanceGame(gameNum);
    }
  })();

  document.getElementById('numeron_btn').addEventListener('click', function() {
    btnClick();
  });
}