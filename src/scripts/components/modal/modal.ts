import { createElement } from '../../helpers/domHelper';
import { IModalElement } from '../../interfaces/iUI';

import { createFighterImage } from '../fighterPreview';

export function showModal(
  { title, bodyElement, onClose = () => {} } : IModalElement
): void {
  const root: HTMLElement | null = getModalContainer();
  const modal: HTMLElement = createModal({ title, bodyElement, onClose });

  if(root) {
    root.append(modal);
  }

}

function getModalContainer(): HTMLElement | null {
  return document.getElementById('root');
}

function createModal(
  { title, bodyElement, onClose } : IModalElement
): HTMLElement {
  const layer: HTMLElement = createElement({
    tagName: 'div',
    className: 'modal-layer'
  });
  const modalContainer: HTMLElement = createElement({
    tagName: 'div',
    className: 'modal-root'
  });
  const header: HTMLElement = createHeader(title, onClose);
  const bodyContent: HTMLElement = createElement({
    tagName: 'div',
    className: 'modal-body'
  });
  const fighterImage: HTMLElement = createFighterImage(bodyElement);

  bodyContent.append(fighterImage);
  modalContainer.append(header, bodyContent);
  layer.append(modalContainer);

  return layer;
}

function createHeader(
  title: string,
  onClose: () => void
): HTMLElement {
  const headerElement: HTMLElement = createElement({
    tagName: 'div',
    className: 'modal-header'
  });
  const titleElement: HTMLElement = createElement({
    tagName: 'span'
  });
  const closeButton: HTMLElement = createElement({
    tagName: 'div',
    className: 'close-btn'
  });

  titleElement.innerText = title;
  closeButton.innerText = '×';

  const close = (): void => {
    hideModal();
    onClose();
  };
  closeButton.addEventListener('click', close);
  headerElement.append(title, closeButton);

  return headerElement;
}

function hideModal(): void {
  const modal: Element = document.getElementsByClassName('modal-layer')[0];
  modal?.remove();
}
