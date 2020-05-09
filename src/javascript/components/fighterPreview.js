import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  if (!fighter) {
    return '';
  }

  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)

  fighterElement.append(createFighterImage(fighter));
  fighterElement.append(createFighterInfo(fighter));

  return fighterElement;
}

export function createFighterImage(fighter) {
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

export function createFighterInfo(fighter) {
  const { attack, defense, health, name } = fighter;

  const infoElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  const nameHeading = createElement({
    tagName: 'h3',
  });
  nameHeading.append(`${name}`);

  const attackInfo = createParagraphElement();
  attackInfo.append(`attack: ${attack}`);

  const defenseInfo = createParagraphElement();
  defenseInfo.append(`defense: ${defense}`);

  const healthInfo = createParagraphElement();
  healthInfo.append(`health: ${health}`);

  infoElement.append(nameHeading);
  infoElement.append(attackInfo);
  infoElement.append(defenseInfo);
  infoElement.append(healthInfo);

  return infoElement;
}

const createParagraphElement = () =>
  createElement({
    tagName: 'p',
  });
