interface IContainer {
  title?: string;
  name?: string;
  path?: string;
  children: IContainer[];
  applyNewValue: (value: any) => void;
}
