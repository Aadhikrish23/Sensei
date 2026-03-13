import axios from "axios";

const baseurl = process.env.AI_SERVICES_URL || "http://localhost:8000"

const aiClient = axios.create({
    baseURL:baseurl,
    timeout:60000
})

export default aiClient