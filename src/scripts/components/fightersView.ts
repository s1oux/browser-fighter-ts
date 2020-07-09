import { createElement } from '../helpers/domHelper';

import { IFighterModel } from '../interfaces/iFighter';

import { createFightersSelector } from './fighterSelector';

export function createFighters(fighters: IFighterModel[]): HTMLElement {
  const selectFighter: (id: string) => Promise<void> = createFightersSelector();
  const container: HTMLElement = createElement({
    tagName: 'div',
    className: 'fighters___root'
  });
  const preview: HTMLElement = createElement({
    tagName: 'div',
    className: 'preview-container___root'
  });
  const fightersList: HTMLElement = createElement({
    tagName: 'div',
    className: 'fighters___list'
  });
  const fighterElements: HTMLElement[] = fighters.map((fighter) => createFighter(fighter, selectFighter));

  fightersList.append(...fighterElements);
  container.append(preview, fightersList);

  return container;
}

function createFighter(
  fighter: IFighterModel,
  selectFighter: (fighterId: string) => Promise<void>
): HTMLElement {
  const fighterElement: HTMLElement = createElement({
    tagName: 'div',
    className: 'fighters___fighter'
  });
  const imageElement: HTMLElement = createImage(fighter);
  const onClick: () => Promise<void> = () => selectFighter(fighter._id);

  fighterElement.append(imageElement);
  fighterElement.addEventListener('click', onClick, false);

  return fighterElement;
}

function createImage(fighter: IFighterModel): HTMLElement {
  const { source, name } = fighter;
  const attributes = { src: source };
  const imgElement: HTMLElement = createElement({
    tagName: 'img',
    className: 'fighter___fighter-image',
    title: name,
    alt: name,
    attributes
  });

  return imgElement;
}