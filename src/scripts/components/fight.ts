import { controls } from '../../constants/controls';

import { IFighter, IFighterModel } from '../interfaces/iFighter';

import Player from './fighterPlayer';
import {
  checkCriticalHitDelay,
  checkCriticalKeyCodePressing,
  checkLastCriticalHitTime,
  updateLastCriticalHitTime,
  resetCriticalHitParameters,
} from './criticalHitLogic';
import {
  getCriticalHit,
  getDamage,
  updateHealthIndicator
} from './fightLogic';

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

const checkKeyPress = (keyCode: string, firstFighter: IFighter, secondFighter: IFighter): void => {
  switch (keyCode) {
    case controls.PlayerOneAttack:
      playerAttacks(firstFighter, secondFighter, 'right');
      break;
    case controls.PlayerTwoAttack:
      playerAttacks(secondFighter, firstFighter, 'left');
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

const playerAttacks = (
  attacker: IFighter,
  defender: IFighter,
  side: string
): void => {
  const attackerDamageDealt = getDamage(attacker, defender);
  defender.currentHealth -= attackerDamageDealt;
  resetCriticalHitParameters(attacker);
  updateHealthIndicator(defender, side);
}

const checkCriticalHitSequence = (
  attacker: IFighter,
  defender:IFighter,
  key: string,
  combination: string[],
  side: string
): void => {
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
