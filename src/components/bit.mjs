// Bit: the site's mascot, a small pixel creature (reference artwork in
// src/assets-src/mascot-reference.png). Drawn on a 10-unit pixel grid so it
// stays crisp at any size. One SVG serves every instance (hero perch,
// contact, cursor companion, 404). Expressions are switched with the
// data-state attribute (see site.css): idle | curious | happy | wave | sleep,
// plus the .is-blinking and .is-walking classes.
import { raw } from '../lib/html.mjs';

export const bitSvg = (className = '') =>
  raw(`<svg class="bit ${className}" viewBox="0 0 130 96" aria-hidden="true" focusable="false" data-state="idle" shape-rendering="crispEdges">
  <g class="bit__bob">
    <g class="bit__legs">
      <rect class="bit__leg bit__leg--a" x="15" y="68" width="10" height="27"/>
      <rect class="bit__leg bit__leg--b" x="35" y="68" width="10" height="27"/>
      <rect class="bit__leg bit__leg--a" x="85" y="68" width="10" height="27"/>
      <rect class="bit__leg bit__leg--b" x="105" y="68" width="10" height="27"/>
    </g>
    <rect class="bit__arm bit__arm--l" x="1" y="23" width="15" height="27"/>
    <rect class="bit__arm bit__arm--r" x="114" y="23" width="15" height="27"/>
    <rect class="bit__body" x="15" y="0" width="100" height="70"/>
    <g class="bit__open">
      <g class="bit__eyes">
        <rect class="bit__eye" x="25" y="24" width="10" height="12"/>
        <rect class="bit__eye" x="95" y="24" width="10" height="12"/>
      </g>
    </g>
    <g class="bit__closed">
      <rect x="23" y="32" width="14" height="4"/>
      <rect x="93" y="32" width="14" height="4"/>
    </g>
    <g class="bit__zzz">
      <path d="M120 -22h10v3l-7 7h7v3h-10v-3l7-7h-7z"/>
      <path d="M134 -34h7v2l-5 5h5v2h-7v-2l5-5h-5z"/>
    </g>
  </g>
</svg>`);

/** The companion's markup, cloned by site.js when cursor-following starts. */
export const companionTemplate = () =>
  raw(`<template id="bit-companion"><div class="companion" aria-hidden="true">${bitSvg('bit--small')}</div></template>`);
