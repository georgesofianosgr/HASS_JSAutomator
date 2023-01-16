# Home Assistant - JSAutomator
Create Home Assistance automations with Javascript or Typescript

..: UNDER_CONSTRUCTION ::..

Sample automation
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
