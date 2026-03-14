class Monsters{
    constructor(hp,at,team){
        this.hp = hp
        this.at = at
        this.team = team
    }
    update(chara){
        this.hp -= chara.at
        if(this.hp <= 50){
            console.log("a")
        }
    }
}
class Monster1 extends Monsters{
    constructor(hp,at){
        super(hp,at)
        this.x = 5
    }
}
class Monster2 extends Monsters{
    constructor(hp,at){
        super(hp,at)
        this.y = 10
    }
}
m1 = new Monster1(1000,180)
m2 = new Monster2(200,30)
m1.update(m2)
m2.update(m1)
console.log(m1.hp,m1.at,m1.x)
console.log(m2.hp,m2.at,m2.y)