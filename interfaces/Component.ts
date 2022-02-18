export interface ComponentClass {
  name: string;
  path: string;
  isContainer: boolean;
}

export interface ComponentInstance {
  id: string;
  name: string;
  path: string;
  isContainer: boolean;
  props?: { [key: string]: any };
  children?: ComponentInstance[];
}
