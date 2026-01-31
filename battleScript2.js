const instantCanvas = document.getElementById("bCanvas");
const ctx = instantCanvas.getContext("2d");

const backGround = new Image()
backGround.src = "img/haikei.png";

const characterChip = new Image()
characterChip.src = "img/characterChip.png";

const mikatas = []
let isHit = false

let money = 0
let moneyMax = 1000
let kankaku = 0
let kankakuMax = 5

ctx.font = "30px sans-serif"
ctx.textBaseline = "top";
ctx.textAlign = "right";

/*====================
  味方クラス
====================*/
class Mikata{
    constructor(hp,at,mikataChip,mcx,mcy,tag1,tag2){
        this.mikataChip = mikataChip
        this.x = instantCanvas.width - 200
        this.y = Math.floor(Math.random() * 20) + 450

        this.hp = hp
        this.at = at

        this.mcx = mcx
        this.mcy = mcy
        this.scale = tag1
        this.type = tag2

        this.range = 0
        if(this.type === "遠距離"){
            this.range = 100   // ← 射程
        }

        // エフェクト
        this.kemuriChip = new Image()
        this.kemuriChip.src = "img/kemuriChip.png";
        this.frame = 0
        this.maisuu = 0
        this.kw = 0
        this.kh = 0
    }

    update(){
        this.x -= 0.3
    }

    attack(teki){
        teki.hp -= this.at

        // 煙エフェクト
        this.frame++
        if(this.frame > 30){
            this.frame = 0
            this.maisuu++
            this.kw = 200 * this.maisuu
            if(this.maisuu > 7) this.maisuu = 0
        }
        ctx.drawImage(
            this.kemuriChip,
            this.kw,this.kh,200,200,
            this.x-20,this.y+40,50,50
        )
    }

    draw(){
        if (this.scale === "低身長"){ 
            ctx.drawImage(this.mikataChip,this.mcx,this.mcy,100,100,this.x,this.y,100,100)
        }
        if (this.scale === "中身長"){ 
            ctx.drawImage(this.mikataChip,this.mcx,this.mcy,100,150,this.x,this.y-50,100,150)
        }
        if (this.scale === "高身長"){ 
            ctx.drawImage(this.mikataChip,this.mcx,this.mcy,100,200,this.x,this.y-100,100,200)
        }
    }
}

/*====================
  敵クラス
====================*/
class Teki{
    constructor(hp,at,tekiChip){
        this.x = 150
        this.y = 450
        this.hp = hp
        this.at = at
        this.tekiChip = tekiChip
        this.range = 0   // 敵は射程0
    }

    update(){
        this.x += 0.3
    }

    attack(mikata){
        mikata.hp -= this.at
    }

    draw(){
        ctx.drawImage(this.tekiChip,0,200,100,100,this.x,this.y,100,100)
    }
}

/*====================
  生成ボタン
====================*/
function function1(){
    mikatas.push(new Mikata(50,1,characterChip,0,0,"低身長","近距離"))
}
function function2(){
    mikatas.push(new Mikata(50,1,characterChip,0,100,"低身長","近距離"))
}
function function3(){
    mikatas.push(new Mikata(50,1,characterChip,0,300,"高身長","遠距離"))
}

/*====================
  ボタンUI
====================*/
let isClick = false
let mouseX = 0
let mouseY = 0

instantCanvas.addEventListener("click",(e)=>{
    isClick = true
    mouseX = e.clientX
    mouseY = e.clientY
})

function characterButton(m1,m2,m3){
    const log = [function1,function2,function3]
    const cost = [m1,m2,m3]

    for(let i=0;i<3;i++){
        ctx.fillStyle = "gray"
        if(money >= cost[i]){
            ctx.fillStyle = "white"
            if(isClick){
                if(140+i*110 < mouseX && mouseX < 220+i*110 &&
                   580 < mouseY && mouseY < 620){
                    log[i]()
                    money -= cost[i]
                }
            }
        }
        ctx.fillRect(140+i*110,550,80,40)
    }
    isClick = false
}

/*====================
  メイン処理
====================*/
const teki = new Teki(80,1,characterChip)

characterChip.onload = ()=>{
    animation()
}

function animation(){
    ctx.clearRect(0,0,instantCanvas.width,instantCanvas.height)
    ctx.drawImage(backGround,0,0)

    // お金
    ctx.fillStyle = "black"
    ctx.fillText(`${money}/${moneyMax}`,instantCanvas.width-10,10)

    kankaku++
    if(money < moneyMax && kankaku > kankakuMax){
        money++
        kankaku = 0
    }

    isHit = false

    for(let i=0;i<mikatas.length;i++){
        const mikata = mikatas[i]

        // 敵との距離
        const dist = mikata.x - (teki.x + 100)

        // 射程内
        if(dist <= mikata.range && dist >= 0){
            mikata.attack(teki)

            // 敵は射程0なので密着時のみ反撃
            if(dist <= teki.range){
                teki.attack(mikata)
            }
            isHit = true
        }else{
            mikata.update()
        }

        mikata.draw()
    }

    // 敵の移動
    if(!isHit){
        teki.update()
    }
    teki.draw()

    characterButton(50,150,20)

    requestAnimationFrame(animation)
}
