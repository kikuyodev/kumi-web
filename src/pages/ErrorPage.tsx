import "../styles/pages/error.scss";

export interface ErrorPageProps {
    code: number;
    message: string;
}

export function ErrorPage(props: ErrorPageProps) {
    return (
        <div class="error">
            <div class="error--background">
                <div class="error--background-cover" />
            </div>
            <div class="error--content">
                <div class="error--content-title">
                    {props.code}
                </div>
                <div class="error--content-subtitle">
                    Error
                </div>
                <div class="error--content-message">
                    {props.message.includes("E_") ? props.message.split(":")[1] : props.message}
                </div>
                <div class="error--content-buttons">
                    <a href="/home">Return home</a>
                </div>
            </div>
        </div>
    )
}