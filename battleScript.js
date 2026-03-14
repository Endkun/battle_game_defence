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
class Character{
    constructor(team,hp,at,ats,mkb,characterChip,mcx,mcy,scale,attackType,name){
        //------------------------------キャラ
        this.characterChip = characterChip
        this.team = team
        if(this.team == "kitty"){
            this.x = instantCanvas.width-200 //味方はinstantCanvas.width-200(右端から200左)固定
        }
        if (this.team == "dog"){
            this.x = 150 //敵は150固定
        }
        this.sety = Math.floor(Math.random() * 20) + 450
        this.y = this.sety
        this.vy = -3
        this.hp = hp//体力
        this.at = at//攻撃
        this.mcx = mcx//キャラクターチップx
        this.mcy = mcy//キャラクターチップy
        this.scale = scale//身長(低身長か中身長か高身長か),低身長は0~100px 中身長は100~150px,高身長は150px以上
        this.type = attackType//近距離攻撃or遠距離攻撃
        this.status = "run" //キャラのステータス(run attack dead knockback)
        this.name = name //キャラの名前
        this.range = 0
        this.atsframe = 0
        this.maxattackspeed = ats
        this.maxHp = hp
        this.kb = 1
        this.maxKb = mkb
        this.kkb = 0
        this.rotation = 0  
        this.kCount = 0 //knockbackCount
        if (this.type == "近距離"){
            this.range = 0
        }
        if (this.type == "遠距離"){
            this.range = 50
        }

        //-------------------------------煙
        this.kemuriChip = new Image()//敵
        this.kemuriChip.src = "img/kemuriChip.png";  
        this.frame = 0//煙をアニメーションするために必要なフレーム数
        this.maisuu = 0//煙のChipの枚数
        this.kw = 0 //煙のエフェクト幅
        this.kh = 0//煙のエフェクト高さ
        //-------------------------------昇天
        this.syouten = new Image()
        this.syouten.src = "img/syouten.png"; 
        this.sx = 0//昇天x
        this.sy = 0//昇天y         
    }
    update(aiteCharas){
        this.vy += 0.03
        this.y += this.vy
        if (this.y >= this.sety){
            this.y = this.sety
            this.vy = 0
        }
        if (this.status != "dead"){
            let aiteChara = null
            for (let i=0; i < aiteCharas.length; i++){
                aiteChara = aiteCharas[i]
                if (this.status != "knockback"){
                    if (this.team === "kitty"){
                        if (this.x+30-this.range < aiteChara.x + 100 && this.x + 100 > aiteChara.x){
                            this.status = "attackChara"
                            break//あたったらfor文でbreakすることによりこれ以上動かないようにする
                        }else{
                            this.status = "run"
                        }
                    }
                    if (this.team === "dog"){
                        if (aiteChara.x+30-this.range < this.x + 100 && aiteChara.x + 100 > this.x){
                            this.status = "attackChara"
                            break
                        }else{
                            this.status = "run"
                        }
                    }
                }
            }     
            if (this.team === "kitty"){
                if(this.x <= 150 && this.x >= 0){
                    this.status = "attackCastle"
                }
                if(this.status == "run"){
                    this.x -= 0.3
                }
            }else if(this.team === "dog"){
                if (this.x >= 580 && this.x <= 700){
                    this.status = "attackCastle"    
                }
                if (this.status == "run"){
                    this.x += 0.3;
                }
            }
            if (this.status == "attackChara"){
                this.hantei(aiteChara)
            }

            if (this.status == "knockback"){
                if (this.team ==="kitty"){
                    this.rotation = 25 * Math.PI / 180
                    
                }else if (this.team == "dog"){
                    this.rotation = -25 * Math.PI / 180
                }
                this.kb += 1
            }
            if(this.status == "dead"){
                this.sx = this.x
                this.sy = this.y
                if(this.team === "kitty"){
                    this.x = -1000
                }else if(this.team === "dog"){
                    this.x = 1000
                }
            }
            this.draw()
        }          
    }
    hantei(aiteChara){
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
            aiteChara.hp -= this.at   //攻撃対象修正
            this.atsframe = 0
        }
        if(this.team === "kitty"){
            ctx.drawImage(this.kemuriChip,this.kw,this.kh,200,200,this.x-20,this.y+40,50,50)
        }else if(this.team === "dog"){
            ctx.filter = "hue-rotate(180deg)";
            ctx.drawImage(this.kemuriChip,this.kw,this.kh,200,200,this.x+80,this.y-20,50,50)
            ctx.filter = "none";            
        }
        this.kkb = this.maxHp * (1 - this.kb / this.maxKb)
        if (this.hp <= this.kkb){
            this.status = "knockback"
        }
        if(this.hp <= 0){
            this.status = "dead"
        }
    }
    draw(){
        if (this.status == "knockback"){
            ctx.save()
            ctx.translate(this.x+50,this.y+50)
            ctx.rotate(this.rotation)
            if (this.scale == "低身長"){ 
                ctx.drawImage(this.characterChip,this.mcx,this.mcy,100,100,-50,-50,100,100)
            }
            if (this.scale == "中身長"){ 
                ctx.drawImage(this.characterChip,this.mcx,this.mcy,100,150,-50,0,100,150)
            }
            if (this.scale == "高身長"){ 
                ctx.drawImage(this.characterChip,this.mcx,this.mcy,100,200,-50,-150,100,200)
            }
            this.kCount += 1
            if (this.kCount<= 150){
                if (this.team === "kitty"){
                    this.x += 0.5
                }
                if (this.team === "dog"){
                    this.x -= 0.5
                }
                if (this.kCount== 1){
                    this.vy -= 1
                }
                if(this.kCount>= 150){
                    this.vy -= 1
                }
            }else{
                this.status = "run"   
                this.kCount= 0
            }
        }else{
            if (this.scale == "低身長"){ 
                ctx.drawImage(this.characterChip,this.mcx,this.mcy,100,100,this.x,this.y,100,100)
            }
            if (this.scale == "中身長"){ 
                ctx.drawImage(this.characterChip,this.mcx,this.mcy,100,150,this.x,this.y-50,100,150)
            }
            if (this.scale == "高身長"){ 
                ctx.drawImage(this.characterChip,this.mcx,this.mcy,100,200,this.x,this.y-100,100,200)
            }
        }
        ctx.restore();
        if (this.status == "dead"){
            ctx.drawImage(this.syouten,0,0,100,100,this.sx,this.sy,50,50)
            this.sy -= 1
        }
    }
}
class Mikata extends Character{
    constructor(team,hp,at,ats,mkb,characterChip,mcx,mcy,scale,attackType,name){
        super(team,hp,at,ats,mkb,characterChip,mcx,mcy,scale,attackType,name)
    }
}
class Teki extends Character{
    constructor(team,hp,at,ats,mkb,characterChip,mcx,mcy,scale,attackType,name){
        super(team,hp,at,ats,mkb,characterChip,mcx,mcy,scale,attackType,name)
    }
}
class mikataCastle{
    constructor(){
        this.hp = 30000
        this.maxHp = this.hp
        this.status = "safe" //safe broke 
    }
    update(tekis){
        for (let i = 0; i < tekis.length; i++){
            teki = tekis[i]
            if (this.hp <= 0){
                this.status = "broke"
                teki.status = "end"
                //console.log("make")
            }
            if(teki.status == "attackCastle"){
                this.hp -= teki.at
            }
        }
        for (let i = 0; i < mikatas.length; i++){
            mikata = mikatas[i]
            if(this.status == "broke"){
                mikata.status = "dead"
            }
        }
    }
    draw(){
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.hp+"/"+this.maxHp, 770, 300);
    }
}
class tekiCastle{
    constructor(){
        this.hp = 30000
        this.maxHp = this.hp
        this.status = "safe" //safe broke 
    }
    update(mikatas){
        for (let i = 0; i < mikatas.length; i++){
            mikata = mikatas[i]
            if (this.hp <= 0){
                this.status = "broke"
                mikata.status = "end"
                //console.log("make")
            }
            if(mikata.status == "attackCastle"){
                this.hp -= mikata.at
            }
        }
    }
    draw(){
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.hp+"/"+this.maxHp, 170, 300);
    }
}
function function1(){
    console.log("あ")
    mikatas.push(new Mikata("kitty",50,10,50,2,characterChip,0,0,"低身長","近距離","キティ"))
    
}
function function2(){
    mikatas.push(new Mikata("kitty",50,25,50,2,characterChip,0,100,"低身長","近距離","バトルキティ"))
}
function function3(){
    mikatas.push(new Mikata("kitty",100,20,100,4,characterChip,0,300,"高身長","遠距離","ギャルキティ"))
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
const teki1 = new Teki("dog",50,10,40,2,characterChip,0,200,"低身長","近距離","a")
const teki2 = new Teki("dog",100,5,40,2,characterChip,0,200,"低身長","近距離","b")
const teki3 = new Teki("dog",100,10,40,2,characterChip,0,200,"低身長","近距離","c")
let tekis = [teki1]
//let saveTekis = []
let saveTekis = [teki2,teki3]
let tekiSpawnCount = 0
const mCastle = new mikataCastle()
const tCastle = new tekiCastle()
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
            //console.log(tekis)
        }
    }
    for (let i=0; i < mikatas.length; i++){
        mikata = mikatas[i]
        mikata.update(tekis)
        mikata.draw()
    }
    for (let i=0; i < tekis.length; i++){
        teki = tekis[i]
        teki.update(mikatas)
        teki.draw()
    }
    mCastle.update(tekis)
    mCastle.draw()
    tCastle.update(mikatas)
    tCastle.draw()
    characterButton(50,150,20,1000,1000)
    moneyButton()
    houdaiButton()
    requestAnimationFrame(animation)
};
