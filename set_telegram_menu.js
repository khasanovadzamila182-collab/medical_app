const token = "8235269986:AAGaZB6-jId251IJgpDx-MMs1D0pOx30604";
const vercelUrl = "https://mama-expert.vercel.app";

async function setMenu() {
    const url = `https://api.telegram.org/bot${token}/setChatMenuButton`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            menu_button: {
                type: "web_app",
                text: "MomGuide",
                web_app: { url: vercelUrl }
            }
        })
    });

    const data = await response.json();
    console.log("setChatMenuButton response:", data);
}

setMenu();
