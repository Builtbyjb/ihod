export function generateOTP() {
    const otp =
        (crypto.getRandomValues(new Uint32Array(1))[0] % 90000000) + 10000000;
    return otp.toString();
}
