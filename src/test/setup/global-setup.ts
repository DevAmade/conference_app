import { startDocker } from "./docker-manager";

async function setup() {
    await startDocker();
}

export default setup;