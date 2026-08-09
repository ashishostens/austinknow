'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
}

export default function MolecularBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const nodeCount = 20;
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const baseX = Math.random() * canvas.width;
      const baseY = Math.random() * canvas.height;
      nodes.push({
        x: baseX,
        y: baseY,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        baseX,
        baseY,
        radius: Math.random() * 2 + 2,
      });
    }
    nodesRef.current = nodes;

    // Mouse move listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let startTime = performance.now();

    // Get theme colors
    const getColors = () => {
      const isDark = theme === 'dark';
      return {
        bg: isDark ? 'rgba(20, 20, 20, 1)' : 'rgba(255, 255, 255, 1)',
        node: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(35, 31, 32, 0.6)',
        line: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(35, 31, 32, 0.3)',
      };
    };

    // Animation loop
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) * 0.001;
      const colors = getColors();

      // Clear canvas
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const connectionDistance = 150;
      const mouseRepelDistance = 100;
      const mouseRepelStrength = 50;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Add smooth oscillation
        const time = elapsed;
        const offsetX = Math.sin(time + i * 0.5) * 15;
        const offsetY = Math.cos(time + i * 0.7) * 15;

        let posX = node.baseX + offsetX;
        let posY = node.baseY + offsetY;

        // Mouse interaction - repel nodes away from mouse
        const mouseDistX = node.x - mouseRef.current.x;
        const mouseDistY = node.y - mouseRef.current.y;
        const mouseDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);

        if (mouseDist < mouseRepelDistance && mouseDist > 0) {
          const repelAngle = Math.atan2(mouseDistY, mouseDistX);
          const repelForce = (1 - mouseDist / mouseRepelDistance) * mouseRepelStrength;
          posX += Math.cos(repelAngle) * repelForce;
          posY += Math.sin(repelAngle) * repelForce;
        }

        node.x = posX;
        node.y = posY;

        // Occasionally update base position for wandering
        if (Math.random() < 0.001) {
          node.baseX += (Math.random() - 0.5) * 100;
          node.baseY += (Math.random() - 0.5) * 100;

          // Keep within bounds
          node.baseX = Math.max(0, Math.min(canvas.width, node.baseX));
          node.baseY = Math.max(0, Math.min(canvas.height, node.baseY));
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.node;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = colors.line.replace(/[\d.]+\)/, `${opacity})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="molecular-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
