import type {  DOMAttributes }  from 'react';
import type { CLBInput } from '../webcomponents/CLBInput';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { readonly children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      readonly ['clb-input']: CustomElement<CLBInput>;
    }
  }
}
