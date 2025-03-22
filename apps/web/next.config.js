/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import withPWASetup from 'next-pwa';
const withPWA = withPWASetup({
  dest: 'public'
})


/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
}

export default withPWA(config);
