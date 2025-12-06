const instantCanvas = document.getElementById("bCanvas");//clearRectやfillRectではctxではなくinstantCanvasで使うこと！<-
const ctx = instantCanvas.getContext("2d");
let x1 = instantCanvas.width
let y1 = 150
let x2 = 0
let y2 = 150
const characterChip = new Image()
characterChip.src = "img/characterChip.png";
characterChip.onload = function(){
    animation()
}
function animation(){
    ctx.clearRect(0,0,instantCanvas.width,instantCanvas.height)
    if (x1 < x2 + 100 && x1 + 100 > x2){
        console.log("当たり判定")
    }else{
        x1 -= 1
        x2 += 1
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