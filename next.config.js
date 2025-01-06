// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Optional
  output: 'export',

  webpack: (config) => {
    config.module.rules.push(
      // Rule for CSS Modules (e.g., *.module.css)
      {
        test: /\.module\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true, // Enable CSS Modules for files matching *.module.css
                localIdentName: '[name]__[local]--[hash:base64:5]', // Customize the generated CSS class names
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: false, // Tell postcss-loader to use the config file
                plugins: [
                  'postcss-preset-mantine',
                  'postcss-simple-vars',
                  'postcss-preset-env',
                ],
              },
            },
          },
        ],
      },
      // Rule for global CSS from node_modules
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'global', // Treat as global CSS
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: false,
                plugins: [
                  'postcss-preset-mantine',
                  'postcss-simple-vars',
                  'postcss-preset-env',
                ],
              },
            },
          },
        ],
      },
    );

    return config;
  },
};

module.exports = nextConfig;