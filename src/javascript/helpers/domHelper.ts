interface IAttributes {
  [key: string]: string
}

interface IElement {
  tagName: string,
  title?: string,
  className?: string,
  attributes?: IAttributes,
  alt?: string
}

export function createElement(
  { tagName, className, attributes = {} } : IElement
) {
  const element = document.createElement(tagName);

  if (className) {
    const classNames = className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }

  Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));

  return element;
}
