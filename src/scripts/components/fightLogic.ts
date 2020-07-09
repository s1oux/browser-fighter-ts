import { IFighter } from '../interfaces/iFighter';

export const updateHealthIndicator = (
  fighter:IFighter, side: 'right' | 'left'
): void => {
  document.getElementById(`${side}-fighter-indicator`)!.style.width = `${Math.round(
    (fighter.currentHealth / fighter.initialHealth) * 100
  )}%`;
};

export const getCriticalHit = (fighter: IFighter): number => {
  return fighter.attack * 2;
};

export const getDamage = (
  attacker: IFighter,
  defender: IFighter
): number => {
  if (attacker.blocking || defender.blocking) {
    return 0;
  }

  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}

const getHitPower = (fighter: IFighter): number => {
  const criticalHitChance = getRandomNumber(1, 2);
  const { attack } = fighter;
  return attack * criticalHitChance;
};

const getBlockPower = (fighter: IFighter): number => {
  const dodgeChance = getRandomNumber(1, 2);
  const { defense } = fighter;
  return defense * dodgeChance;
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};