"use server"

import geminiChatbot from "@/lib/util/chatbot-gemini"
import { getSession } from "../util/authTools"


export async function sendMessageAction(message: string) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    // later you can store message in DB here

    const response = await geminiChatbot(message)

    return response
}