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