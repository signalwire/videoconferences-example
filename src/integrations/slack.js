import React, { useEffect, useRef, useState } from "react";
import CONST from '../CONST'

async function listUsers() {    
    const res = await fetch("https://slack.com/api/users.list?pretty=1", {
        method: "POST",
        body: new URLSearchParams({
            token: CONST.slack_bot_user_oauth_token
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    if (!res.ok) {
        throw new Error(`SLACK: Server error ${res.status}`);
    }

    const response = await res.json();

    return response.members
            .filter(m => !m.deleted && !m.is_restricted && m.is_email_confirmed && !m.is_app_user && !m.is_bot)
            .sort((a, b) => a.real_name.localeCompare(b.real_name))
}

export async function sendMessage(channelId, message) {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        body: new URLSearchParams({
            token: CONST.slack_bot_user_oauth_token,
            channel: channelId,
            text: message,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    if (!res.ok) {
        throw new Error(`SLACK: Server error ${res.status}`);
    }

    console.log(res)
    return res.json();
}

export function useSlackUsers() {
    const [users, setUsers] = useState();

    useEffect(() => {
        listUsers().then(ret => setUsers(ret))
    }, [])

    return users ?? []
}
