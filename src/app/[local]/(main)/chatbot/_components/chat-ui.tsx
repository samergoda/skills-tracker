"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageAction } from "@/lib/actions/chat.action";
import { useState, useTransition } from "react"

type Message = { role: "user" | "assistant"; content: string }

export default function ChatUI() {
    const [messages, setMessages] = useState<
        Message[]
    >([])

    const [input, setInput] = useState("")
    const [isPending, startTransition] = useTransition()

    const handleSend = () => {
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input }

        setMessages(prev => [...prev, userMessage])
        setInput("")

        startTransition(async () => {
            const reply = await sendMessageAction(input)

            setMessages(prev => [
                ...prev,
                { role: "assistant", content: reply ?? 'No response, try again' },
            ])
        })
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <h2 className="">Your assistant</h2>
            <div className="border rounded p-4 h-96 overflow-y-auto space-y-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={
                            msg.role === "user"
                                ? "text-right"
                                : "text-left text-blue-500"
                        }
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button
                    onClick={handleSend}
                    disabled={isPending || !input.trim()}
                >
                    Send
                </Button>
            </div>
        </div>
    )
}