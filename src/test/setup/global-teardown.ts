import { stopDocker } from "./docker-manager";

async function tearDown() {
    await stopDocker();
}

export default tearDown;