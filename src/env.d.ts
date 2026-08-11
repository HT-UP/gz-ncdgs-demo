/// <reference types="vite/client" />

import type { Component } from 'vue'

declare module '*.vue' {
  const component: Component
  export default component
}

declare namespace JSX {
  interface Element {}
  interface ElementClass {}
  interface ElementAttributesProperty {
    props: {}
  }
  interface IntrinsicElements {
    [elem: string]: any
  }
}
