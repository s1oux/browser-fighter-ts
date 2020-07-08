import { createElement } from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';

import { fight } from './fight';
import { showWinnerModal } from './modal/winner';

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

interface IFighterModel {
  _id: string,
  name: string,
  health: number, 
  attack: number, 
  defense: number,
  source: string
}

export function renderArena(selectedFighters : IFighterModel[]) {
  const root = document.getElementById('root');
  const arena = createArena(selectedFighters);

  const [firstFighter, secondFighter] = selectedFighters;

  if(root) {
    root.innerHTML = '';
    root.append(arena);
  }

  // todo:
  // - start the fight
  // - when fight is finished show winner

  fight(firstFighter, secondFighter).then((winner) => {
    showWinnerModal(winner as IFighterModel);
  });
}

function createArena(selectedFighters: IFighterModel[]) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);

  arena.append(healthIndicators, fighters);
  return arena;
}

function createHealthIndicators(leftFighter?: IFighterModel, rightFighter?: IFighterModel) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  if(leftFighter && rightFighter) {
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  }

  return healthIndicators;
}

function createHealthIndicator(fighter: IFighterModel, position: string) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const bar = createElement({
    tagName: 'div',
    className: 'arena___health-bar',
    attributes: { id: `${position}-fighter-indicator` },
  });

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(firstFighter?: IFighterModel, secondFighter?: IFighterModel) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  if(firstFighter && secondFighter) {
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
  }
  
  return battleField;
}

function createFighter(fighter: IFighterModel, position: string) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}
