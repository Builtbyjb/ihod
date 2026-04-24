export const ACCESS_TOKEN_MAX_AGE = 1800 // 30 minutes in seconds
export const ACCESS_TOKEN_EXP = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE

export const REFRESH_TOKEN_MAX_AGE = 7_776_000 // 90 days in seconds
export const REFRESH_TOKEN_EXP = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_MAX_AGE
