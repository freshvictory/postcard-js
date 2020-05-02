export class Component<T extends Data, R extends Refs> extends HTMLElement {
  public data!: T;

  public refs!: R;


  constructor(templateId: string) {
    super();

    this.attachShadow({ mode: 'open' });

    const template = <HTMLTemplateElement | null>document
      .getElementById(templateId);

    if (template) {
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
  }
}


type Data = { [k: string]: unknown };
type Refs = { [k: string]: unknown };

type Constructor = new(...args: any[]) => unknown;
export type ConstructorType<T extends Constructor> =
  T extends (new(...args: any[]) => infer U)
  ? U extends Number ? number
    : U extends String ? string
    : U extends Boolean ? boolean
    : U
  : never;

type ConstructorWithDefault<T extends Constructor> = {
  type: T;
  default: ConstructorType<T>
};

type ConstructorOption = Constructor | ConstructorWithDefault<Constructor>;

type ConstructorOptions = {
  [k: string]: ConstructorOption;
};

type Mapped<T extends ConstructorOptions> = {
  [k in keyof T]: MappedType<T[k]>;
}

type MappedType<T extends ConstructorOption> =
  T extends ConstructorWithDefault<infer U>
  ? ConstructorType<U>
  : T extends Constructor ? ConstructorType<T> | undefined
  : never;

type NonNullableMap<T extends ConstructorOptions> = {
  [k in keyof T]: NonNullableMappedType<T[k]>;
}

type NonNullableMappedType<T extends ConstructorOption> =
  T extends ConstructorWithDefault<infer U>
  ? ConstructorType<U>
  : T extends Constructor ? ConstructorType<T>
  : never;


type ComponentOptions<
  T extends ConstructorOptions,
  R extends ConstructorOptions
> = {
  id: string;
  data: T;
  refs?: Partial<R>;
  attributes: (keyof T)[];
  render?: ((data: Mapped<T>, refs: NonNullableMap<R>) => void | Promise<void>);
}


export function define<
  T extends ConstructorOptions,
  R extends ConstructorOptions
>(
  options: ComponentOptions<T, R>
) {
  return buildElementClass(options);
}


function buildElementClass<
  T extends ConstructorOptions,
  R extends ConstructorOptions
>(
  options: ComponentOptions<T, R>
): typeof ComponentClass {
  const ComponentClass =
  class extends Component<Mapped<T>, NonNullableMap<R>> {
    public static get observedAttributes() {
      return options.attributes;
    }


    constructor() {
      super(options.id);

      this.data = new Proxy({} as Mapped<T>, {
        get: (obj, prop: string) => {
          return typeof obj[prop] === 'boolean'
            ? this.hasAttribute(prop)
            : this.getAttribute(prop) || obj[prop];
        },
        set: (obj, prop: keyof T, value) => {
          obj[prop] = value;
          if (options.attributes.indexOf(prop) !== -1) {
            if (typeof obj[prop] === 'boolean') {
              this[obj[prop] ? 'setAttribute' : 'removeAttribute'](
                prop as string, ''
              );
            } else {
              this.setAttribute(prop as string, value);
            }
          }

          return true;
        }
      });

      for (const data in options.data) {
        const option = options.data[data];
        if (typeof option === 'object') {
          if ('default' in option) {
            this.data[data] =
              (option as ConstructorWithDefault<new () => any>).default;
          } else {
            this.data[data] = <any>undefined;
          }
        } else {
          this.data[data] = <any>undefined;
        }
      }


      this.refs = <any>{};      
      if (options.refs && this.shadowRoot) {  
        for (const ref in options.refs) {
          const el = this.shadowRoot.querySelector('#' + ref);
          if (!el) { throw new Error('Cannot find ref ' + ref); }
          this.refs[ref] = <any>el;
        }
      }
    }

    
    connectedCallback() {
      options.render?.(this.data, this.refs);
    }


    attributeChangedCallback(name: string) {
      // noop, for now
    }
  };

  return ComponentClass;
}
