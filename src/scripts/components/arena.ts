import { createElement } from '../helpers/domHelper';
import { IFighterModel } from '../interfaces/iFighter';

import { showWinnerModal } from './modal/winner';

import { createFighterImage } from './fighterPreview';
import { fight } from './fight';


export function renderArena(selectedFighters : IFighterModel[]): void {
  const root: HTMLElement | null = document.getElementById('root');
  const arena: HTMLElement = createArena(selectedFighters);

  const [firstFighter, secondFighter] = selectedFighters;

  if(root) {
    root.innerHTML = '';
    root.append(arena);
  }

  fight(firstFighter, secondFighter)
    .then((winner) => {
      showWinnerModal(winner as IFighterModel);
    });
}

function createArena(selectedFighters: IFighterModel[]): HTMLElement {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);

  arena.append(healthIndicators, fighters);
  return arena;
}

function createHealthIndicators(
  leftFighter?: IFighterModel, rightFighter?: IFighterModel
): HTMLElement {
  const healthIndicators: HTMLElement = createElement({
    tagName: 'div',
    className: 'arena___fight-status'
  });
  const versusSign: HTMLElement = createElement({
    tagName: 'div',
    className: 'arena___versus-sign'
  });
  if(leftFighter && rightFighter) {
    const leftFighterIndicator: HTMLElement = createHealthIndicator(
      leftFighter,
      'left'
    );
    const rightFighterIndicator: HTMLElement = createHealthIndicator(
      rightFighter,
      'right'
    );

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  }

  return healthIndicators;
}

function createHealthIndicator(
  fighter: IFighterModel,
  position: string
): HTMLElement {
  const { name } = fighter;
  const container: HTMLElement = createElement({
    tagName: 'div',
    className: 'arena___fighter-indicator'
  });
  const fighterName: HTMLElement = createElement({
    tagName: 'span',
    className: 'arena___fighter-name'
  });
  const indicator: HTMLElement = createElement({
    tagName: 'div',
    className: 'arena___health-indicator'
  });
  const bar: HTMLElement = createElement({
    tagName: 'div',
    className: 'arena___health-bar',
    attributes: { id: `${position}-fighter-indicator` },
  });

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(
  firstFighter?: IFighterModel,
  secondFighter?: IFighterModel
): HTMLElement {
  const battleField: HTMLElement = createElement({
    tagName: 'div',
    className: 'arena___battlefield'
  });
  if(firstFighter && secondFighter) {
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
  }
  
  return battleField;
}

function createFighter(
  fighter: IFighterModel,
  position: string
): HTMLElement {
  const imgElement: HTMLElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ?
    'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}
