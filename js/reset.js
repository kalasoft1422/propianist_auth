
async function initializeRecovery()
{
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const status = document.getElementById("status");
    const updateButton = document.getElementById("updateButton");
    const openButton = document.getElementById("openButton");

    try
    {
        //------------------------------------------------------
        // Read recovery tokens from URL
        //------------------------------------------------------

        const hash = window.location.hash.substring(1);

        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if(!accessToken || !refreshToken)
        {
            throw new Error(
                "This password reset link is invalid or has expired.");
        }

        //------------------------------------------------------
        // Create recovery session
        //------------------------------------------------------

        const { error } =
            await supabaseClient.auth.setSession({

                access_token: accessToken,

                refresh_token: refreshToken

            });

        if(error)
        {
            throw error;
        }

        //------------------------------------------------------
        // Enable Update Button
        //------------------------------------------------------

        updateButton.onclick = updatePassword;
    }
    catch(error)
    {
        console.error(error);

        title.textContent = "Reset Failed";

        message.textContent =
            error.message ??
            "The recovery link is invalid or has expired.";

        updateButton.disabled = true;
    }
}

async function updatePassword()
{
    const password =
        document.getElementById("password").value.trim();

    const confirm =
        document.getElementById("confirmPassword").value.trim();

    const status =
        document.getElementById("status");

    const title =
        document.getElementById("title");

    const message =
        document.getElementById("message");

    const updateButton =
        document.getElementById("updateButton");

    const openButton =
        document.getElementById("openButton");

    status.textContent = "";

    //------------------------------------------------------
    // Validation
    //------------------------------------------------------

    if(password.length < 6)
    {
        status.textContent =
            "Password must contain at least 6 characters.";

        return;
    }

    if(password !== confirm)
    {
        status.textContent =
            "Passwords do not match.";

        return;
    }

    updateButton.disabled = true;

    updateButton.textContent = "Updating...";

    //------------------------------------------------------
    // Update Password
    //------------------------------------------------------

    const { error } =
        await supabaseClient.auth.updateUser({

            password: password

        });

    if(error)
    {
        status.textContent = error.message;

        updateButton.disabled = false;

        updateButton.textContent = "Update Password";

        return;
    }

    //------------------------------------------------------
    // Success
    //------------------------------------------------------

    title.textContent = "🎉 Password Updated";

    message.textContent =
        "Your password has been updated successfully.";

    status.textContent = "";

    document.querySelector(".form").style.display = "none";

    openButton.style.display = "block";
}

initializeRecovery();
