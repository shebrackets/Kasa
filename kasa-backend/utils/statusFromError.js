// Déduit un code HTTP à partir d'une erreur levée par les services.
// - e.status explicite (levé volontairement par un service) est toujours prioritaire.
// - conflictPattern (optionnel) permet de mapper une erreur SQLite de contrainte
//   (ex: UNIQUE, PRIMARY KEY) vers un 409 Conflict plutôt qu'un 500 générique.
function statusFromError(e, conflictPattern) {
  if (e && e.status) return e.status;
  if (conflictPattern && e && e.message && conflictPattern.test(e.message)) return 409;
  return 500;
}

module.exports = statusFromError;
