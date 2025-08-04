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
            console.warn("❗ Kullanıcı ya da token geçersiz, bağlantı kurulmadı");
            return;
        }
        if (!stompClientRef.current?.connected) {
            console.log("🚀 WebSocket bağlantısı başlatılıyor");

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
                brokerURL: "ws://localhost:8080/ws",
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                debug: (str) => {
                    console.log("📡 STOMP DEBUG →", str);
                },
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log("✅ WebSocket bağlandı! Kullanıcı:", username);
                    client.subscribe("/user/queue/notifications", (message) => {
                        try {
                            const body = JSON.parse(message.body);
                            toast.info(`${body.title}: ${body.message}`);
                        } catch (e) {
                            console.error("⚠️ JSON parse hatası:", e);
                        }
                    });
                },

                onStompError: (frame) => {
                    console.error("🚨 STOMP Hatası:", frame);

                },
                onWebSocketClose: (event) => {
                    console.warn("🔌 WebSocket bağlantısı kapandı:", event);
                },
            });
            client.activate();
            stompClientRef.current = client;
        }

        return () => {
            stompClientRef.current?.deactivate();
            console.log("⛔ WebSocket bağlantısı kapatılıyor");

        };
    }, [isInitialized, user, token]);

    return null;
}

