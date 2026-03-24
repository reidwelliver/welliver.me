import { MagnetManager } from "./manager";

const magnetManagerInstance: MagnetManager = new MagnetManager();
magnetManagerInstance.init();

export { MagnetManager, magnetManagerInstance };
