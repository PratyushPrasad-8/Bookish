import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", async () => {
    try {
        const res = await fetch("https://bookish-bu7u.onrender.com/");
        if(res.status === 200){
            console.log("Server is up and running");
        } else {
            console.log("Server is down");
        }
    } catch (error) {
        console.log("Error:", error);
    }
});


export default job;