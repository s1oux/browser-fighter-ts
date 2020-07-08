import { showModal } from './modal';

interface IFighterModel {
  _id: string,
  name: string,
  health: number, 
  attack: number, 
  defense: number,
  source: string
}

export function showWinnerModal(fighter : IFighterModel) {
  // call showModal function
  showModal({
    title: `And winner is ${fighter.name}`,
    bodyElement: fighter,
    onClose: () => {
      location.reload();
    },
  });
}
