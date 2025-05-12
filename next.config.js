/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
};

if (process.env.NEXT_PUBLIC_TEMPO) {
    nextConfig["experimental"] = {
        swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]]
    };
}

module.exports = nextConfig;

