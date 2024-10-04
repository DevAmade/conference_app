import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers'
import path from 'path';

let instance: StartedDockerComposeEnvironment | null = null;

export async function startDocker() {
    const composeFilePath = path.resolve(__dirname);
    const composeFile = 'docker-compose.yml';

    instance = await new DockerComposeEnvironment(composeFilePath, composeFile).up();
    console.log('✅ Docker compose instance running');
}

export async function stopDocker() {
    if(!instance) return

    try {
        instance = null;
    } catch (error) {
        console.log(`❌ Error stopping docker: ${error}`)
    }
}

export function getDockerInstance() {
    if(!instance) throw new Error('Docker instance is not running');
    return instance;
}