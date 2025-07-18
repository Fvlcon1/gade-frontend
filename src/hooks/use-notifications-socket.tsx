'use client'

import { useEffect, useRef, useState } from "react"
import Cookies from "universal-cookie"
import { Notification } from "@/utils/@types"

const useNotificationsSocket = () => {
    const socketRef = useRef<WebSocket | null>(null)
    const [isNotificationVisible, setIsNotificationVisible] = useState(false)
    const [notification, setNotification] = useState<Notification | null>(null)

    useEffect(() => {
		// Create WebSocket connection
		const cookies = new Cookies()
		const token = cookies.get("accessToken")
		const socket = new WebSocket(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_SOCKET_URL}`)
		socketRef.current = socket

		// Connection opened
		socket.addEventListener('open', (event) => {
			socket.send('Hello Server!')
		})

		// Listen for messages
		socket.addEventListener('message', (event) => {
			console.log({socketData : event.data})
		})

		// Connection closed
		socket.addEventListener('close', (event) => {
		})

		// Error handling
		socket.addEventListener('error', (error) => {
		})

		// Clean up on unmount
		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.close()
			}
		}
	}, [])

    return {
        isNotificationVisible,
        setIsNotificationVisible,
        notification,
        setNotification
    }
}
export default useNotificationsSocket