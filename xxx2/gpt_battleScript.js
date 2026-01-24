const instantCanvas = document.getElementById("bCanvas");
const ctx = instantCanvas.getContext("2d");

const backGround = new Image();
backGround.src = "img/haikei.png";

const characterChip = new Image();
characterChip.src = "img/characterChip.png";

ctx.font = "24px sans-serif";
ctx.textBaseline = "top";
ctx.textAlign = "right";

// ================= ゲーム変数 =================
const mikatas = [];
const tekis = [];

let money = 0;
let walletLv = 1;
let moneyMax = 1000;

let kankaku = 0;
let kankakuMax = 12;   // ★かなり速い

let isClick = false;
let mouseX = 0;
let mouseY = 0;

// ================= 入力 =================
instantCanvas.addEventListener("click", e => {
    isClick = true;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

// ================= 味方 =================
class Mikata{
    constructor(hp, at, range, isAoE){
        this.x = instantCanvas.width - 200;
        this.y = 450;

        this.hp = hp;
        this.maxHp = hp;
        this.at = at;
        this.range = range;
        this.isAoE = isAoE;

        this.attackInterval = 40; // ★攻撃間隔
        this.attackTimer = 0;

        this.isKnockback = false;
        this.knockbackDist = 0;
    }

    knockback(){
        this.isKnockback = true;
        this.knockbackDist = 40;
    }

    update(){
        if(this.isKnockback){
            this.x += 2;
            this.knockbackDist -= 2;
            if(this.knockbackDist <= 0){
                this.isKnockback = false;
            }
            return;
        }

        this.attackTimer++;
        this.x -= 0.3;
    }

    attack(tekiList){
        if(this.attackTimer < this.attackInterval) return;

        let attacked = false;

        if(this.isAoE){
            tekiList.forEach(t=>{
                if(Math.abs(this.x - t.x) < this.range){
                    t.damage(this.at);
                    attacked = true;
                }
            });
        }else{
            for(let t of tekiList){
                if(Math.abs(this.x - t.x) < this.range){
                    t.damage(this.at);
                    attacked = true;
                    break;
                }
            }
        }

        if(attacked){
            this.attackTimer = 0;
        }
    }

    damage(dmg){
        const prev = this.hp;
        this.hp -= dmg;

        if(prev > this.maxHp/2 && this.hp <= this.maxHp/2){
            this.knockback();
        }
    }

    draw(){
        ctx.drawImage(characterChip,0,0,100,100,this.x,this.y,100,100);
    }
}

// ================= 敵 =================
class Teki{
    constructor(hp, at){
        this.x = 150;
        this.y = 450;

        this.hp = hp;
        this.maxHp = hp;
        this.at = at;

        this.attackInterval = 50;
        this.attackTimer = 0;

        this.isKnockback = false;
        this.knockbackDist = 0;
    }

    knockback(){
        this.isKnockback = true;
        this.knockbackDist = 40;
    }

    update(){
        if(this.isKnockback){
            this.x -= 2;
            this.knockbackDist -= 2;
            if(this.knockbackDist <= 0){
                this.isKnockback = false;
            }
            return;
        }

        this.attackTimer++;
        this.x += 0.3;
    }

    attack(mikatas){
        if(this.attackTimer < this.attackInterval) return;

        for(let m of mikatas){
            if(Math.abs(this.x - m.x) < 80){
                m.damage(this.at);
                this.attackTimer = 0;
                break;
            }
        }
    }

    damage(dmg){
        const prev = this.hp;
        this.hp -= dmg;

        if(prev > this.maxHp/2 && this.hp <= this.maxHp/2){
            this.knockback();
        }
    }

    draw(){
        ctx.drawImage(characterChip,0,200,100,100,this.x,this.y,100,100);
    }
}

// ================= 敵生成 =================
tekis.push(new Teki(120, 2));

// ================= ボタン =================
function characterButton(){
    const costs = [50, 150];

    for(let i=0;i<2;i++){
        ctx.fillStyle = money >= costs[i] ? "white" : "gray";
        ctx.fillRect(140+i*110,550,80,40);

        if(isClick &&
            mouseX > 140+i*110 && mouseX < 220+i*110 &&
            mouseY > 550 && mouseY < 590 &&
            money >= costs[i]){

            if(i === 0){
                mikatas.push(new Mikata(60, 2, 80, false)); // 単体
            }
            if(i === 1){
                mikatas.push(new Mikata(40, 1, 120, true)); // 範囲
            }

            money -= costs[i];
        }
    }
}

function walletButton(){
    ctx.fillStyle = "orange";
    ctx.fillRect(10,550,110,40);
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("WALLET UP",15,555);
    ctx.textAlign = "right";

    if(isClick &&
        mouseX > 10 && mouseX < 120 &&
        mouseY > 550 && mouseY < 590 &&
        walletLv < 8 &&
        money >= walletLv * 200){

        money -= walletLv * 200;
        walletLv++;

        moneyMax += 500;

        kankakuMax -= 3;       // ★爆速化
        if(kankakuMax < 3) kankakuMax = 3;
    }
}

// ================= メインループ =================
function animation(){
    ctx.clearRect(0,0,instantCanvas.width,instantCanvas.height);
    ctx.drawImage(backGround,0,0);

    ctx.fillStyle = "black";
    ctx.fillText(`${money}/${moneyMax}`,instantCanvas.width-10,10);
    ctx.fillText(`Wallet Lv.${walletLv}`,instantCanvas.width-10,40);

    // お金増加
    kankaku++;
    if(kankaku >= kankakuMax){
        if(money < moneyMax) money++;
        kankaku = 0;
    }

    mikatas.forEach(m=>{
        m.update();
        m.attack(tekis);
        m.draw();
    });

    tekis.forEach(t=>{
        t.update();
        t.attack(mikatas);
        t.draw();
    });

    characterButton();
    walletButton();

    isClick = false;
    requestAnimationFrame(animation);
}

characterChip.onload = animation;
