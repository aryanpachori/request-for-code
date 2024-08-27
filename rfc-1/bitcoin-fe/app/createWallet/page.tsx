"use client";
import { useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
interface Wallet {
  address: string | undefined;
  privateKey: string;
}
const bip32 = BIP32Factory(ecc);
export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const createWallets = async () => {
    try {
      // Generate mnemonic phrase
      const mnemonic = bip39.generateMnemonic();
      setMnemonic(mnemonic);

      // Convert mnemonic to seed
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const root = bip32.fromSeed(seed);

      // Generate multiple addresses
      const numberOfAddresses = 5;
      const generatedWallets: Wallet[] = [];

      for (let i = 0; i < numberOfAddresses; i++) {
        const child = root.derivePath(`m/44'/0'/0'/0/${i}`);
        const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey });
        const privateKey = child.toWIF(); // Ensure privateKey is defined

        // Push to the array with correct property names
        generatedWallets.push({
          address, // Short for address: address
          privateKey, // Short for privateKey: privateKey
        });
      }

      setWallets(generatedWallets);
    } catch (error) {
      console.error("Error creating wallets:", error);
    }
  };
  return(
    <div>
      <h1>Create Multiple BTC Wallets</h1>
      <button onClick={()=> createWallets}>Generate wallet</button>
      {mnemonic &&(
        <div>
         {wallets.map((wallet, index) => (
              <li key={index} className="border-t border-gray-300 pt-4">
                <p>
                  <strong>Address {index + 1}:</strong> {wallet.address}
                </p>
                <p>
                  <strong>Private Key {index + 1} (WIF):</strong> {wallet.privateKey}
                </p>
              </li>
            ))}
        </div>
      )}
    </div>
  )
}