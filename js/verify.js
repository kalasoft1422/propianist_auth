async function verifyEmail()
{
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const openButton = document.getElementById("openButton");

    try
    {
        // Parse the URL hash
        const hash = window.location.hash.substring(1);

        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if(!accessToken || !refreshToken)
        {
            throw new Error("Verification link is invalid or has expired.");
        }

        // Create a Supabase session from the tokens
        const { error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        if(error)
        {
            throw error;
        }

        title.textContent = "✓ Email Verified";

        message.textContent =
                "Your email has been successfully verified. You can now continue using ProPianist.";

        openButton.style.display = "block";
    }
    catch(error)
    {
        console.error(error);

        title.textContent = "Verification Failed";

        message.textContent =
                error.message ??
                "The verification link is invalid or has expired.";
    }
}

verifyEmail();
