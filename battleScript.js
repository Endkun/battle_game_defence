const instantCanvas = document.getElementById("bCanvas");//clearRectやfillRectではctxではなくinstantCanvasで使うこと！<-
const ctx = instantCanvas.getContext("2d");
const backGround = new Image()
backGround.src = "img/haikei.png";
const characterChip = new Image()
characterChip.src = "img/characterChip.png";
const mikatas = []
const spawnMikata = document.getElementById("spawnMikata")
let money = 0
let moneyMax = 1000
let kankaku = 0
let kankakuMax = 5
ctx.font = "30px sans-serif"
ctx.textBaseline = "top";
ctx.textAlign = "right";
class Mikata{
    constructor(hp,at,ats,mkb,mikataChip,mcx,mcy,tag1,tag2){
        this.mikataChip = mikataChip //味方
        this.x = instantCanvas.width-200
        this.y = Math.floor(Math.random() * 20) + 450
        this.hp = hp//体力
        this.at = at//攻撃
        this.kemuriChip = new Image()//敵
        this.kemuriChip.src = "img/kemuriChip.png";
        this.frame = 0//煙をアニメーションするために必要なフレーム数
        this.maisuu = 0//煙のChipの枚数
        this.kw = 0 //煙のエフェクト幅
        this.kh = 0//煙のエフェクト高さ
        this.mcx = mcx//キャラクターチップx
        this.mcy = mcy//キャラクターチップy
        this.scale = tag1//身長(低身長か中身長か高身長か),低身長は0~100px 中身長は100~150px,高身長は150px以上
        this.type = tag2//近距離攻撃or遠距離攻撃
        this.status = "run" //run attack dead
        this.range = 0
        this.atsframe = 0
        this.maxattackspeed = ats
        this.maxHp = hp
        this.kb = 0
        this.maxKb = mkb
        this.kkb = 0
        if (this.type == "近距離"){
            this.range = 0
        }
        if (this.type == "遠距離"){
            this.range = 50
        }
    }
    update(tekis){
        this.status = "run"
        for (let i=0; i < tekis.length; i++){
            teki = tekis[i]
            if (this.x+30-this.range < teki.x + 100 && this.x + 100 > teki.x){
                //console.log("当たり判定")
                //console.log(this.range)
                this.hantei(teki)
                this.status = "attack"
                console.log("a")
                break//あたったらfor文でbreakすることによりこれ以上動かないようにする
            }
        }
        if(this.x <= 150){
            this.status = "attack"
        }
        if(this.status == "run"){
            this.x -= 0.3
        }
        this.draw()
    }
    hantei(teki){//当たり判定を受けた時の関数
        this.frame += 1
        this.atsframe += 1
        if (this.frame>30){
            this.frame = 0
            this.maisuu += 1
            this.kw = 200*this.maisuu
            if(this.maisuu > 7){
               this.maisuu = 0 
            }
        }
        if(this.atsframe >= this.maxattackspeed*10){
            this.hp -= teki.at
            this.atsframe = 0
        }
        ctx.drawImage(this.kemuriChip,this.kw,this.kh,200,200,this.x-20,this.y+40,50,50)
        this.kkb = this.maxHp * (1 - this.kb / this.maxKb)
        if (this.hp <= this.kkb){
            this.x += 50
            this.kb += 1
        }
        if(this.hp <= 0){
            console.log("死亡")
            this.status = "dead"
            this.x = -1000
        }
    }
    draw(){
        if (this.scale == "低身長"){ 
            ctx.drawImage(this.mikataChip,this.mcx,this.mcy,100,100,this.x,this.y,100,100)
        }
        if (this.scale == "中身長"){ 
            ctx.drawImage(this.mikataChip,this.mcx,this.mcy,100,150,this.x,this.y-50,100,150)
        }
        if (this.scale == "高身長"){ 
            ctx.drawImage(this.mikataChip,this.mcx,this.mcy,100,200,this.x,this.y-100,100,200)
        }
    }
}
class Teki{
    constructor(hp,at,ats,mkb,tekiChip,mcx,mcy,tag1,tag2,name){
        this.x = 150
        this.y = Math.floor(Math.random() * 20) + 450
        this.hp = hp//体力
        this.at = at//攻撃
        this.tekiChip = tekiChip
        this.kemuriChip = new Image()//敵
        this.kemuriChip.src = "img/kemuriChip.png";
        this.frame = 0//煙をアニメーションするために必要なフレーム数
        this.maisuu = 0//煙のChipの枚数
        this.kw = 0 //煙のエフェクト幅
        this.kh = 0//煙のエフェクト高さ
        this.mcx = mcx//キャラクターチップx
        this.mcy = mcy//キャラクターチップy
        this.scale = tag1//身長(低身長か中身長か高身長か),低身長は0~100px 中身長は100~150px,高身長は150px以上
        this.type = tag2//近距離攻撃or遠距離攻撃
        this.status = "run" //run attack dead
        this.range = 0
        this.atsframe = 0
        this.maxattackspeed = ats
        this.maxHp = hp
        this.kb = 1
        this.maxKb = mkb
        this.kkb = 0
        this.name = name
        if (this.type == "近距離"){
            this.range = 0
        }
        if (this.type == "遠距離"){
            this.range = 50
        }
    }
    update(mikatas){
        this.status = "run"
        for (let i=0; i < mikatas.length; i++){
            mikata = mikatas[i]
            if (mikata.x+30 < this.x + 100 && mikata.x + 100 > this.x){
                //console.log("当たり判定,敵側")
                this.hantei(mikata)
                this.status = "attack"
                break//あたったらfor文でbreakすることによりこれ以上動かないようにする
            }
        }
        if (this.x >= 580){
            this.status = "attack"    
        }
        if (this.status == "run"){
            this.x += 0.3;
        }
        this.draw()
    }
    hantei(mikata){
        this.atsframe += 1
        this.frame += 1
        if(this.status == "attack"){
            if (this.frame>30){
                this.frame = 0
                this.maisuu += 1
                this.kw = 200*this.maisuu
                if(this.maisuu > 7){
                this.maisuu = 0 
                }
            }
            ctx.filter = "hue-rotate(180deg)";
            ctx.drawImage(this.kemuriChip,this.kw,this.kh,200,200,this.x+80,this.y-20,50,50)
            ctx.filter = "none";
        }
        //console.log("a")
        if(this.atsframe >= this.maxattackspeed*10){
            //console.log("b")
            this.hp -= mikata.at
            console.log("敵側hp",this.hp)
            this.atsframe = 0
        }
        this.kkb = this.maxHp * (1 - this.kb / this.maxKb)
        if (this.hp <= this.kkb){
            this.x -= 50
            this.kb += 1
        }
        if(this.hp <= 0){
            console.log("死亡")
            this.status = "dead"
            this.x = 1000
        }
    }
    draw(){
        ctx.drawImage(this.tekiChip,0,200,100,100,this.x,this.y,100,100)
    }
}


function function1(){
    console.log("あ")
    mikatas.push(new Mikata(50,10,50,2,characterChip,0,0,"低身長","近距離"))
    
}
function function2(){
    mikatas.push(new Mikata(50,25,50,2,characterChip,0,100,"低身長","近距離"))
}
function function3(){
    mikatas.push(new Mikata(100,20,100,4,characterChip,0,300,"高身長","遠距離"))
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
function characterButton(m1,m2,m3,m4,m5){
    let x= 10
    let y = 550
    let log = [function1,function2,function3,function4,function5]
    let onMoney = [m1,m2,m3,m4,m5]
    for (let i = 0; i < 5; i++ ){
        ctx.fillStyle = "gray";
        if(money > onMoney[i]){
            ctx.fillStyle = "white"
            if(isClick == true){
                if(140+i*110 < mouseX && 140+i*110+80 > mouseX && 580 < mouseY && 620 > mouseY){
                    log[i]()
                    //console.log(mouseX,mouseY)
                    money -= onMoney[i]
                }
            }
        }
        ctx.fillRect(140+i*110,y,80,40)
    }
    isClick = false
}
function moneyButton(){

}
function houdaiButton(){
    let aaaaaaa= 0
}
characterChip.onload = function(){
    animation()
}
//------------------
const teki1 = new Teki(50,10,40,2,characterChip,0,0,"低身長","近距離","a")
const teki2 = new Teki(100,5,40,2,characterChip,0,0,"低身長","近距離","b")
const teki3 = new Teki(100,10,40,2,characterChip,0,0,"低身長","近距離","c")
let tekis = [teki1]
let saveTekis = [teki2,teki3]
let tekiSpawnCount = 0
//-------------------------------------------------------------------------------------------------------------------
function animation(time){
    ctx.clearRect(0,0,instantCanvas.width,instantCanvas.height)
    ctx.drawImage(backGround,0,0)
    ctx.fillStyle = "black";
    ctx.fillText(`${money}/${moneyMax}`,instantCanvas.width-10, 10)
    kankaku += 1
    tekiSpawnCount += 1
    if(money < moneyMax){
        if(kankaku > kankakuMax){
            money += 1
            kankaku = 0
        }
    }
    if(tekiSpawnCount >= 300){
        if(saveTekis.length >= 1){
            tekis.push(saveTekis[0])
            saveTekis.shift();
            tekiSpawnCount = 0
            console.log(tekis)
        }
    }
    for (let i=0; i < mikatas.length; i++){
        mikata = mikatas[i]
        mikata.update(tekis)
    }
    for (let i=0; i < tekis.length; i++){
        teki = tekis[i]
        teki.update(mikatas)
        teki.draw()
    }
    characterButton(50,150,20,1000,1000)
    moneyButton()
    houdaiButton()
    requestAnimationFrame(animation)
};
