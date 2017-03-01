
export const fetchMeetups = () => 
    fetch('http://192.168.1.136:3000/api/meetups')
        .then(res => res.json());