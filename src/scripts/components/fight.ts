import { controls } from '../../constants/controls';

import { IFighter, IFighterModel } from '../interfaces/iFighter';

import Player from './fighterPlayer';
import {
  resetCriticalHitParameters,
  updateLastCriticalHitTime,
  checkCriticalKeyCodePressing,
  checkLastCriticalHitTime,
  checkCriticalHitDelay,
} from './criticalHitLogic';

export async function fight(
  firstFighter: IFighterModel,
  secondFighter: IFighterModel
): Promise<IFighterModel> {
  return new Promise((resolve) => {
    const firstPlayer = new Player(firstFighter);
    const secondPlayer = new Player(secondFighter);

    const keyDownListener = (event: KeyboardEvent) => {
      checkKeyPress(event.code, firstPlayer, secondPlayer);

      if (firstPlayer.currentHealth <= 0) {
        removeKeyListeners();
        resolve(secondFighter);
      } else if (secondPlayer.currentHealth <= 0) {
        removeKeyListeners();
        resolve(firstFighter);
      }
    };
    document.addEventListener('keydown', keyDownListener);

    const keyUpListener = (event: KeyboardEvent) => {
      if (event.code === controls.PlayerOneBlock && firstPlayer.blocking) {
        firstPlayer.blocking = false;
      } else if (event.code === controls.PlayerTwoBlock && secondPlayer.blocking) {
        secondPlayer.blocking = false;
      }
    };
    document.addEventListener('keyup', keyUpListener);

    const removeKeyListeners = () => {
      document.removeEventListener('keydown', keyDownListener);
      document.removeEventListener('keyup', keyUpListener);
    };
  });
}

export function getCriticalHit(fighter: IFighter): number {
  // return critical damage
  return fighter.attack * 2;
}

export function getDamage(attacker: IFighter, defender: IFighter): number {
  // return damage
  if (attacker.blocking) {
    return 0;
  }

  if (!defender.blocking) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
  } else {
    return 0;
  }
}

export function getHitPower(fighter: IFighter): number {
  const criticalHitChance = getRandomNumber(1, 2);
  const { attack } = fighter;
  return attack * criticalHitChance;
}

export function getBlockPower(fighter: IFighter): number {
  const dodgeChance = getRandomNumber(1, 2);
  const { defense } = fighter;
  return defense * dodgeChance;
}

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const checkKeyPress = (keyCode: string, firstFighter: IFighter, secondFighter: IFighter): void => {
  switch (keyCode) {
    case controls.PlayerOneAttack:
      const secondPlayerDamageDealt = getDamage(firstFighter, secondFighter);
      secondFighter.currentHealth -= secondPlayerDamageDealt;
      resetCriticalHitParameters(firstFighter);

      updateHealthIndicator(secondFighter, 'right');
      break;
    case controls.PlayerTwoAttack:
      const firstPlayerDealt = getDamage(secondFighter, firstFighter);
      firstFighter.currentHealth -= firstPlayerDealt;
      resetCriticalHitParameters(secondFighter);

      updateHealthIndicator(firstFighter, 'left');
      break;
    case controls.PlayerOneBlock:
      if (!firstFighter.blocking) {
        firstFighter.blocking = true;
      }
      break;
    case controls.PlayerTwoBlock:
      if (!secondFighter.blocking) {
        secondFighter.blocking = true;
      }
      break;
    default:
      if (checkCriticalKeyCodePressing(keyCode, controls.PlayerOneCriticalHitCombination, firstFighter)) {
        checkCriticalHitSequence(
          firstFighter,
          secondFighter,
          keyCode,
          controls.PlayerOneCriticalHitCombination,
          'right'
        );
      } else if (checkCriticalKeyCodePressing(keyCode, controls.PlayerTwoCriticalHitCombination, secondFighter)) {
        checkCriticalHitSequence(
          secondFighter,
          firstFighter,
          keyCode,
          controls.PlayerTwoCriticalHitCombination,
          'left'
        );
      }
      break;
  }
};

const updateHealthIndicator = (fighter:IFighter, side: string): void => {
  document.getElementById(`${side}-fighter-indicator`)!.style.width = `${Math.round(
    (fighter.currentHealth / fighter.initialHealth) * 100
  )}%`;
};

const checkCriticalHitSequence = (attacker: IFighter, defender:IFighter, key: string, combination: string[], side: string): void => {
  switch (attacker.criticalHitSequence.length) {
    case 0:
      if (checkLastCriticalHitTime(attacker)) {
        // do nothing if player makes crit in last 10s
      } else if (key === combination[0]) {
        attacker.criticalHitTiming = new Date();
        attacker.criticalHitSequence.push(key);
      }
      break;
    case 1:
      if (checkCriticalHitDelay(attacker)) {
        resetCriticalHitParameters(attacker);
      } else if (key === combination[1]) {
        attacker.criticalHitTiming = new Date();
        attacker.criticalHitSequence.push(key);
      } else {
        resetCriticalHitParameters(attacker);
      }
      break;
    case 2:
      if (checkCriticalHitDelay(attacker)) {
        resetCriticalHitParameters(attacker);
      } else if (key === combination[2]) {
        const defenderPlayerDamageDealt = getCriticalHit(attacker);
        defender.currentHealth -= defenderPlayerDamageDealt;

        updateHealthIndicator(defender, side);

        resetCriticalHitParameters(attacker);
        updateLastCriticalHitTime(attacker);
      } else {
        resetCriticalHitParameters(attacker);
      }
      break;
  }
};
