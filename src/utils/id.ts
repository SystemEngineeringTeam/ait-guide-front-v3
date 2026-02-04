export class ID {
  private id = 0;

  public get() {
    return this.id++;
  }
}
