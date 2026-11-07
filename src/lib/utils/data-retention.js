const DEFAULT_RETENTION_DAYS = 30;
const MAX_RETENTION_DAYS = 3650;

export function getDataRetentionDays() {
  const configuredDays = Number(
    process.env.DATA_RETENTION_DAYS ?? DEFAULT_RETENTION_DAYS,
  );

  if (
    !Number.isInteger(configuredDays) ||
    configuredDays < 1 ||
    configuredDays > MAX_RETENTION_DAYS
  ) {
    const error = new Error(
      `DATA_RETENTION_DAYS must be between 1 and ${MAX_RETENTION_DAYS}.`,
    );
    error.code = "INVALID_DATA_RETENTION_DAYS";
    throw error;
  }

  return configuredDays;
}

export function getDataExpirationDate(from = new Date()) {
  const configuredDays = getDataRetentionDays();
  return new Date(from.getTime() + configuredDays * 24 * 60 * 60 * 1000);
}

export function getSessionExpirationDate(from = new Date()) {
  const defaultMinutes = 5;
  const maximumMinutes = 120;
  const configuredMinutes = Number(
    process.env.SESSION_DURATION_MINUTES ?? defaultMinutes,
  );

  if (
    !Number.isInteger(configuredMinutes) ||
    configuredMinutes < 1 ||
    configuredMinutes > maximumMinutes
  ) {
    const error = new Error(
      `SESSION_DURATION_MINUTES must be between 1 and ${maximumMinutes}.`,
    );
    error.code = "INVALID_SESSION_DURATION_MINUTES";
    throw error;
  }

  return new Date(from.getTime() + configuredMinutes * 60 * 1000);
}
