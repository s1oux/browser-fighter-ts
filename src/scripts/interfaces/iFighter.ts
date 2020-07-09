export interface IFighter {
  name: string,
  attack: number,
  defense: number,
  initialHealth: number,
  currentHealth: number,
  blocking: boolean
  criticalHitSequence: string[],
  criticalHitTiming: Date | number,
  lastCriticalHit: Date | number
}

export interface IFighterModel {
  _id: string,
  name: string,
  health: number, 
  attack: number, 
  defense: number,
  source: string
}