import { IFighterModel } from '../../interfaces/iFighter';

import { showModal } from './modal';

export function showWinnerModal(fighter : IFighterModel): void {
  showModal({
    title: `And winner is ${fighter.name}`,
    bodyElement: fighter,
    onClose: () => {
      location.reload();
    },
  });
}
