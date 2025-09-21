export interface License {
  key: string;
  status: 'active' | 'expired' | 'revoked';
  tier: 'free' | 'pro' | 'enterprise';
  expires_at: string;
}

export const licenses: License[] = [
  {
    key: 'DTL-VALID-PRO-12345',
    status: 'active',
    tier: 'pro',
    expires_at: '2026-10-01T00:00:00Z',
  },
  {
    key: 'DTL-VALID-ENT-67890',
    status: 'active',
    tier: 'enterprise',
    expires_at: '2030-01-01T00:00:00Z',
  },
  {
    key: 'DTL-EXPIRED-PRO-ABCDE',
    status: 'expired',
    tier: 'pro',
    expires_at: '2023-01-01T00:00:00Z',
  },
  {
    key: 'DTL-REVOKED-ENT-FGHIJ',
    status: 'revoked',
    tier: 'enterprise',
    expires_at: '2028-05-01T00:00:00Z',
  },
];

export const findLicense = (key: string): License | undefined => {
  return licenses.find((license) => license.key === key);
};

export interface Product {
  id: string;
  name: string;
  version: string;
  platform: string;
  path: string;
}

export const products: Product[] = [
  {
    id: 'deepthought-pro',
    name: 'DeepThought Pro',
    version: '2.1.0',
    platform: 'arm64',
    path: '/downloads/deepthought-pro-2.1.0-arm64.dmg',
  },
  {
    id: 'deepthought-pro',
    name: 'DeepThought Pro',
    version: '2.1.0',
    platform: 'x86_64',
    path: '/downloads/deepthought-pro-2.1.0-x86_64.dmg',
  },
  {
    id: 'deepthought-pro',
    name: 'DeepThought Pro',
    version: '2.0.0',
    platform: 'arm64',
    path: '/downloads/deepthought-pro-2.0.0-arm64.dmg',
  },
  {
    id: 'deepthought-free',
    name: 'DeepThought Free',
    version: '1.5.0',
    platform: 'arm64',
    path: '/downloads/deepthought-free-1.5.0-arm64.dmg',
  },
];

export const findProduct = (
  id: string,
  version: string,
  platform: string
): Product | undefined => {
  return products.find(
    (p) => p.id === id && p.version === version && p.platform === platform
  );
};
