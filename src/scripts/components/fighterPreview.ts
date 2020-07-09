import { createElement } from '../helpers/domHelper';

import { IFighterModel } from '../interfaces/iFighter';

export function createFighterPreview(
  fighter: IFighterModel, position: 'left' | 'right'
): HTMLElement | '' {
  if (!fighter) {
    return '';
  }

  const positionClassName: string = `fighter-preview___${position}`;
  
  const fighterElement: HTMLElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  fighterElement.append(createFighterName(fighter));
  fighterElement.append(createFighterImage(fighter));
  fighterElement.append(createFighterInfo(fighter));

  return fighterElement;
}

export function createFighterName(fighter: IFighterModel): HTMLElement {
  const { name } = fighter;
  const nameElement: HTMLElement = createElement({
    tagName: 'h3',
    className: 'fighter-preview___name'
  });
  nameElement.innerText = name;
  return nameElement;
}

export function createFighterImage(fighter: IFighterModel): HTMLElement {
  const { source, name } = fighter;
  const attributes = { src: source };
  const imgElement: HTMLElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    title: name,
    alt: name,
    attributes,
  });

  return imgElement;
}

export function createFighterInfo(fighter: IFighterModel): HTMLElement {
  const { attack, defense, health } = fighter;

  const infoElement: HTMLElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  const attackInfo: HTMLElement = createParagraphElement();
  attackInfo.append(`attack: ${attack}`);

  const defenseInfo: HTMLElement = createParagraphElement();
  defenseInfo.append(`defense: ${defense}`);

  const healthInfo: HTMLElement = createParagraphElement();
  healthInfo.append(`health: ${health}`);

  infoElement.append(attackInfo);
  infoElement.append(defenseInfo);
  infoElement.append(healthInfo);

  return infoElement;
}

const createParagraphElement = (): HTMLElement =>
  createElement({
    tagName: 'p',
  });
