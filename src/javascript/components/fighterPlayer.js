export default class Player {
  constructor(fighter) {
    this.name = fighter.name;
    this.attack = fighter.attack;
    this.defense = fighter.defense;
    this.initialHealth = fighter.health;
    this.currentHealth = fighter.health;
    this.blocking = false;
    this.criticalHitSequence = [];
    this.criticalHitTiming = 0;
    this.lastCriticalHit = 0;
    // despite of below to evade 10s timeout on initialization
    // this.lastCriticalHit = new Date();
  }
}
