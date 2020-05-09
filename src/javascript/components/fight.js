import { controls } from '../../constants/controls';

import Player from './fighterPlayer';
import {
  resetCriticalHitParameters,
  updateLastCriticalHitTime,
  checkCriticalKeyCodePressing,
  checkLastCriticalHitTime,
  checkCriticalHitDelay,
} from './criticalHitLogic';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const firstPlayer = new Player(firstFighter);
    const secondPlayer = new Player(secondFighter);

    const keyPressListener = (event) => {
      checkKeyPress(event.code, firstPlayer, secondPlayer);

      if (firstPlayer.currentHealth < 0) {
        removeKeyListeners();
        resolve(secondPlayer);
      } else if (secondPlayer.currentHealth < 0) {
        removeKeyListeners();
        resolve(firstPlayer);
      }
    };
    document.addEventListener('keypress', keyPressListener);

    const keyDownListener = (event) => {
      if (event.code === controls.PlayerOneBlock && !firstPlayer.blocking) {
        firstPlayer.blocking = true;
      } else if (event.code === controls.PlayerTwoBlock && !secondPlayer.blocking) {
        secondPlayer.blocking = true;
      } else {
        // do nothing
      }
    };
    document.addEventListener('keydown', keyDownListener);

    const keyUpListener = (event) => {
      if (event.code === controls.PlayerOneBlock && firstPlayer.blocking) {
        firstPlayer.blocking = false;
      } else if (event.code === controls.PlayerTwoBlock && secondPlayer.blocking) {
        secondPlayer.blocking = false;
      } else {
        // do nothing
      }
    };
    document.addEventListener('keyup', keyUpListener);

    const removeKeyListeners = () => {
      document.removeEventListener('keypress', keyPressListener);
      document.removeEventListener('keyup', keyUpListener);
      document.removeEventListener('keydown', keyDownListener);
    };
  });
}

export function getCriticalHit(fighter) {
  // return critical damage
  return fighter.attack * 2;
}

export function getDamage(attacker, defender) {
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

export function getHitPower(fighter) {
  const criticalHitChance = getRandomNumber(1, 2);
  const { attack } = fighter;
  return attack * criticalHitChance;
  // return hit power
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = getRandomNumber(1, 2);
  const { defense } = fighter;
  return defense * dodgeChance;
}

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const checkKeyPress = (keyCode, firstFighter, secondFighter) => {
  switch (keyCode) {
    case controls.PlayerOneAttack:
      // handlePlayerAttack
      const secondPlayerDamageDealt = getDamage(firstFighter, secondFighter);
      secondFighter.currentHealth -= secondPlayerDamageDealt;
      resetCriticalHitParameters(firstFighter);

      updateHealthIndicator(secondFighter, 'right');

      break;
    case controls.PlayerTwoAttack:
      // handlePlayerAttack
      const firstPlayerDealt = getDamage(secondFighter, firstFighter);
      firstFighter.currentHealth -= firstPlayerDealt;
      resetCriticalHitParameters(secondFighter);

      updateHealthIndicator(firstFighter, 'left');

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
      } else {
        // do nothing if player presses non-control keys
      }

      break;
  }
};

const updateHealthIndicator = (fighter, side) => {
  document.getElementById(`${side}-fighter-indicator`).style.width = `${Math.round(
    (fighter.currentHealth / fighter.initialHealth) * 100
  )}%`;
};

const checkCriticalHitSequence = (attacker, defender, key, combination, side) => {
  switch (attacker.criticalHitSequence.length) {
    case 0:
      if (checkLastCriticalHitTime(attacker)) {
        // do nothing if player makes crit in last 10s
      } else {
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
