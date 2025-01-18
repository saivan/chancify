/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */


/** @type {import("next").NextConfig} */
const config = {
  // NOTE: This is a workaround for the following issue:
  // https://github.com/vercel/next.js/issues/71638
  // This should be removed once the issue is resolved.
  sassOptions: {
    logger: {
      warn: function(message) {
        if (!message.includes('legacy-js-api')) {
          console.warn(message);
        }
      }
    }
  },
  output: 'standalone',
};

export default config;
