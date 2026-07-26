import type { InventoryItem } from './types'

/**
 * Static 10-instance inventory — the TypeScript twin of the Go
 * StaticInventory() function in website-backend. Reconciled against the
 * live Exoscale compute API on 2026-07-26: 10 running instances, all in
 * CH-DK-2 (Zurich). internal-ops and registry-ops were retired and deleted
 * on 2026-07-26; this list dropped from 12 entries to 10 accordingly. Both
 * lists are hand-maintained and must stay in sync. This file is the
 * fallback rendering source if the backend returns a report with no
 * inventory.
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
    purpose: 'Ciphera ID + Captcha + SSH bastion',
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
    purpose: 'Observability: LGTM stack (Prometheus, Loki, Grafana, Tempo)',
  },
  {
    instance: 'envoy-ops-new',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'Privacy-preserving notification service (Envoy)',
  },
  {
    instance: 'gateway-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'Teleport proxy (SSH + audit)',
  },
  {
    instance: 'vault-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'HashiCorp Vault (Transit + Raft)',
  },
  {
    instance: 'relay-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'Transactional email relay (Stalwart)',
  },
  {
    instance: 'nomad-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'Nomad orchestration server',
  },
]
