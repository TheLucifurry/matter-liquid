import Matter from 'matter-js';

/**
 * An example plugin for matter.js.
 * @module PluginExample
 */
const PluginExample = {
  // plugin meta
  name: 'matter-liquid', // PLUGIN_NAME
  version: '0.0.1', // PLUGIN_VERSION
  for: 'matter-js@0.14.2',

  // installs the plugin where `base` is `Matter`
  // you should not need to call this directly.
  install(base) {
    // after Matter.Body.create call our plugin init function
    base.after('Body.create', function () {
      PluginExample.Body.init(this);
    });
  },

  Body: {
    /**
     * Example function that removes friction every created body.
     * Automatically called by the plugin.
     * @function PluginExample.Body.init
     * @param {Matter.Body} body The body to init.
     * @returns {void} No return value.
     */
    init(body) {
      body.friction = 0;
    },
  },
};

Matter.Plugin.register(PluginExample);

export default PluginExample;

/**
 * @namespace Matter.Body
 * @see http://brm.io/matter-js/docs/classes/Body.html
 */
