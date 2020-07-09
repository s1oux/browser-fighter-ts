import { IFighter } from '../interfaces/iFighter';

export const resetCriticalHitParameters = (fighter: IFighter): void => {
  fighter.criticalHitSequence = [];
  fighter.criticalHitTiming = 0;
};

export const updateLastCriticalHitTime = (fighter: IFighter): void => {
  fighter.lastCriticalHit = new Date();
};

export const checkCriticalKeyCodePressing = (
  key: string, combination: string[], fighter: IFighter
): boolean => {
  return combination.includes(key) && !fighter.blocking;
};

export const checkLastCriticalHitTime = (fighter: IFighter): boolean => {
  return (Number(new Date()) - Number(fighter.lastCriticalHit)) / 1000 < 10;
};

export const checkCriticalHitDelay = (fighter: IFighter): boolean => {
  return (Number(new Date()) - Number(fighter.criticalHitTiming)) / 1000 > 2;
};
