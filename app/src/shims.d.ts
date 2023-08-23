declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.yaml' {
  const value: Record<string, any>;
  export default value;
}

declare module '*.yml' {
  const value: Record<string, any>;
  export default value;
}

declare module '*.json' {
  const value: Record<string, any>;
  export default value;
}
