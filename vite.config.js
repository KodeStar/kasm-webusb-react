import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import injectHTML from 'vite-plugin-html-inject';

import wbn from 'rollup-plugin-webbundle';
import * as wbnSign from 'wbn-sign';
import dotenv from 'dotenv';

dotenv.config();

const plugins = [injectHTML(), react()]

if (process.env.NODE_ENV === 'production') {
  // Get the key and decrypt it to sign the web bundle
  const key = wbnSign.parsePemKey(
    process.env.KEY || fs.readFileSync('./certs/encrypted_key.pem'),
    process.env.KEY_PASSPHRASE ||
      (await wbnSign.readPassphrase(
        /*description=*/ './certs/encrypted_key.pem',
      )),
  );

  const url = new wbnSign.WebBundleId(key).serializeWithIsolatedWebAppOrigin()
  console.log('url: ' + url)
  // Add the wbn bundle only during a production build
  plugins.push({
    ...wbn({
      // Ensures the web bundle is signed as an isolated web app
      baseURL: url,
      // Ensure that all content in the `public` directory is included in the web bundle
      static: {
        dir: 'public',
      },
      // The name of the output web bundle
      output: 'kasm.swbn',
      // This ensures the web bundle is signed with the key
      integrityBlockSign: {
        strategy: new wbnSign.NodeCryptoSigningStrategy(key),
      },
    }),
    enforce: 'post',
  });
}

  export default defineConfig({
    plugins,
    server: {
      port: 5193,
      strictPort: true,
      hmr: false,
      /*hmr: {
        protocol: 'ws',
        host: 'localhost',
        clientPort: 5193,
      },*/
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html'
        },
      },
    },
  });
  