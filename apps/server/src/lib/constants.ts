export const ACCESS_TOKEN_MAX_AGE = 1800; // 30 minutes in seconds
export function getAccessTokenExp() {
    return Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE;
}

export const REFRESH_TOKEN_MAX_AGE = 7_776_000; // 90 days in seconds
export function getRefreshTokenExp() {
    return Math.floor(Date.now() / 1000) + REFRESH_TOKEN_MAX_AGE;
}
