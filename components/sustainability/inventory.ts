import type { InventoryItem } from './types'

/**
 * Static 11-instance inventory — the TypeScript twin of the Go
 * StaticInventory() function in website-backend. Reconciled against the live
 * Exoscale compute API on 2026-07-26 (late evening): 11 production instances,
 * all in CH-DK-2 (Zurich).
 *
 * RECONCILIATION NOTE — this list had drifted badly and was corrected in one
 * pass on 2026-07-26. It previously published FOUR instances that no longer
 * exist (db-ops, infra-ops, pulse-ops, envoy-ops-new, all deleted during the
 * Kubernetes migration) while omitting the five SKS nodes and ci-ops entirely.
 * internal-ops, registry-ops and public-ops were all retired the same day
 * (public-ops last, once ci.ciphera.net moved onto the cluster). Because this page
 * is a transparency artifact, a stale entry is a factual misstatement rather
 * than cosmetic debt.
 *
 * CH-GVA-2 (Geneva) holds one instance, personal-cloud-02, deliberately
 * EXCLUDED: it is not part of the Ciphera production estate.
 *
 * Both lists are hand-maintained and must stay in sync. This file is the
 * fallback rendering source if the backend returns a report with no inventory.
 *
 * ⚠️ Verify against `exo compute instance list` when editing — do not copy from
 * Infra/docs/infrastructure.md, whose fleet table is a historical snapshot and
 * carries a staleness banner saying so.
 *
 * Keep in sync with:
 *   - Public/website-backend/internal/sustainability/inventory.go
 */
export const STATIC_INVENTORY: InventoryItem[] = [
  // Kubernetes: the SKS node pool now runs every application workload, plus
  // the main PostgreSQL (CloudNativePG) and Redis.
  {
    instance: 'pool-2a818-czzuv',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Kubernetes node (SKS) — application workloads',
  },
  {
    instance: 'pool-2a818-smewd',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Kubernetes node (SKS) — application workloads',
  },
  {
    instance: 'pool-2a818-znohg',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Kubernetes node (SKS) — application workloads',
  },
  {
    instance: 'pool-2a818-iztti',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Kubernetes node (SKS) — application workloads',
  },
  {
    instance: 'pool-2a818-qnlmr',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Kubernetes node (SKS) — application workloads',
  },

  // Platform services that remain on dedicated instances.
  {
    instance: 'relay-ops',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Transactional email relay (Stalwart) + relay database',
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
    instance: 'ci-ops',
    type: 'Standard-Medium',
    vcpu: 2,
    ramGb: 4,
    zone: 'CH-DK-2',
    purpose: 'Continuous integration (Woodpecker server + agent)',
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
    instance: 'nomad-ops',
    type: 'Standard-Small',
    vcpu: 2,
    ramGb: 2,
    zone: 'CH-DK-2',
    purpose: 'Nomad orchestration server',
  },
]
