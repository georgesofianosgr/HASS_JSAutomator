# Home Assistant - JSAutomator
Create Home Assistance automations with Javascript or Typescript

..: UNDER_CONSTRUCTION ::..

## Docker
Automator can run with docker which is the recommended way.  
You need to bind /automations directory to a HOST directory with automations  
  
  
## Environment Variables
```
HASS_URL: Your home assistant url e.g. http://192.168.1.20:8123
ACCESS_TOKEN: Generate from home assistant profile page
AUTOMATIONS_PATH= Directory with the following files: devices.json + automationName.js|ts
```


## Sample automation
```javascript
function automation({Light, Switch}: AutomationInput) {
  // Bathroom
  Switch.hallDouble.onLeftPress(()=>{
      Light.bathroom.toggle();
  });
  Switch.hallDouble.onRightPress(()=>{
      Light.hall.toggle();
  });

  // Office
  Switch.office.onSinglePress(()=>{
      Light.office.toggle();
  });

  // Bedroom
  Switch.bedroom.onSinglePress(()=>{
    Light.bedroom.toggle();
  });

}

export default {
  automations: [automation]
}

```
