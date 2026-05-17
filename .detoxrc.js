const isWindows = process.platform === 'win32';
const gradlew = isWindows ? 'gradlew.bat' : './gradlew';
const androidGradleBuild = (assembleTask, testBuildType) =>
  `cd android && ${gradlew} ${assembleTask} assembleAndroidTest -DtestBuildType=${testBuildType}`;

/** @type {Detox.DetoxConfig} */
module.exports = {  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/events.app',
      build:
        'xcodebuild -workspace ios/events.xcworkspace -scheme events -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/events.app',
      build:
        'xcodebuild -workspace ios/events.xcworkspace -scheme events -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: androidGradleBuild('assembleDebug', 'debug'),
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: androidGradleBuild('assembleRelease', 'release'),
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: '000693437000149',
      },
    },
    'genymotion.emulator.uuid': {
      type: 'android.genycloud',
      device: {
        recipeUUID: 'a521e033-0fa6-4579-9b2c-8f877ea50af2',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.genymotion.debug': {
      device: 'genymotion.emulator.uuid',
      app: 'android.debug',
    },
    'android.genymotion.release': {
      device: 'genymotion.emulator.uuid',
      app: 'android.release',
    },
  },
};
