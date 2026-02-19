export class HandEvaluator{

  static rankHand(cards){

    const values=cards.map(c=>this.val(c.value)).sort((a,b)=>b-a)
    const suits=cards.map(c=>c.suit)

    const counts={}
    values.forEach(v=>counts[v]=(counts[v]||0)+1)

    const groups=Object.values(counts).sort((a,b)=>b-a)

    const flush=this.isFlush(suits)
    const straight=this.isStraight(values)

    if(straight && flush) return 8
    if(groups[0]===4) return 7
    if(groups[0]===3 && groups[1]===2) return 6
    if(flush) return 5
    if(straight) return 4
    if(groups[0]===3) return 3
    if(groups[0]===2 && groups[1]===2) return 2
    if(groups[0]===2) return 1

    return 0
  }

  static val(v){
    if(v==="A") return 14
    if(v==="K") return 13
    if(v==="Q") return 12
    if(v==="J") return 11
    return v
  }

  static isFlush(suits){
    return new Set(suits).size===1
  }

  static isStraight(values){
    let uniq=[...new Set(values)]
    for(let i=0;i<uniq.length-4;i++){
      if(uniq[i]-uniq[i+4]===4) return true
    }
    return false
  }

}
