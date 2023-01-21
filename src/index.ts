import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import * as tsImport from 'ts-import';
import ws from 'ws';
import { Automator, DeviceType } from './core/automator';
import { Hass } from './core/hass';
import { Device } from 'src/core/device';
import { callEventHanlderForDevice, convertDevicesToEventDict } from './device/device.utils';

const AUTOMATIONS_PATH = process.env.AUTOMATIONS_PATH ?? '/automations';

// Need to add websocket as global for home-assistant-js-websocket
const wnd: Record<string,any> = globalThis;
wnd.WebSocket = ws;


const subscribeToEvents = () => {
  const devices = Automator.getDevices();
  const eventToDevicesMap = convertDevicesToEventDict(devices);

  const events = Object.keys(eventToDevicesMap);
  events.map(eventType => {
    Hass.subscribeToEvent(eventType, (event: Record<string,any> ) => {
      const eventDevices = eventToDevicesMap[eventType]; 
      eventDevices.forEach(device => {
        const eventEntityId = event.data.entity_id;
        if(device.isEntity(eventEntityId)) {
          callEventHanlderForDevice(eventType,device, event.data.new_state, event.data.old_state)
        }
      });
    });
  });
}

const checkEnvVars = () => {
  if(!process.env.HASS_URL) {
    throw new Error("HASS_URL environment variable does not exist");
  }
  if(!process.env.ACCESS_TOKEN) {
    throw new Error("ACESS_TOKEN environment variable does not exist");
  }
}

const main = async () => {
  checkEnvVars();
  // Connect
  await Automator.initialize();
  // Load Automation Plugins
  const blueprints = loadDevicesFile();
  Automator.createDevices(blueprints);
  await loadAutomations();
  subscribeToEvents();
};

const loadDevicesFile = () => {
  console.debug('[loadDevicesFile] Loading Devices');
  const fileName = "devices.json";
  const directory = AUTOMATIONS_PATH;
  const devicesFilePath = path.join(directory,fileName);

  if(!fs.existsSync(directory)) {
    console.error(`[loadDevicesFile] Automations directory (${AUTOMATIONS_PATH}) not found`);
    return [];
  }

  if(!fs.existsSync(devicesFilePath)) {
    console.error(`[loadDevicesFile] ${fileName} not found in Automations directory`);
    return [];
  }

  let data = fs.readFileSync(devicesFilePath,'utf8');
  let devices = [];
  try {
   devices = JSON.parse(data);
  } catch(error) {
    throw new Error(`[loadDevicesFile] Could not parse ${fileName}`);
  }
  return devices;
}

const loadAutomationFile = async (filePath: string) => {
  const asyncResult = await tsImport.load(filePath, {
    mode: tsImport.LoadMode.Compile,
  });
  return asyncResult.default;
}

async function loadAutomationModules() {
  console.debug('[loadAutomationModules] Loading Modules');
  const directory = AUTOMATIONS_PATH;

  if(!fs.existsSync(directory)) {
    console.error(`[loadAutomationModules] Automations directory (${AUTOMATIONS_PATH}) not found`);
    return [];
  }

  const automationFileNames = fs.readdirSync(directory);

  const promises = automationFileNames.reduce<Promise<any>[]>((result, fileName) => {
    const automationPath = path.join(directory,fileName);
    const isCompatibleFile = automationPath.endsWith('.ts') || automationPath.endsWith('.js') 

    if (isCompatibleFile && fs.existsSync(automationPath)) {
      console.debug('[loadAutomationModules] Loading:',automationPath);
      const modulePromise = loadAutomationFile(automationPath);
      return [...result, modulePromise];
    }

    return result;
  }, []);

  const modules = await Promise.all(promises);
  return modules;
}


const loadAutomations = async () => {
  const automationModules = await loadAutomationModules();
  automationModules.forEach(module => {
    const {automations} = module;
    if(!automations) {
      throw new Error("Automation file does not export automations field");
    }
    automations.forEach((automation: Function) => automation({Light: Automator.Light,Switch: Automator.Switch}));
  });
}

main();
