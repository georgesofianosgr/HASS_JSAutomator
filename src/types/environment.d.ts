export  {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HASS_URL: string;
      ACCESS_TOKEN: string;
      AUTOMATIONS_PATH: string;
    }
  }
}
