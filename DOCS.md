# Matter-liquid
## Usage
```javascript
  // create Matter.Engine and Matter.Render instances
  const { Liquid } = Matter;
  const liquid = Liquid.create(config);
```
```typescript
const config = { // field: type = default
  // Required
  engine: Matter.Engine
  render: Matter.Render

  // Optional
  isPaused: boolean = false   // Set pause on start
  isFullMode: boolean = false // Choose full algorithm (with viscosity)
  radius: number = 30         // Interaction radius
  gravityRatio: number = 0.1  // The ratio of particle gravity to the gravity of Matter's world
}
```
## Events

```javascript
  liquid.on(Liquid.events.PAUSED, callback); // Set event listener
  liquid.off(Liquid.events.PAUSED, callback); // Remove event listener
  liquid.emit('customEvent'); // Trigger event
```
PAUSED - Calls after `liquid.state.setPause(true | undefined)`
CONTINUE - Calls after `liquid.state.setPause(false)`