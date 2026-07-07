#!/usr/bin/env node
// One-time VAPID key generation for Phase-5 web push (no external deps — Node >=18 WebCrypto).
// Prints the ExportedVapidKeys JWK JSON that _shared/webpush.ts expects in the VAPID_KEYS_JWK secret.
//
//   node contractor-app/scripts/generate-vapid-keys.mjs > .secrets/vapid-keys.jwk.json
//   supabase secrets set VAPID_KEYS_JWK="$(cat .secrets/vapid-keys.jwk.json)" \
//                        VAPID_SUBJECT="mailto:admin@timelessresurfacing.com.au"
//
// The PRIVATE key must only ever live in .secrets/ + the Supabase Edge secret — never git, never chat.
import { webcrypto } from 'node:crypto';

const { subtle } = webcrypto;

const keys = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const exported = {
  publicKey: await subtle.exportKey('jwk', keys.publicKey),
  privateKey: await subtle.exportKey('jwk', keys.privateKey),
};

process.stdout.write(JSON.stringify(exported) + '\n');
