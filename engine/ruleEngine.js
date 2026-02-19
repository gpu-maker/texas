export class RuleEngine{

  constructor(game){
    this.game=game
    this.smallBlind=10
    this.bigBlind=20
  }

  startHand(){

    this.game.deck=new (this.game.deck.constructor)()
    this.game.community=[]
    this.game.pot=0

    this.rotateDealer()
    this.resetPlayers()
    this.collectBlinds()
    this.dealHoleCards()
  }

  rotateDealer(){
    this.game.dealerIndex=
      (this.game.dealerIndex+1)%this.game.players.length
  }

  resetPlayers(){
    this.game.players.forEach(p=>{
      p.hand=[]
      p.folded=false
      p.bet=0
    })
  }

  collectBlinds(){

    const sb=(this.game.dealerIndex+1)%this.game.players.length
    const bb=(this.game.dealerIndex+2)%this.game.players.length

    this.bet(sb,this.smallBlind)
    this.bet(bb,this.bigBlind)

    this.game.currentBet=this.bigBlind
  }

  bet(index,amount){
    const p=this.game.players[index]
    const bet=Math.min(amount,p.chips)
    p.chips-=bet
    this.game.pot+=bet
  }

  dealHoleCards(){
    for(let r=0;r<2;r++){
      this.game.players.forEach(p=>{
        p.hand.push(this.game.deck.draw())
      })
    }
  }

}
