/**
 * The Swiss grid figure /sustainability states, and where it comes from: the location-based greenhouse-gas factor of
 * the electricity used in Switzerland in 2025 (imports counted hour by hour, scope 1-3 factors, network losses
 * included), from VSE, «CO2-Gehalt des Strommix Schweiz bis 2050», Ergebnisse 2026 (25.02.2026); 2025 is partly
 * provisional there. https://www.strom.ch/de/dokument/co2-gehalt-des-strommix-schweiz-bis-2050-2026
 *
 * website-backend computes the estimate with the same figure (internal/sustainability/factors.go:
 * SwissGridIntensityGCO2ePerKWh and GridSource). This copy feeds the page's own sentence and stat, and the emergency
 * report the page renders when the backend cannot be reached. Change both repositories together.
 */
export const SWISS_GRID = {
  gCO2ePerKWh: 90,
  year: 2025,
  source: 'Swiss consumer mix 2025, VSE (strom.ch), partly provisional',
} as const
