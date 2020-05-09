export const resetCriticalHitParameters = (fighter) => {
  fighter.criticalHitSequence = [];
  fighter.criticalHitTiming = 0;
};

export const updateLastCriticalHitTime = (fighter) => {
  fighter.lastCriticalHit = new Date();
};

export const checkCriticalKeyCodePressing = (key, combination, fighter) => {
  return combination.includes(key) && !fighter.blocking;
};

export const checkLastCriticalHitTime = (fighter) => {
  return (new Date() - fighter.lastCriticalHit) / 1000 < 10;
};

export const checkCriticalHitDelay = (fighter) => {
  return (new Date() - fighter.criticalHitTiming) / 1000 > 2;
};
