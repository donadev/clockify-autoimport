import 'dotenv/config'
import axios from 'axios';

type Task = {
    id: String
    name: String
    project: Project
}
type Project = {
    name: String
    id: String
}

const fullName = (task : Task): String => {
    return `${task.project.name}: ${task.name}`
}

const WORKSPACE_ID = process.env.WORKSPACE_ID ?? ""
const CLOCKIFY_API_KEY = process.env.CLOCKIFY_API_KEY ?? ""

console.log("Env", process.env)
const clockify = axios.create({
    baseURL: `https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}`,
    timeout: 1000,
    headers: {'x-api-key': CLOCKIFY_API_KEY}
  });
const getTasks = async (project: Project): Promise<Task[]> => {
    console.log("GetTasks", project.name)
    const { data } = await clockify.get(`/projects/${project.id}/tasks`)
    return data

}
const getAllTasks = async (projects: Project[]): Promise<Task[]> => {
    var output: Task[] = []
    for (const project of projects) {
        await delay(50)
        const tasks = (await getTasks(project)).map(v => {
            return {...v, project: project}
        })
        output = output.concat(tasks)
    }
    return output
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const getProjects = async (): Promise<Project[]> => {
    console.log("GetProjects")
    const { data } = await clockify.get("/projects")
    return data
}


const load = async () => {
    const projects = await getProjects()
    const tasks = await getAllTasks(projects);
    console.log(tasks)
    console.log(`Tasks ${tasks.map(v => fullName(v))}`)
}


load().then(console.log).catch(console.error)
