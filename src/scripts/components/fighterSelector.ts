import { createElement } from '../helpers/domHelper';
import { fighterService } from '../services/fightersService';

import { IFighterModel } from '../interfaces/iFighter';

import { renderArena } from './arena';
import { createFighterPreview } from './fighterPreview';

export function createFightersSelector() {
  let selectedFighters: IFighterModel[] = [];

  return async (fighterId: string) => {
    const fighter: IFighterModel = await getFighterInfo(fighterId);
    const [playerOne, playerTwo] = selectedFighters;
    const firstFighter: IFighterModel = playerOne ?? fighter;
    const secondFighter: IFighterModel = Boolean(playerOne) ? playerTwo ?? fighter : playerTwo;
    selectedFighters = [firstFighter, secondFighter];

    renderSelectedFighters(selectedFighters);
  };
}

export async function getFighterInfo(
  fighterId: string
): Promise<IFighterModel> {
  const fighterInfo = await fighterService.getFighterDetails(fighterId);
  return fighterInfo;
}

function renderSelectedFighters(selectedFighters: IFighterModel[]): void {
  const fightersPreview: Element | null = document.querySelector('.preview-container___root');
  const [playerOne, playerTwo] = selectedFighters;
  const firstPreview = createFighterPreview(playerOne, 'left');
  const secondPreview = createFighterPreview(playerTwo, 'right');
  const versusBlock = createVersusBlock(selectedFighters);

  if(fightersPreview) {
    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
  }
}

function createVersusBlock(selectedFighters: IFighterModel[]): HTMLElement {
  const canStartFight = selectedFighters.filter(Boolean).length === 2;
  const onClick = () => startFight(selectedFighters);
  const container = createElement({
    tagName: 'div',
    className: 'preview-container___versus-block'
  });
  const image = createElement({
    tagName: 'img',
    className: 'preview-container___versus-img'
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

function startFight(selectedFighters: IFighterModel[]): void {
  renderArena(selectedFighters);
}
