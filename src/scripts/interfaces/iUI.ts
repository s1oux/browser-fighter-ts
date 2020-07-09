import { IFighterModel } from './iFighter';

export interface IAttributes {
  [key: string]: string
}

export interface IElement {
  tagName: string,
  title?: string,
  className?: string,
  attributes?: IAttributes,
  alt?: string
}

export interface IModalElement {
  title: string,
  bodyElement: IFighterModel,
  onClose: () => void
}