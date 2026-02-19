import {RuleEngine} from "./engine/ruleEngine.js"
import {BehaviorTreeAI} from "./ai/behaviorTree.js"
import {HandEvaluator} from "./engine/handEvaluator.js"

/* ---------- CARD + DECK ---------- */

class Card{
  constructor(suit,value){
    this.suit=suit
    this.value=value
  }
}

class Deck{
  constructor(){
    this.cards=[]
    const suits=["S","H","D","C"]
    const values=[2,3,4,5,6,7,8,9,10,"J","Q","K","A"]

    for(let s of suits){
      for(let v of values){
        this.cards.push(new Card(s,v))
      }
    }

    this.shuffle()
  }

  shuffle(){
    for(let i=this.cards.length-1;i>0;i--){
      let j=Math.floor(Math.random()*(i+1))
      ;[this.cards[i],this.cards[j]]=[this.cards[j],this.cards[i]]
    }
  }

  draw(){
    return this.cards.pop()
  }
}

/* ---------- PLAYER ---------- */

class Player{
  constructor(name,ai=false){
    this.name=name
    this.ai=ai
    this.hand=[]
    this.chips=1000
    this.bet=0
    this.folded=false
  }
}

/* ---------- MAIN GAME ---------- */

class PokerGame{

  constructor(){
    this.players=[]
    this.community=[]
    this.pot=0
    this.dealerIndex=0
    this.currentBet=0

    this.deck=new Deck()
    this.ruleEngine=new RuleEngine(this)
    this.ai=new BehaviorTreeAI()

    this.setupPlayers()
    this.renderPlayers()
    this.startHand()
  }

  setupPlayers(){
    this.players.push(new Player("YOU"))
    this.players.push(new Player("AI 1",true))
    this.players.push(new Player("AI 2",true))
    this.players.push(new Player("AI 3",true))
  }

  startHand(){
    this.ruleEngine.startHand()
    this.renderPlayers()
    this.updatePot()
    this.runAITurns()
  }

  /* ---------- PLAYER ACTION ---------- */

  playerAction(type){

    const player=this.players[0]

    if(type==="fold") player.folded=true

    if(type==="call") this.betPlayer(player,this.currentBet)

    if(type==="raise"){
      this.currentBet+=20
      this.betPlayer(player,this.currentBet)
    }

    this.runAITurns()
    this.updatePot()
  }

  betPlayer(player,amount){
    const bet=Math.min(amount,player.chips)
    player.chips-=bet
    this.pot+=bet
    this.animateChipsToPot()
  }

  /* ---------- AI ---------- */

  runAITurns(){
    this.players.forEach(p=>{
      if(!p.ai || p.folded) return

      const decision=this.ai.decide(p,this)

      if(decision==="raise"){
        const bet=50
        p.chips-=bet
        this.pot+=bet
      }

      if(decision==="call"){
        const bet=Math.min(this.currentBet,p.chips)
        p.chips-=bet
        this.pot+=bet
      }

      if(decision==="fold") p.folded=true
    })
  }

  /* ---------- UI ---------- */

  renderPlayers(){
    const container=document.getElementById("players")
    container.innerHTML=""

    const radius=300
    const centerX=window.innerWidth/2
    const centerY=window.innerHeight/2

    this.players.forEach((p,i)=>{
      const angle=(i/this.players.length)*Math.PI*2
      const x=centerX+Math.cos(angle)*radius
      const y=centerY+Math.sin(angle)*radius

      const div=document.createElement("div")
      div.className="player"
      div.style.left=x+"px"
      div.style.top=y+"px"

      div.innerHTML=`
        <div>${p.name}</div>
        <div class="cards"></div>
        <div>Chips: $${p.chips}</div>
      `

      container.appendChild(div)
    })
  }

  updatePot(){
    document.getElementById("pot").innerText="Pot: $"+this.pot
  }

  animateChipsToPot(){
    const chip=document.createElement("div")
    chip.className="chip"
    chip.style.backgroundImage="url(assets/chips/chip_red.png)"
    chip.style.left="50%"
    chip.style.top="80%"
    document.body.appendChild(chip)

    setTimeout(()=>{
      chip.style.top="50%"
    },50)

    setTimeout(()=>chip.remove(),600)
  }

}

window.game=new PokerGame()
