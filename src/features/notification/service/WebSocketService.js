import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function NotificationSocket({ user, token, isInitialized }) {
    const stompClientRef = useRef(null);
    useEffect(() => {
        if (!isInitialized) return;
        console.log("🧪 useEffect triggered", user, token);
        const username = user?.username || user?.sub || user?.id;
        if (!username || !token || token.length < 10) {
            return;
        }
        if (!stompClientRef.current?.connected) {
            // const socket = new SockJS(`http://localhost:8080/ws`);
            // const client = new Client({
            //     webSocketFactory: () => socket,
            //     connectHeaders: {
            //         Authorization: `Bearer ${token}`
            //     },


            //     onConnect: () => {
            //         console.log("2. satır")

            //         client.subscribe("/user/queue/notifications", (msg) => {
            //             console.log("📩", JSON.parse(msg.body));
            //         });
            //     },
            //     onStompError: (frame) => {
            //         console.error("STOMP Error:", frame);
            //     },
            // });
            const client = new Client({
                webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                onConnect: () => {
                    client.subscribe("/user/queue/notifications", (message) => {
                    });
                },
                onStompError: (frame) => {
                },
                debug: (str) => {
                },
                reconnectDelay: 5000, // Bağlantı koparsa yeniden denesin
            });
            client.activate();
            stompClientRef.current = client;
        }

        return () => {
            stompClientRef.current?.deactivate();
        };
    }, [isInitialized, user, token]);

    return null;
}

