const instantCanvas = document.getElementById("bCanvas");//clearRectやfillRectではctxではなくinstantCanvasで使うこと！<-
const ctx = instantCanvas.getContext("2d");
const backGround = new Image()
backGround.src = "img/haikei.png";
const characterChip = new Image()
characterChip.src = "img/characterChip.png";
const mikatas = []
const spawnMikata = document.getElementById("spawnMikata")
let isHit = false

class Mikata{
    constructor(hp,at,mikataChip){
        this.mikataChip = mikataChip //味方
        this.x = instantCanvas.width-200
        this.y = 450
        this.hp = hp//体力
        this.at = at//攻撃
        this.kemuriChip = new Image()//敵
        this.kemuriChip.src = "img/kemuriChip.png";
        this.frame = 0//煙をアニメーションするために必要なフレーム数
        this.maisuu = 0//煙のChipの枚数
        this.kw = 0 //煙のエフェクト幅
        this.kh = 0//煙のエフェクト高さ
    }
    update(){
        this.x -= 0.3
    }
    hantei(teki){//当たり判定を受けた時の関数
        this.hp -= teki.at
        this.frame += 1
        if (this.frame>30){
            this.frame = 0
            this.maisuu += 1
            this.kw = 200*this.maisuu
            if(this.maisuu > 7){
               this.maisuu = 0 
            }
        }
        ctx.drawImage(this.kemuriChip,this.kw,this.kh,200,200,this.x-20,this.y+40,50,50)
    }
    draw(){
        ctx.drawImage(this.mikataChip,0,0,100,100,this.x,this.y,100,100)
    }
}
class Teki{
    constructor(hp,at,tekiChip){
        this.x = 150
        this.y = 450
        this.hp = hp//体力
        this.at = at//攻撃
        this.tekiChip = tekiChip
    }
    update(){
        this.x += 0.3;
    }
    hantei(mikata){
        this.hp -= mikata.at
    }
    draw(){
        ctx.drawImage(this.tekiChip,0,100,100,100,this.x,this.y,100,100)
    }
}
function function1(){
    console.log("あ")
    mikatas.push(new Mikata(50,1,characterChip))
}
function function2(){
    console.log("い")
}
function function3(){
    console.log("う")
}
function function4(){
    console.log("え")
}
function function5(){
    console.log("お")
}
let isClick = false
let mouseX = 0
let mouseY = 0
instantCanvas.addEventListener("click", (e) => {
    isClick = true
    mouseX = e.clientX
    mouseY = e.clientY
});
function button(){
    let x= 10
    let y = 550
    let log = [function1,function2,function3,function4,function5]
    for (let i = 0; i < 5; i++ ){
        ctx.fillRect(i*110,y,80,40)
        if(isClick == true){
            if(i*110 < mouseX && i*110+80 > mouseX && 580 < mouseY && 620 > mouseY){
                log[i]()
                //console.log(mouseX,mouseY)
            }
        }
    }
    isClick = false
}
const teki = new Teki(80,1,characterChip)
characterChip.onload = function(){
    animation()
}
//-------------------------------------------------------------------------------------------------------------------
function animation(){
    ctx.clearRect(0,0,instantCanvas.width,instantCanvas.height)
    ctx.drawImage(backGround,0,0)
    for (let i=0; i < mikatas.length; i++){
        mikata = mikatas[i]
        if (mikata.x+30 < teki.x + 100 && mikata.x + 100 > teki.x){
            console.log("当たり判定")
            mikata.hantei(teki)
            teki.hantei(mikata)
            isHit = true
        }else{
            mikata.update()
        }
        mikata.draw()
    }
    if(isHit == false){
        teki.update()
    }
    teki.draw()
    button()
    requestAnimationFrame(animation)
};
