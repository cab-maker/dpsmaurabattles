'use client';

import { useEffect } from 'react';

export default function AuraConsoleShield() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as unknown as { __AURA_SHIELD_MOUNTED__?: boolean }).__AURA_SHIELD_MOUNTED__) return;
    (window as unknown as { __AURA_SHIELD_MOUNTED__?: boolean }).__AURA_SHIELD_MOUNTED__ = true;

    // DPSM SUCKS ASCII Art Banner
    const asciiBanner = `
%c██████  ██████  ███████ ███    ███    ███████ ██   ██  ██████ ██   ██ ███████ 
██   ██ ██   ██ ██      ████  ████    ██      ██   ██ ██      ██  ██  ██      
██   ██ ██████  ███████ ██ ████ ██    ███████ ██   ██ ██      █████   ███████ 
██   ██ ██           ██ ██  ██  ██         ██ ██   ██ ██      ██  ██       ██ 
██████  ██      ███████ ██      ██    ███████  █████   ██████ ██   ██ ███████ 
`;

    console.log(
      asciiBanner,
      'font-weight: 900; font-family: monospace; color: #ff007f; text-shadow: 0 0 12px #ff007f, 0 0 24px #7928ca;'
    );

    console.log(
      '%c🛡️ DPSM SUCKS — THE AURA ARENA IS UNCRACKABLE 🛡️',
      'background: linear-gradient(90deg, #ff007a, #7928ca, #0070f3, #00dfd8); color: #ffffff; font-size: 15px; font-weight: 900; padding: 8px 18px; border-radius: 6px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); box-shadow: 0 4px 15px rgba(255,0,127,0.4);'
    );

    console.log(
      '%c[AURA SECURITY DEFENSE MATRIX: ARMED & ACTIVE]\n' +
      '• Military-Grade Headers & POST Payload Protection: ENGAGED\n' +
      '• Anti-CSRF Origin Verification: ENFORCED\n' +
      '• Cryptographic HMAC Token Verification: ACTIVE\n' +
      '• DPSM Exploit Success Rate: 0.000%\n\n' +
      '⚠️ WARNING TO DPSM SNOOPERS & ATTACKERS:\n' +
      'This website is engineered to be 100% uncrackable.\n' +
      'Any unauthorized payload injection, SQLi, or brute-force attempt is neutralized on sight.\n' +
      'DPSM SUCKS. AURA IS SUPREME.',
      'color: #00ffcc; font-family: monospace; font-size: 12px; line-height: 1.6; font-weight: 600;'
    );

    // Global deterrent hooks in window object
    try {
      Object.defineProperty(window, '__DPSM__', {
        value: 'DPSM SUCKS - THIS WEBSITE CANNOT BE HACKED',
        writable: false,
        configurable: false,
      });
      Object.defineProperty(window, '__AURA_SECURITY__', {
        value: 'STATUS: 100% UNCRACKABLE',
        writable: false,
        configurable: false,
      });
    } catch {
      // Ignore if properties already defined
    }
  }, []);

  return null;
}
