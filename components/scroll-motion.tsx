'use client';

import { useEffect } from 'react';
import { mountScrollMotion } from '@/lib/scroll-motion';

export function ScrollMotion() {
  useEffect(() => mountScrollMotion(), []);
  return null;
}
