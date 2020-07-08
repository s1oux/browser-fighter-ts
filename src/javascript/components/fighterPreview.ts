import { createElement } from '../helpers/domHelper';

interface IFighterModel {
  _id: string,
  name: string,
  health: number, 
  attack: number, 
  defense: number,
  source: string
}

export function createFighterPreview(fighter: IFighterModel, position: string) {
  if (!fighter) {
    return '';
  }

  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)

  fighterElement.append(createFighterName(fighter));
  fighterElement.append(createFighterImage(fighter));
  fighterElement.append(createFighterInfo(fighter));

  return fighterElement;
}

export function createFighterName(fighter: IFighterModel) {
  const { name } = fighter;
  const nameElement = createElement({ tagName: 'h3', className: 'fighter-preview___name' });
  nameElement.innerText = name;
  return nameElement;
}

export function createFighterImage(fighter: IFighterModel) {
  const { source, name } = fighter;
  const attributes = { src: source };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    title: name,
    alt: name,
    attributes,
  });

  return imgElement;
}

export function createFighterInfo(fighter: IFighterModel) {
  const { attack, defense, health } = fighter;

  const infoElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  const attackInfo = createParagraphElement();
  attackInfo.append(`attack: ${attack}`);

  const defenseInfo = createParagraphElement();
  defenseInfo.append(`defense: ${defense}`);

  const healthInfo = createParagraphElement();
  healthInfo.append(`health: ${health}`);

  infoElement.append(attackInfo);
  infoElement.append(defenseInfo);
  infoElement.append(healthInfo);

  return infoElement;
}

const createParagraphElement = () =>
  createElement({
    tagName: 'p',
  });
