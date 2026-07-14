window.addEventListener("load", initialize);

async function initialize()
{
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const passwordPanel = document.getElementById("passwordPanel");
    const updateButton = document.getElementById("updateButton");

    try
    {
        //--------------------------------------------------
        // Read URL Parameters
        //--------------------------------------------------

        const params = new URLSearchParams(window.location.search);

        const tokenHash = params.get("token_hash");

        const type = params.get("type");

        if(tokenHash == null)
        {
            throw new Error("Recovery link is invalid.");
        }

        //--------------------------------------------------
        // Verify Recovery Token
        //--------------------------------------------------

        const { error } =
                await supabaseClient.auth.verifyOtp({

                    token_hash : tokenHash,

                    type : type

                });

        if(error)
        {
            throw error;
        }

        //--------------------------------------------------
        // Enable Password UI
        //--------------------------------------------------

        title.textContent = "Create New Password";

        message.textContent =
                "Enter your new password below.";

        passwordPanel.style.display = "block";

        updateButton.onclick = updatePassword;
    }
    catch(error)
    {
        console.error(error);

        title.textContent = "Reset Failed";

        message.textContent =
                error.message ??
                "Recovery link is invalid or has expired.";

        passwordPanel.style.display = "none";
    }
}

async function updatePassword()
{
    const password =
            document.getElementById("password").value;

    const confirmPassword =
            document.getElementById("confirmPassword").value;

    const message =
            document.getElementById("message");

    if(password.length < 6)
    {
        message.textContent =
                "Password must be at least 6 characters.";

        return;
    }

    if(password !== confirmPassword)
    {
        message.textContent =
                "Passwords do not match.";

        return;
    }

    const updateButton =
            document.getElementById("updateButton");

    updateButton.disabled = true;

    updateButton.textContent = "Updating...";

    try
    {
        const { error } =
                await supabaseClient.auth.updateUser({

                    password : password

                });

        if(error)
        {
            throw error;
        }

        document.getElementById("title").textContent =
                "Password Updated";

        document.getElementById("message").textContent =
                "Your password has been updated successfully. You can now return to ProPianist and sign in.";

        document.getElementById("passwordPanel").style.display =
                "none";

        const openButton =
                document.getElementById("openButton");

        openButton.style.display = "block";

        openButton.onclick = function(e)
        {
            e.preventDefault();

            window.location.href =
                    Config.APP_DEEP_LINK;
        };

        setTimeout(function()
        {
            window.location.href =
                    Config.APP_DEEP_LINK;

        },3000);
    }
    catch(error)
    {
        console.error(error);

        updateButton.disabled = false;

        updateButton.textContent = "Update Password";

        message.textContent =
                error.message ??
                "Failed to update password.";
    }
}
