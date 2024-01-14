import 'dotenv/config'
import axios from 'axios';

type Task = {
    name: String
    project: Project
}
type Project = {
    name: String
    id: String
}

const fullName = (task : Task): String => {
    return `${task.project.name}/${task.name}`
}

const WORKSPACE_ID = process.env.WORKSPACE_ID ?? ""
const CLOCKIFY_API_KEY = process.env.CLOCKIFY_API_KEY ?? ""

const clockify = axios.create({
    baseURL: `https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}`,
    timeout: 1000,
    headers: {'x-api-key': CLOCKIFY_API_KEY}
  });
const getTasks = async (project: Project): Promise<Task[]> => {
    const { data } = await clockify.get(`/projects/${project.id}/tasks`)
    return data

}

const getProjects = async (): Promise<Project[]> => {
    const { data } = await clockify.get("/projects")
    return data
}


const load = async () => {
    const projects = await getProjects()
    const tasks = (await Promise.all(projects.map(p => getTasks(p)))).flat();
    console.log(`Tasks ${tasks.map(v => fullName(v))}`)
}


load().then(console.log).catch(console.error)
