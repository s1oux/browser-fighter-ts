import { IFighter, IFighterModel } from '../interfaces/iFighter';

export default class Player implements IFighter {
  name: string
  attack: number
  defense: number
  initialHealth: number
  currentHealth: number
  blocking: boolean
  criticalHitSequence: string[]
  criticalHitTiming: Date | number
  lastCriticalHit: Date | number

  constructor(fighter: IFighterModel) {
    this.name = fighter.name;
    this.attack = fighter.attack;
    this.defense = fighter.defense;
    this.initialHealth = fighter.health;
    this.currentHealth = fighter.health;
    this.blocking = false;
    this.criticalHitSequence = [];
    this.criticalHitTiming = 0;
    this.lastCriticalHit = 0;
  }
}
