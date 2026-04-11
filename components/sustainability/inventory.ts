import type { InventoryItem } from './types'

/**
 * Static 7-instance inventory — the TypeScript twin of the Go
 * StaticInventory() function in website-backend. Both lists are
 * hand-maintained and must stay in sync. This file is the fallback
 * rendering source for the infrastructure table in case the backend
 * returns a report with no inventory (which should not happen, but the
 * page stays rendered if it does).
 *
 * Keep in sync with:
 *   - Public/website-backend/internal/sustainability/inventory.go
 *   - Infra/docs/infrastructure.md
 */
export const STATIC_INVENTORY: InventoryItem[] = [
  {
    instance: 'db-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'PostgreSQL 16 + Redis 7',
  },
  {
    instance: 'infra-ops',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Auth + Captcha + SSH bastion',
  },
  {
    instance: 'pulse-ops',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Pulse analytics app + API',
  },
  {
    instance: 'public-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'Marketing website + contact form backend',
  },
  {
    instance: 'sentinel-ops',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Observability: LGTM stack + Gatus status page',
  },
  {
    instance: 'registry-ops',
    type: 'Standard-Micro',
    vcpu: 1,
    ramGb: 0.5,
    zone: 'CH-DK-2',
    purpose: 'Self-hosted Docker registry',
  },
  {
    instance: 'envoy-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-GVA-2',
    purpose: 'Privacy-preserving notification service (Envoy)',
  },
]
