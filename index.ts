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

import {createInterface} from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (questionText: string) =>
    new Promise<string>(resolve => rl.question(questionText, resolve))
        .finally(() => rl.close());


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

const generatePrompt = (tasks: Task[], description: String): string => {
    return `
    Devo creare il mio timesheet su Clockify per oggi.
    Sono nel team prodotto/tech di Vitesy, la mia giornata lavorativa è dalle 09:00 alle 18:00, con pausa pranzo dalle 13:00 alle 14:00. La pausa pranza non deve essere loggata, ma in quella fascia oraria non deve figurare nessuna attività.
    Ora ti girerò la lista dei task e progetti sotto forma di array Progetto: Task, e poi ti dirò cosa ho fatto questa giornata. Generami il file da importare su clockify.

    ${tasks.map(v => fullName(v))}

    Cosa ho fatto oggi:

    ${description}


    `
}

const load = async () => {
    const projects = await getProjects()
    const tasks = await getAllTasks(projects);
    const prompt = await question("Descrivi la tua giornata, descrivendo ogni task a che ora è iniziato:\n")
    console.log("-----COPIA QUESTO PROMPT SU GPT PER AVERE IL FILE -----")
    console.log(generatePrompt(tasks, prompt))
}


load().then(console.log).catch(console.error)
