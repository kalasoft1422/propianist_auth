window.addEventListener("load", verifyEmail);

async function verifyEmail()
{
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const icon = document.getElementById("icon");
    const countdown = document.getElementById("countdown");
    const seconds = document.getElementById("seconds");
    const openButton = document.getElementById("openButton");

    try
    {
        //--------------------------------------------------
        // Check current session
        //--------------------------------------------------

        const { data, error } =
            await supabaseClient.auth.getSession();

        if(error)
        {
            throw error;
        }

        if(!data.session)
        {
            throw new Error(
                "Verification link is invalid or has expired.");
        }

        //--------------------------------------------------
        // Success
        //--------------------------------------------------

        title.textContent = "Email Verified";

        message.textContent =
            "Your email has been successfully verified. " +
            "You can now continue learning with ProPianist.";

        countdown.style.display = "block";

        openButton.style.display = "block";

        //--------------------------------------------------
        // Countdown
        //--------------------------------------------------

        let time = 3;

        const timer = setInterval(() =>
        {
            time--;

            seconds.textContent = time;

            if(time <= 0)
            {
                clearInterval(timer);

                window.location.href =
                    Config.APP_DEEP_LINK;
            }

        },1000);
    }
    catch(error)
    {
        console.error(error);

        icon.classList.remove("successIcon");
        icon.classList.add("errorIcon");
        icon.innerHTML = "✕";

        title.textContent = "Verification Failed";

        message.textContent =
            error.message ??
            "The verification link is invalid or has expired.";

        openButton.style.display = "block";
    }
}
