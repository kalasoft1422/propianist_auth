window.addEventListener("load", verifyEmail);

async function verifyEmail()
{
    const icon = document.getElementById("icon");
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const countdown = document.getElementById("countdown");
    const seconds = document.getElementById("seconds");
    const openButton = document.getElementById("openButton");

    try
    {
        //--------------------------------------------------
        // Read URL parameters
        //--------------------------------------------------

        const params = new URLSearchParams(window.location.search);

        const tokenHash = params.get("token_hash");

        const type = params.get("type");

        if(!tokenHash)
        {
            throw new Error("Verification link is invalid.");
        }

        //--------------------------------------------------
        // Verify Email
        //--------------------------------------------------

        const { error } =
            await supabaseClient.auth.verifyOtp({

                token_hash: tokenHash,

                type: type

            });

        if(error)
        {
            throw error;
        }

        //--------------------------------------------------
        // Success UI
        //--------------------------------------------------

        title.textContent = "Email Verified";

        message.textContent =
            "Your email has been verified successfully. " +
            "You can now continue using ProPianist.";

        countdown.style.display = "block";

        openButton.style.display = "block";

        openButton.onclick = function(e)
        {
            e.preventDefault();

            window.location.href = Config.APP_DEEP_LINK;
        };

        //--------------------------------------------------
        // Countdown
        //--------------------------------------------------

        let remaining = 3;

        const timer = setInterval(function()
        {
            remaining--;

            seconds.textContent = remaining;

            if(remaining <= 0)
            {
                clearInterval(timer);

                window.location.href = Config.APP_DEEP_LINK;
            }

        },1000);
    }
    catch(error)
    {
        console.error(error);

        icon.classList.remove("successIcon");

        icon.classList.add("errorIcon");

        icon.textContent = "✕";

        title.textContent = "Verification Failed";

        message.textContent =
                error.message ||
                "Verification link is invalid or has expired.";

        countdown.style.display = "none";

        openButton.style.display = "none";
    }
}
