# ============================================================
# ROOSTER REMINDER
# Expo 57 + Expo Router + NativeWind + EAS Development Build
# ============================================================

# ------------------------------------------------------------
# 0. Make sure you're in your project
# ------------------------------------------------------------
cd "C:\Users\koush\Documents\rooster-reminder"

# ------------------------------------------------------------
# 1. Verify Expo/dependencies before changing anything
# ------------------------------------------------------------
npx expo-doctor
npx expo install --check

# ------------------------------------------------------------
# 2. Configure EAS Update
#    This may modify app.json with the EAS Update URL.
# ------------------------------------------------------------
eas update:configure

# ------------------------------------------------------------
# 3. Add fingerprint runtimeVersion to app.json
#
# IMPORTANT:
# If app.json already has runtimeVersion, don't add another one.
# The desired configuration is:
#
# "runtimeVersion": {
#   "policy": "fingerprint"
# }
#
# Open app.json after this step and make sure it exists.
# ------------------------------------------------------------

# ------------------------------------------------------------
# 4. Create NativeWind files
# ------------------------------------------------------------

# global.css
@"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@ | Set-Content -Encoding UTF8 "global.css"


# tailwind.config.js
@"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
"@ | Set-Content -Encoding UTF8 "tailwind.config.js"


# nativewind-env.d.ts
@"
/// <reference types="nativewind/types" />
"@ | Set-Content -Encoding UTF8 "nativewind-env.d.ts"


# ------------------------------------------------------------
# 5. Create Metro configuration
# ------------------------------------------------------------

@"
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
});
"@ | Set-Content -Encoding UTF8 "metro.config.js"


# ------------------------------------------------------------
# 6. Create/update Babel configuration
#
# IMPORTANT:
# If you already have a custom babel.config.js, inspect it
# before overwriting it.
# ------------------------------------------------------------

if (!(Test-Path "babel.config.js")) {
@"
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
"@ | Set-Content -Encoding UTF8 "babel.config.js"
}

# ------------------------------------------------------------
# 7. Import global.css into Expo Router
#
# We only add the import if it doesn't already exist.
# ------------------------------------------------------------

$layout = "app/_layout.tsx"

if (Test-Path $layout) {
    $content = Get-Content $layout -Raw

    if ($content -notmatch 'global\.css') {
        $content = 'import "../global.css";' + [Environment]::NewLine + $content
        Set-Content -Encoding UTF8 $layout $content
        Write-Host "Added global.css import to app/_layout.tsx"
    }
}
else {
    Write-Host "WARNING: app/_layout.tsx was not found."
    Write-Host "Import ../global.css manually in your Expo Router root layout."
}


# ------------------------------------------------------------
# 8. Create EAS workflow directory
# ------------------------------------------------------------

New-Item -ItemType Directory -Force ".eas\workflows" | Out-Null


# ------------------------------------------------------------
# 9. Create fingerprint-aware automatic development build
#
# Change "main" below if your development branch is different.
# ------------------------------------------------------------

@"
name: Development Build

on:
  push:
    branches:
      - main

jobs:
  fingerprint:
    name: Calculate native fingerprint
    type: fingerprint
    environment: development

  get_android_build:
    name: Find existing compatible build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: `${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: development

  build_android:
    name: Build Android development client
    needs: [get_android_build]
    if: `${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: development
"@ | Set-Content -Encoding UTF8 ".eas\workflows\development-build.yml"


# ------------------------------------------------------------
# 10. Verify the important configuration
# ------------------------------------------------------------

Write-Host ""
Write-Host "==============================================="
Write-Host "Checking Expo configuration..."
Write-Host "==============================================="

npx expo config --type public

Write-Host ""
Write-Host "==============================================="
Write-Host "Checking dependencies..."
Write-Host "==============================================="

npx expo install --check

npx expo-doctor

Write-Host ""
Write-Host "==============================================="
Write-Host "SETUP FILES CREATED"
Write-Host "==============================================="
Write-Host ""
Write-Host "Created/checked:"
Write-Host "  global.css"
Write-Host "  tailwind.config.js"
Write-Host "  nativewind-env.d.ts"
Write-Host "  metro.config.js"
Write-Host "  babel.config.js"
Write-Host "  app/_layout.tsx"
Write-Host "  .eas/workflows/development-build.yml"
Write-Host ""
Write-Host "==============================================="
Write-Host "IMPORTANT: CHECK app.json"
Write-Host "==============================================="
Write-Host ""
Write-Host 'Make sure app.json contains:'
Write-Host ""
Write-Host '  "runtimeVersion": {'
Write-Host '    "policy": "fingerprint"'
Write-Host '  }'
Write-Host ""
Write-Host "Do NOT continue until this is present."
Write-Host ""
Write-Host "==============================================="
Write-Host "NEXT STEPS"
Write-Host "==============================================="
Write-Host ""
Write-Host "1. Check app.json"
Write-Host ""
Write-Host "2. Commit the setup:"
Write-Host '   git add .'
Write-Host '   git commit -m "configure Expo development workflow"'
Write-Host ""
Write-Host "3. Create your NEW Expo 57 development build:"
Write-Host '   eas build --profile development --platform android'
Write-Host ""
Write-Host "4. Install the resulting APK on your phone."
Write-Host ""
Write-Host "5. Start local development:"
Write-Host '   npx expo start'
Write-Host ""
Write-Host "==============================================="


# ------------------------------------------------------------
# Installation
# ------------------------------------------------------------

install packages using - npx expo install package-name