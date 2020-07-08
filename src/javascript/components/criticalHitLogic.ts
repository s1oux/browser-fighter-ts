interface IFighter {
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

export const resetCriticalHitParameters = (fighter: IFighter) => {
  fighter.criticalHitSequence = [];
  fighter.criticalHitTiming = 0;
};

export const updateLastCriticalHitTime = (fighter: IFighter) => {
  fighter.lastCriticalHit = new Date();
};

export const checkCriticalKeyCodePressing = (key: string, combination: string[], fighter: IFighter) => {
  return combination.includes(key) && !fighter.blocking;
};

export const checkLastCriticalHitTime = (fighter: IFighter) => {
  return (Number(new Date()) - Number(fighter.lastCriticalHit)) / 1000 < 10;
};

export const checkCriticalHitDelay = (fighter: IFighter) => {
  return (Number(new Date()) - Number(fighter.criticalHitTiming)) / 1000 > 2;
};
