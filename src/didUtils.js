export function getEthrDID(address, chainId = 1) {
  return `did:ethr:${chainId}:${address}`;
}
