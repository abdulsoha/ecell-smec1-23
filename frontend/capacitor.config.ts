import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e4f2bc8050924ddd98eee66d9c95d168',
  appName: 'ecell-smec1-72',
  webDir: 'dist',
  server: {
    url: 'https://e4f2bc80-5092-4ddd-98ee-e66d9c95d168.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;