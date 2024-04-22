import * as regexp from 'lib/regexp';

export default function urlParser(maybeUrl: string): URL | undefined {
  try {
    return constructUrl(maybeUrl);
  } catch (error) {}
}

function isIpfsHash(hash: string) {
  // IPFS 해시의 기본 패턴 검사
  const pattern = /^[Qm][1-9A-Za-z]{44}$/;
  return pattern.test(hash);
}

function constructUrl(maybeUrl: string) {
  if (isIpfsHash(maybeUrl)) {
    // IPFS 해시인 경우 변환 로직 추가
    return new URL(`https://cdn.eggverse.io/ipfs/${ maybeUrl }`);
  } else if (regexp.IPFS_PREFIX.test(maybeUrl)) {
    return new URL(maybeUrl.replace(regexp.IPFS_PREFIX, 'https://cdn.eggverse.io/ipfs/'));
  } else if (regexp.URL_PREFIX.test(maybeUrl)) {
    return new URL(maybeUrl);
  }
}
