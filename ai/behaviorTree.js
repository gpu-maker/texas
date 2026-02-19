export class BehaviorTreeAI{

  decide(player,game){

    if(player.folded) return "fold"

    const strength=this.evaluateHandStrength(player,game)
    const potOdds=game.currentBet/(game.pot+1)

    // bluff chance
    if(Math.random()<0.12 && strength<0.4) return "raise"

    if(strength>0.8) return "raise"
    if(strength>0.5) return "call"
    if(potOdds<0.15) return "call"

    return "fold"
  }

  evaluateHandStrength(player,game){

    const cards=[...player.hand,...game.community]

    if(cards.length<5) return Math.random()*0.6

    let values=cards.map(c=>this.rankValue(c.value))
    values.sort((a,b)=>b-a)

    let score=values[0]/14

    if(this.hasPair(values)) score+=0.2
    if(this.hasTwoPair(values)) score+=0.35
    if(this.hasTrips(values)) score+=0.5

    return Math.min(score,1)
  }

  rankValue(v){
    if(v==="A") return 14
    if(v==="K") return 13
    if(v==="Q") return 12
    if(v==="J") return 11
    return v
  }

  hasPair(values){
    return new Set(values).size!==values.length
  }

  hasTwoPair(values){
    const counts={}
    values.forEach(v=>counts[v]=(counts[v]||0)+1)
    return Object.values(counts).filter(v=>v>=2).length>=2
  }

  hasTrips(values){
    const counts={}
    values.forEach(v=>counts[v]=(counts[v]||0)+1)
    return Object.values(counts).some(v=>v>=3)
  }

}
