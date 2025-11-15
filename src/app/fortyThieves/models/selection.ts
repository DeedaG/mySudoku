import { Card } from "./card";
import { Pile } from "./pile";

export class Selection {
  constructor(
    public toPile?: Pile,
    public card?: Card,
    public fromPile?: Pile
  ) {}

}

