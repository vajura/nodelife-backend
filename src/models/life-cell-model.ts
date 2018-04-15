export class Cell {

  public alive: number;
  public ignore: boolean;
  public color: any;
  public owner: any;

  constructor(public x: number, public y: number) {
    this.alive = 0;
    this.ignore = true;
    this.color = 0;
  }
}
