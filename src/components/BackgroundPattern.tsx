import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import styles from './style.module.scss';
import { BASE_URL } from '../api/Router';
import pako from 'pako';

interface BackgroundPatternProps {
  stickerUrl: string;
  positions: Array<{ x: number; y: number; rotate: number }>;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  stickerUrl,
  positions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current || !stickerUrl) return;

    const loadAnimation = async () => {
      try {
        const cleanSrc = stickerUrl.replace('stickers/', '');
        const fullUrl = stickerUrl.startsWith('http')
          ? stickerUrl
          : `${BASE_URL}/stickers/${cleanSrc}`;

        const response = await fetch(fullUrl, {
          headers: {
            Accept: 'application/octet-stream',
            initdata: window.Telegram?.WebApp?.initData || '',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const decompressed = pako.inflate(uint8Array, { to: 'string' });
        const animationData = JSON.parse(decompressed);

        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData,
        });

        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          containerRef.current.innerHTML = '';

          positions.forEach(({ x, y, rotate }) => {
            const wrapper = document.createElement('div');
            wrapper.className = styles.symbolWrapper;
            wrapper.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;

            const clone = svg.cloneNode(true) as SVGElement;
            clone.style.transform = 'scale(0.4)';
            wrapper.appendChild(clone);
            containerRef.current?.appendChild(wrapper);
          });
        }
      } catch (error) {
        console.error('Failed to load pattern:', error);
      }
    };

    loadAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [stickerUrl]);

  return <div ref={containerRef} className={styles.symbolPattern} />;
};

export default BackgroundPattern;
