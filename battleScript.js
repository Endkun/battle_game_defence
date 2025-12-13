const instantCanvas = document.getElementById("bCanvas");//clearRectやfillRectではctxではなくinstantCanvasで使うこと！<-
const ctx = instantCanvas.getContext("2d");
let x1 = instantCanvas.width-200
let y1 = 450
let x2 = 150
let y2 = 450
let hp1 = 120
let hp2 = 100
let at1 = 1
let at2 = 1
const backGround = new Image()
backGround.src = "img/haikei.png";
const characterChip = new Image()
characterChip.src = "img/characterChip.png";
characterChip.onload = function(){
    animation()
}
function animation(){
    ctx.clearRect(0,0,instantCanvas.width,instantCanvas.height)
    ctx.drawImage(backGround,0,0)
    if (x1 < x2 + 100 && x1 + 100 > x2){
        console.log("当たり判定")
        hp1 -= at1
        hp2 -= at2
        gifler("img/at_effect.gif").frames(instantCanvas, (ctx, frame) => {
            ctx.drawImage(
                frame.buffer,
                x1, y1-50,   // x, y
                64, 64      
            );
        });
    }else{
        x1 -= 0.3
        x2 += 0.3
    }
    ctx.drawImage(characterChip,0,0,100,100,x1,y1,100,100)
    ctx.drawImage(characterChip,0,100,100,100,x2,y2,100,100)
    requestAnimationFrame(animation)
}

// 来週やる事
// ・地面を作る
// ・キャンバスを枠で囲う
// ・キャラクターチップの画像の透明化
// ・高さ合わせる
// ・お互いのキャラクターにHP(hit point)/AP(attack point)を作る
// ・↑をもとに戦わせる
// ・煙のようなエフェクトを付ける
// ・軽い攻撃＆移動のアニメーション
// 早めにできたら
// ・ボタンを作って押したら味方が出現する