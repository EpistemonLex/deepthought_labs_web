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
