/// <reference path="./src/elements.d.ts" />
import './src/optimize-tsx';
import { Attributes, Element, createElement, html } from './src/template.js';
import { escape, escapeAttribute, safe, safeString } from './src/utils.js';

export { createElement, html } from './src/template.js';
export { escape, escapeAttribute, safeString, safe } from './src/utils.js';

export function jsx(element: Element, attributes?: Attributes | string | null) {
    return { render: element, attributes };
}

export function jsxs(element: Element, attributes?: Attributes | string | null) {
    return { render: element, attributes };
}

jsx.createElement = createElement;
jsx.html = html;
jsx.escape = escape;
jsx.escapeAttribute = escapeAttribute;
jsx.safeString = safeString;
jsx.safe = safe;
