import { controls } from '../../constants/controls';

class Player {
  constructor(fighter) {
    this.name = fighter.name;
    this.attack = fighter.attack;
    this.defense = fighter.defense;
    this.initialHealth = fighter.health;
    this.currentHealth = fighter.health;
    this.blocking = false;
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

// should check block keypress on keyup -> escape from blocking
//  | keydown -> blocking
// **** that WORKS
const checkKeyPress = (keyCode, first, second) => {
  switch (keyCode) {
    case controls.PlayerOneAttack:
      // handlePlayerAttack
      const secondPlayerDamageDealt = getDamage(first, second);
      second.currentHealth -= secondPlayerDamageDealt;
      const rightPlayerHealthIndicator = document.getElementById('right-fighter-indicator');
      rightPlayerHealthIndicator.style.width = `${Math.round((second.currentHealth / second.initialHealth) * 100)}%`;
      // console.log(`${secondPlayerDamageDealt} dealt to ${second.name} (${second.currentHealth})`);

      break;
    case controls.PlayerTwoAttack:
      // handlePlayerAttack
      const firstPlayerDealt = getDamage(second, first);
      first.currentHealth -= firstPlayerDealt;
      const leftPlayerHealthIndicator = document.getElementById('left-fighter-indicator');

      leftPlayerHealthIndicator.style.width = `${Math.round((first.currentHealth / first.initialHealth) * 100)}%`;
      // console.log(`${firstPlayerDealt} dealt to ${first.name} (${first.currentHealth})`);

      break;
    // case controls.PlayerOneBlock:
    //   // handlePlayerBlock
    //   console.log('d was clicked, 1st blocks');
    //   break;
    // case controls.PlayerTwoBlock:
    //   // handlePlayerBlock
    //   console.log('l was clicked, 2nd blocks');
    //   break;
    default:
      console.log('another key clicked, nothing happens');
  }
};
