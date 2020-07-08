import { createElement } from '../helpers/domHelper';
import { renderArena } from './arena';
import { createFighterPreview } from './fighterPreview';

const versusImg = '../../../resources/versus.jpg';
// fig img import

import { fighterService } from '../services/fightersService';

interface IFighterModel {
  _id: string,
  name: string,
  health: number, 
  attack: number, 
  defense: number,
  source: string
}

export function createFightersSelector() {
  let selectedFighters: IFighterModel[] = [];

  return async (fighterId: string) => {
    const fighter = await getFighterInfo(fighterId);
    const [playerOne, playerTwo] = selectedFighters;
    const firstFighter = playerOne ?? fighter;
    const secondFighter = Boolean(playerOne) ? playerTwo ?? fighter : playerTwo;
    selectedFighters = [firstFighter, secondFighter];

    renderSelectedFighters(selectedFighters);
  };
}

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId: string) {
  // get fighter info from fighterDetailsMap or from service and write it to fighterDetailsMap => for what ?

  const fighterInfo = await fighterService.getFighterDetails(fighterId);

  return fighterInfo;
}

function renderSelectedFighters(selectedFighters: IFighterModel[]) {
  const fightersPreview = document.querySelector('.preview-container___root');
  const [playerOne, playerTwo] = selectedFighters;
  const firstPreview = createFighterPreview(playerOne, 'left');
  const secondPreview = createFighterPreview(playerTwo, 'right');
  const versusBlock = createVersusBlock(selectedFighters);

  if(fightersPreview) {
    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
  }
}

function createVersusBlock(selectedFighters: IFighterModel[]) {
  const canStartFight = selectedFighters.filter(Boolean).length === 2;
  const onClick = () => startFight(selectedFighters);
  const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
  const image = createElement({
    tagName: 'img',
    className: 'preview-container___versus-img',
    attributes: { src: versusImg },
  });
  const disabledBtn = canStartFight ? '' : 'disabled';
  const fightBtn = createElement({
    tagName: 'button',
    className: `preview-container___fight-btn ${disabledBtn}`,
  });

  fightBtn.addEventListener('click', onClick, false);
  fightBtn.innerText = 'Fight';
  container.append(image, fightBtn);

  return container;
}

function startFight(selectedFighters: IFighterModel[]) {
  renderArena(selectedFighters);
}
