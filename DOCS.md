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

  // Optional, constant
  isAdvancedAlgorithm: boolean = false  // Use advanced algorithm (with viscosity)
  isRegionalComputing: boolean = false  // Computing all particles in the camera's region or in all world
  radius: number = 30                   // Interaction radius of particles

  // Optional, redefinable
  isPaused: boolean = false             // Set pause on start
  gravityRatio: number = 0.1            // The ratio of particle gravity to the gravity of Matter's world
  updateEveryFrame: number = 2          // Compute every N frame (default matter engine's FPS is 60)
  timeScale: number = 1                 // It multiplies to engine.timing.timeScale
}
```
## Requirements
Не менять параметры `world.bounds` после инициализации связанного экземпляра `Liquid`
## Events

```javascript
  liquid.events.pauseChange = (isPaused)=>{...}; // Set event listener
  liquid.events.pauseChange = ()=>{}; // Remove event listener
```
>
```typescript
// Event list:
{ // eventName(parameter: type, ..)
  pauseChange(isPaused: boolean){} // Calls after `.setPause()`
}
```