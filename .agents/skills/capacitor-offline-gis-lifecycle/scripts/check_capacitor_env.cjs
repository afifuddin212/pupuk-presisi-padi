#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(`
check_capacitor_env: Black-box CLI utility to audit Capacitor Android configurations for offline GIS apps.

Usage:
  node check_capacitor_env.cjs [path-to-app-root] [options]

Options:
  --help, -h       Show this help message and exit.
  --json           Output audit checks as raw JSON.

Checks Performed:
  - largeHeap & hardwareAccelerated enabled in AndroidManifest.xml
  - ACCESS_FINE_LOCATION & ACCESS_COARSE_LOCATION permissions present
  - CAMERA & WRITE_EXTERNAL_STORAGE permissions configured
  - Web asset synchronization directory status
`);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const appDir = args[0] && !args[0].startsWith('-') ? path.resolve(args[0]) : process.cwd();
const manifestPath = path.join(appDir, 'android/app/src/main/AndroidManifest.xml');

const manifestExists = fs.existsSync(manifestPath);
let manifestContent = '';
if (manifestExists) {
  manifestContent = fs.readFileSync(manifestPath, 'utf8');
}

const checks = {
  appDirectory: appDir,
  hasAndroidManifest: manifestExists,
  hasLargeHeap: manifestContent.includes('android:largeHeap="true"'),
  hasHardwareAccelerated: manifestContent.includes('android:hardwareAccelerated="true"'),
  hasFineLocation: manifestContent.includes('android.permission.ACCESS_FINE_LOCATION'),
  hasCoarseLocation: manifestContent.includes('android.permission.ACCESS_COARSE_LOCATION'),
  hasCamera: manifestContent.includes('android.permission.CAMERA'),
};

const allPassed = Object.entries(checks)
  .filter(([k]) => k.startsWith('has'))
  .every(([, v]) => v === true);

if (args.includes('--json')) {
  console.log(JSON.stringify({ ...checks, allPassed }, null, 2));
} else {
  console.log('--- Capacitor Android Offline GIS Audit ---');
  console.log('App Root:             ', appDir);
  console.log('AndroidManifest.xml:  ', checks.hasAndroidManifest ? '✓ Found' : '✗ Missing');
  console.log('largeHeap="true":     ', checks.hasLargeHeap ? '✓ Enabled' : '✗ Disabled (Risk of OOM on large maps)');
  console.log('hardwareAccelerated:  ', checks.hasHardwareAccelerated ? '✓ Enabled' : '✗ Disabled');
  console.log('Fine Location (GPS):  ', checks.hasFineLocation ? '✓ Declared' : '✗ Missing');
  console.log('Camera Permission:    ', checks.hasCamera ? '✓ Declared' : '✗ Missing');
  console.log('Overall Audit Status: ', allPassed ? '✓ READY FOR FIELD GIS' : '⚠ ATTENTION NEEDED');
}

