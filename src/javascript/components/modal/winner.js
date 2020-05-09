import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function
  showModal({
    title: `And winner is ${fighter.name}`,
    bodyElement: fighter,
    onClose: () => {
      location.reload();
    },
  });
}
