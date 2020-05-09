import { controls } from '../../constants/controls';

class Player {
  constructor(fighter) {
    this.name = fighter.name;
    this.attack = fighter.attack;
    this.defense = fighter.defense;
    this.initialHealth = fighter.health;
    this.currentHealth = fighter.health;
    this.blocking = false;
    this.criticalHitSequence = [];
    this.criticalHitTiming = 0;
    this.lastCriticalHit = new Date();
  }
}

// ANOTHER TRY --- WORKS
// TODO: find out if its necessary to delete eventlisteners from
// all keys or on modal it won't work -- got it!!!
// TODO: LOOK HOW TO MAKE MODAL -- got it!!!!!
// TODO: FIND OUT HOW TO IMPLEMENT CRITICAL HIT CHECKING
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
        console.log('D was pressed 1st player => starts blocking');
      } else if (event.code === controls.PlayerTwoBlock && !secondPlayer.blocking) {
        secondPlayer.blocking = true;
        console.log('L was pressed 2nd player => starts blocking');
      } else {
        // do nothing
      }
    };
    document.addEventListener('keydown', keyDownListener);

    const keyUpListener = (event) => {
      if (event.code === controls.PlayerOneBlock && firstPlayer.blocking) {
        firstPlayer.blocking = false;
        console.log('1st player escaped D => stops blocking');
      } else if (event.code === controls.PlayerTwoBlock && secondPlayer.blocking) {
        secondPlayer.blocking = false;
        console.log('2nd player escaped L => stops blocking');
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
    console.log('unable to attack while blocking');
    return 0;
  }

  if (!defender.blocking) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
  } else {
    console.log(`${attacker.name} attacks, but ${defender.name} blocks`);
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

const checkKeyPress = (keyCode, first, second) => {
  switch (keyCode) {
    case controls.PlayerOneAttack:
      // handlePlayerAttack
      const secondPlayerDamageDealt = getDamage(first, second);
      second.currentHealth -= secondPlayerDamageDealt;
      resetCriticalHitParameters(first);
      const rightPlayerHealthIndicator = document.getElementById('right-fighter-indicator');
      rightPlayerHealthIndicator.style.width = `${Math.round((second.currentHealth / second.initialHealth) * 100)}%`;
      break;
    case controls.PlayerTwoAttack:
      // handlePlayerAttack
      const firstPlayerDealt = getDamage(second, first);
      first.currentHealth -= firstPlayerDealt;
      resetCriticalHitParameters(second);
      const leftPlayerHealthIndicator = document.getElementById('left-fighter-indicator');
      leftPlayerHealthIndicator.style.width = `${Math.round((first.currentHealth / first.initialHealth) * 100)}%`;
      break;
    default:
      // need to prettier this
      if (controls.PlayerOneCriticalHitCombination.includes(keyCode) && !first.blocking) {
        switch (first.criticalHitSequence.length) {
          case 0:
            if ((new Date() - first.lastCriticalHit) / 1000 < 10) {
              console.log('last critical hit was earlier than 10 seconds ago');
            } else {
              first.criticalHitTiming = new Date();
              first.criticalHitSequence.push(keyCode);
            }
            break;
          case 1:
            if ((new Date() - first.criticalHitTiming) / 1000 > 2) {
              console.log(
                `broke critical hit sequence because of long delay (${(new Date() - first.criticalHitTiming) / 1000})`
              );
              resetCriticalHitParameters(first);
            } else if (keyCode === controls.PlayerOneCriticalHitCombination[1]) {
              first.criticalHitTiming = new Date();
              first.criticalHitSequence.push(keyCode);
            } else {
              console.log('broke critical hit sequence because of wrong sequence');
              resetCriticalHitParameters(first);
            }
            break;
          case 2:
            if ((new Date() - first.criticalHitTiming) / 1000 > 2) {
              console.log('broke critical hit sequence because of long delay');
              resetCriticalHitParameters(first);
            } else if (keyCode === controls.PlayerOneCriticalHitCombination[2]) {
              const secondPlayerDamageDealt = getCriticalHit(first);
              second.currentHealth -= secondPlayerDamageDealt;
              const rightPlayerHealthIndicator = document.getElementById('right-fighter-indicator');
              rightPlayerHealthIndicator.style.width = `${Math.round(
                (second.currentHealth / second.initialHealth) * 100
              )}%`;
              resetCriticalHitParameters(first);
              updateLastCriticalHitTime(first);
            } else {
              console.log('broke critical hit sequence because of wrong sequence');
              resetCriticalHitParameters(first);
            }
            break;
        }
      } else if (controls.PlayerTwoCriticalHitCombination.includes(keyCode) && !second.blocking) {
        switch (second.criticalHitSequence.length) {
          case 0:
            if ((new Date() - second.lastCriticalHit) / 1000 < 10) {
              console.log('last critical hit was earlier than 10 seconds ago');
            } else {
              second.criticalHitTiming = new Date();
              second.criticalHitSequence.push(keyCode);
            }
            break;
          case 1:
            if ((new Date() - second.criticalHitTiming) / 1000 > 2) {
              console.log(
                `broke critical hit sequence because of long delay (${(new Date() - second.criticalHitTiming) / 1000})`
              );
              resetCriticalHitParameters();
            } else if (keyCode === controls.PlayerTwoCriticalHitCombination[1]) {
              second.criticalHitTiming = new Date();
              second.criticalHitSequence.push(keyCode);
            } else {
              console.log('broke critical hit sequence because of wrong sequence');
              resetCriticalHitParameters(second);
            }
            break;
          case 2:
            if ((new Date() - second.criticalHitTiming) / 1000 > 2) {
              console.log('broke critical hit sequence because of long delay');
              resetCriticalHitParameters(second);
            } else if (keyCode === controls.PlayerTwoCriticalHitCombination[2]) {
              const firstPlayerDamageDealt = getCriticalHit(second);
              first.currentHealth -= firstPlayerDamageDealt;
              const leftPlayerHealthIndicator = document.getElementById('left-fighter-indicator');
              leftPlayerHealthIndicator.style.width = `${Math.round(
                (first.currentHealth / first.initialHealth) * 100
              )}%`;
              resetCriticalHitParameters(second);
              updateLastCriticalHitTime(second);
            } else {
              console.log('broke critical hit sequence because of wrong sequence');
            }
            break;
        }
      }

      console.log('another key clicked, nothing happens');
      break;
  }
};

const resetCriticalHitParameters = (fighter) => {
  fighter.criticalHitSequence = [];
  fighter.criticalHitTiming = 0;
};

const updateLastCriticalHitTime = (fighter) => {
  fighter.lastCriticalHit = new Date();
};
