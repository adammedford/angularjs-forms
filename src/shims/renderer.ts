/**
 * Extend this base class to implement custom rendering. By default, Angular
 * renders a template into DOM. You can use custom rendering to intercept
 * rendering calls, or to render to something other than DOM.
 *
 * Create your custom renderer using `RendererFactory2`.
 *
 * Use a custom renderer to bypass Angular's templating and
 * make custom UI changes that can't be expressed declaratively.
 * For example if you need to set a property or an attribute whose name is
 * not statically known, use the `setProperty()` or
 * `setAttribute()` method.
 *
 * @publicApi
 */
export abstract class Renderer2 {
  /**
   * Use to store arbitrary developer-defined data on a renderer instance,
   * as an object containing key-value pairs.
   * This is useful for renderers that delegate to other renderers.
   */
  abstract get data(): { [key: string]: any }

  /**
   * Implement this callback to destroy the renderer or the host element.
   */
  abstract destroy(): void
  /**
   * Implement this callback to create an instance of the host element.
   * @param name An identifying name for the new element, unique within the namespace.
   * @param namespace The namespace for the new element.
   * @returns The new element.
   */
  abstract createElement(name: string, namespace?: string | null): any
  /**
   * Implement this callback to add a comment to the DOM of the host element.
   * @param value The comment text.
   * @returns The modified element.
   */
  abstract createComment(value: string): any

  /**
   * Implement this callback to add text to the DOM of the host element.
   * @param value The text string.
   * @returns The modified element.
   */
  abstract createText(value: string): any
  /**
   * If null or undefined, the view engine won't call it.
   * This is used as a performance optimization for production mode.
   */
  // TODO(issue/24571): remove '!'.
  destroyNode!: ((node: any) => void) | null
  /**
   * Appends a child to a given parent node in the host element DOM.
   * @param parent The parent node.
   * @param newChild The new child node.
   */
  abstract appendChild(parent: any, newChild: any): void
  /**
   * Implement this callback to insert a child node at a given position in a parent node
   * in the host element DOM.
   * @param parent The parent node.
   * @param newChild The new child nodes.
   * @param refChild The existing child node that should precede the new node.
   */
  abstract insertBefore(parent: any, newChild: any, refChild: any): void
  /**
   * Implement this callback to remove a child node from the host element's DOM.
   * @param parent The parent node.
   * @param oldChild The child node to remove.
   */
  abstract removeChild(parent: any, oldChild: any): void
  /**
   * Implement this callback to prepare an element to be bootstrapped
   * as a root element, and return the element instance.
   * @param selectorOrNode The DOM element.
   * @param preserveContent Whether the contents of the root element
   * should be preserved, or cleared upon bootstrap (default behavior).
   * Use with `ViewEncapsulation.ShadowDom` to allow simple native
   * content projection via `<slot>` elements.
   * @returns The root element.
   */
  abstract selectRootElement(selectorOrNode: string | any, preserveContent?: boolean): any
  /**
   * Implement this callback to get the parent of a given node
   * in the host element's DOM.
   * @param node The child node to query.
   * @returns The parent node, or null if there is no parent.
   * For WebWorkers, always returns true.
   * This is because the check is synchronous,
   * and the caller can't rely on checking for null.
   */
  abstract parentNode(node: any): any
  /**
   * Implement this callback to get the next sibling node of a given node
   * in the host element's DOM.
   * @returns The sibling node, or null if there is no sibling.
   * For WebWorkers, always returns a value.
   * This is because the check is synchronous,
   * and the caller can't rely on checking for null.
   */
  abstract nextSibling(node: any): any
  /**
   * Implement this callback to set an attribute value for an element in the DOM.
   * @param el The element.
   * @param name The attribute name.
   * @param value The new value.
   * @param namespace The namespace.
   */
  abstract setAttribute(el: any, name: string, value: string, namespace?: string | null): void

  /**
   * Implement this callback to remove an attribute from an element in the DOM.
   * @param el The element.
   * @param name The attribute name.
   * @param namespace The namespace.
   */
  abstract removeAttribute(el: any, name: string, namespace?: string | null): void
  /**
   * Implement this callback to add a class to an element in the DOM.
   * @param el The element.
   * @param name The class name.
   */
  abstract addClass(el: any, name: string): void

  /**
   * Implement this callback to remove a class from an element in the DOM.
   * @param el The element.
   * @param name The class name.
   */
  abstract removeClass(el: any, name: string): void

  /**
   * Implement this callback to set a CSS style for an element in the DOM.
   * @param el The element.
   * @param style The name of the style.
   * @param value The new value.
   * @param flags Flags for style variations. No flags are set by default.
   */
  abstract setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void

  /**
   * Implement this callback to remove the value from a CSS style for an element in the DOM.
   * @param el The element.
   * @param style The name of the style.
   * @param flags Flags for style variations to remove, if set. ???
   */
  abstract removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void

  /**
   * Implement this callback to set the value of a property of an element in the DOM.
   * @param el The element.
   * @param name The property name.
   * @param value The new value.
   */
  abstract setProperty(el: any, name: string, value: any): void

  /**
   * Implement this callback to set the value of a node in the host element.
   * @param node The node.
   * @param value The new value.
   */
  abstract setValue(node: any, value: string): void

  /**
   * Implement this callback to start an event listener.
   * @param target The context in which to listen for events. Can be
   * the entire window or document, the body of the document, or a specific
   * DOM element.
   * @param eventName The event to listen for.
   * @param callback A handler function to invoke when the event occurs.
   * @returns An "unlisten" function for disposing of this handler.
   */
  abstract listen(
    target: 'window' | 'document' | 'body' | any,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void
}

/**
 * Flags for renderer-specific style modifiers.
 * @publicApi
 */
export enum RendererStyleFlags2 {
  /**
   * Marks a style as important.
   */
  Important = 1 << 0,
  /**
   * Marks a style as using dash case naming (this-is-dash-case).
   */
  DashCase = 1 << 1
}
