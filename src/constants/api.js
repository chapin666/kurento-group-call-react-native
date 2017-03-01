

export const ROOM_SERVER = "47.91.149.159:8443";

export const fetchMeetups = () => 
    fetch('http://192.168.1.136:3000/api/meetups')
        .then(res => res.json());