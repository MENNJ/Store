"use client";

import { io } from "socket.io-client";

export let socket = null;

export function initSocket(userinfo) {
    if(!socket){
        socket = io( "/", {
            query: {
                ...userinfo,
            },
        })
    }
}