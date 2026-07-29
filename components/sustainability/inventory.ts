import type { InventoryItem } from './types'

/**
 * Static 5-instance inventory — the TypeScript twin of the Go
 * StaticInventory() function in website-backend. Reconciled against the live
 * Exoscale compute API on 2026-07-29: 5 production instances, all in
 * CH-DK-2 (Zurich).
 *
 * RECONCILIATION NOTE — this list had drifted badly and was corrected in one
 * pass on 2026-07-26. It previously published FOUR instances that no longer
 * exist (db-ops, infra-ops, pulse-ops, envoy-ops-new, all deleted during the
 * Kubernetes migration) while omitting the five SKS nodes and ci-ops entirely.
 * internal-ops, registry-ops and public-ops were all retired the same day
 * (public-ops last, once ci.ciphera.net moved onto the cluster). ci-ops was
 * retired on 2026-07-27, once Woodpecker's server and agent both moved into the
 * cluster and CI stopped depending on a dedicated VM — 11 instances to 10.
 * nomad-ops was retired later the same day, once Nomad itself was removed from
 * the estate (Loki and Tempo moved into the cluster; Prometheus, Alertmanager,
 * Grafana and the blackbox exporter became native systemd units on sentinel-ops).
 * The SKS pool was simultaneously 6 -> 4 -> 2 nodes, changing every node name —
 * 10 instances to 6. sentinel-ops itself was retired on 2026-07-29 once the last
 * things on it (three backup timers) became in-cluster CronJobs and the blackbox
 * exporter moved to vault-ops — 6 instances to 5.
 * Because this page is a transparency artifact, a stale entry is a factual
 * misstatement rather than cosmetic debt.
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
  //
  // 2026-07-27: the pool was migrated 6 x Standard-Medium -> 4 x Standard-Large and
  // then downscaled to 2 pre-launch. EVERY node name changed in that migration, so
  // the five names previously listed here (czzuv, smewd, znohg, iztti, qnlmr) had all
  // ceased to exist. Node names are ephemeral by design — re-read them from
  // `exo compute instance list` whenever the pool is touched, never carry them forward.
  {
    instance: 'pool-2a818-jdatl',
    type: 'Standard-Large',
    vcpu: 4,
    ramGb: 8,
    zone: 'CH-DK-2',
    purpose: 'Kubernetes node (SKS) — application workloads',
  },
  {
    instance: 'pool-2a818-yfciv',
    type: 'Standard-Large',
    vcpu: 4,
    ramGb: 8,
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
  // sentinel-ops was RETIRED on 2026-07-29 and the instance deleted, taking the estate
  // from 6 instances to 5. Prometheus, Alertmanager and Grafana moved into the SKS
  // cluster on 2026-07-28; the blackbox exporter moved to vault-ops (it must probe the
  // public edges from OUTSIDE the cluster, or it would go blind in exactly the failure it
  // exists to catch); the backup mirror reconciler, its weekly self-test and its monthly
  // restore drill became CronJobs in the cluster on 2026-07-29.
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
    // Corrected 2026-07-29: no longer "Transit + Raft". Production Vault was rebuilt
    // on a shamir seal that day and the transit Vault it used to unseal from is a
    // stopped container pending deletion. This host also took over the blackbox
    // exporter when sentinel-ops was retired.
    purpose: 'HashiCorp Vault (Raft) + external endpoint probes',
  },
]
