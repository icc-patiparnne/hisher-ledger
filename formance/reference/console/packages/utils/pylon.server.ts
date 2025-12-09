import { createHmac } from 'node:crypto';

/**
 * Generates an HMAC-SHA256 hash for Pylon identity verification
 * @param email - The user's email address
 * @param secret - The Pylon identity secret (hex-encoded)
 * @returns The HMAC hash as a hex string, or undefined if generation fails
 */
export function generatePylonEmailHash(
  email: string,
  secret: string
): string | undefined {
  if (!email || !secret) {
    console.warn('Pylon identity verification: Email and secret are required');
    return undefined;
  }

  try {
    const secretBytes = Buffer.from(secret, 'hex');
    const verificationHash = createHmac('sha256', secretBytes)
      .update(email)
      .digest('hex');

    return verificationHash;
  } catch (error) {
    console.error(
      'Failed to generate Pylon email hash:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return undefined;
  }
}
