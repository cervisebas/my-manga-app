import * as Crypto from 'expo-crypto';

export async function createUID(text: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    text,
  );

  return hash.slice(0, 32);
}
