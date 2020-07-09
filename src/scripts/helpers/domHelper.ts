import { IElement } from '../interfaces/iUI';

export function createElement({
  tagName,
  className,
  attributes = {}
}: IElement) : HTMLElement {
  const element: HTMLElement = document.createElement(tagName);

  if (className) {
    const classNames = className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }

  Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));

  return element;
}
