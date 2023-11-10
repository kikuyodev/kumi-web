import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { onMount } from "solid-js";
import "../../styles/components/flyouts/loginFlyout.scss";
import { Account } from "../../structures/Account";
import { ApiResponseError } from "../../util/errors/ApiResponseError";

export function LoginFlyout() {
    // eslint-disable-next-line prefer-const
    let signin: HTMLButtonElement | undefined = undefined;
    // eslint-disable-next-line prefer-const
    let username: HTMLInputElement | undefined = undefined;
    // eslint-disable-next-line prefer-const
    let password: HTMLInputElement | undefined = undefined;
    // eslint-disable-next-line prefer-const
    let info: HTMLParagraphElement | undefined = undefined;

    onMount(() => {
        signin?.addEventListener("click", () => {
            (async () => {
                try {
                    const result = await Account.instance.login(username!.value, password!.value);

                    Account.instance.apiAccount = result.data?.account;
                    sessionStorage.setItem("_KUMI_ACCOUNT_", JSON.stringify(Account.instance.apiAccount));

                    // refresh page
                    window.location.reload();
                } catch (error) {
                    if (error instanceof ApiResponseError) {
                        info!.innerText = error.message;
                    } else {
                        info!.innerText = "An unknown error occurred.";
                    }
                }
            })();
        });
    });

    return <div class="login_flyout">
        <div class="login_flyout--form">
            <div class="login_flyout--form-inputs">
                <input type="text" name="username" ref={username} placeholder="Username" />
                <input type="password" name="password" ref={password} placeholder="Password" />
                <p id="login_flyout--info" ref={info} />
            </div>
            <div class="login_flyout--form-buttons">
                <button class="login_flyout--form-buttons-signin" ref={signin}>Sign in</button>
                { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">Forgot password?</a>
            </div>
        </div>
        <div class="login_flyout--register">
            <div class="login_flyout--register-header">Don't have an account?</div>
            <div class="login_flyout--register-description">Download Kumi and create one!</div>
            <button class="login_flyout--register-download" onClick={() => { document.location.href = "/"; }}>
                <Fa icon={faDownload} />
                <p>Download!</p>
            </button>
        </div>
    </div>;
}