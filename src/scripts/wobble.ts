/** Déformation du logo footer au survol — port du script « text-wobble » de /reference. */
import { motion } from './motion-tokens';

const SVG_NS = 'http://www.w3.org/2000/svg';

document.querySelectorAll<HTMLElement>('[data-wobble]').forEach((wrapper, index) => {
  const svg = wrapper.querySelector('svg');
  if (!svg || svg.dataset.wobbleReady === 'true') return;
  svg.dataset.wobbleReady = 'true';

  const { baseFrequency, turbulenceDuration, displacement, displacementDuration, resetDelay } = motion.wobble;
  const filterId = `footer-distortion-${index}`;
  const initialFrequency = baseFrequency.split(';')[0];
  const defs = document.createElementNS(SVG_NS, 'defs');
  defs.innerHTML = `
    <filter id="${filterId}">
      <feTurbulence type="fractalNoise" baseFrequency="${initialFrequency}" numOctaves="2" seed="2" result="noise">
        <animate attributeName="baseFrequency" dur="${turbulenceDuration}" values="${baseFrequency}" repeatCount="1" begin="indefinite" />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
        <animate attributeName="scale" dur="${displacementDuration}" values="${displacement}" repeatCount="1" begin="indefinite" />
      </feDisplacementMap>
    </filter>`;
  svg.prepend(defs);

  wrapper.addEventListener('mouseenter', () => {
    svg.style.filter = `url(#${filterId})`;
    defs.querySelectorAll<SVGAnimateElement>('animate').forEach((anim) => anim.beginElement());
    window.setTimeout(() => { svg.style.filter = ''; }, resetDelay);
  });
});
