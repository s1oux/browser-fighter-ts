import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function
  showModal({
    title: 'And winner is...',
    bodyElement: `Legendary fighter ${fighter.name}`,
    onClose: () => {
      location.reload();
    },
  });
}
