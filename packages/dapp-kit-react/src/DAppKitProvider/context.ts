import { createContext } from 'react';
import type { DAppKitContext } from '../types';

export const Context = createContext<DAppKitContext | undefined>(undefined);
