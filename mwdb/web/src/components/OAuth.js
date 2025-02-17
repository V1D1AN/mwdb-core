import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import queryString from "query-string";

import { APIContext } from "@mwdb-web/commons/api/context";
import { AuthContext } from "@mwdb-web/commons/auth";
import { View, getErrorMessage } from "@mwdb-web/commons/ui";
import { ConfirmationModal, ShowIf } from "@mwdb-web/commons/ui";

export function OAuthLogin() {
    const api = useContext(APIContext);
    const [error, setError] = useState();
    const [providers, setProviders] = useState([]);
    const [chosenProvider, setChosenProvider] = useState();
    const [isRedirectModalOpen, setRedirectModalOpen] = useState(false);

    async function getProviders() {
        try {
            const response = await api.axios.get("/oauth");
            setProviders(response.data["providers"]);
        } catch (e) {
            setError(e);
        }
    }

    async function login(provider) {
        try {
            const response = await api.axios.post(
                `/oauth/${provider}/authenticate`
            );
            const expirationTime = Date.now() + 5 * 60 * 1000;
            sessionStorage.setItem(
                `openid_${response.data["state"]}`,
                JSON.stringify({
                    provider: provider,
                    nonce: response.data["nonce"],
                    action: "login",
                    expiration: expirationTime,
                })
            );
            window.location = response.data["authorization_url"];
        } catch (e) {
            setError(e);
        }
    }

    useEffect(() => {
        getProviders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View error={error}>
            <h2>External authentication</h2>
            <p>
                Select below the identity provider associated with your mwdb
                account. By clicking on the identity provider below you will be
                redirected to its authentication page.
            </p>
            <ShowIf condition={providers.length}>
                {providers.map((provider) => (
                    <div className="d-flex justify-content-center">
                        <div className="col-6 text-center">
                            <Link
                                href="#"
                                className="card btn-outline-secondary text-decoration-none"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    setChosenProvider(provider);
                                    setRedirectModalOpen(true);
                                }}
                            >
                                <div className="card-body">
                                    <h5>{provider}</h5>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </ShowIf>
            <ConfirmationModal
                isOpen={isRedirectModalOpen}
                onRequestClose={() => {
                    setRedirectModalOpen(false);
                    setChosenProvider("");
                }}
                onConfirm={(e) => {
                    e.preventDefault();
                    login(chosenProvider);
                }}
                message={`Are you sure you want to redirect to ${chosenProvider} provider`}
                buttonStyle="btn-danger"
            />
        </View>
    );
}

export function OAuthAuthorize() {
    const api = useContext(APIContext);
    const auth = useContext(AuthContext);
    const history = useHistory();
    // Current query set in URI path
    const { code, state } = queryString.parse(history.location.search);

    async function authorize() {
        const stateData = sessionStorage.getItem(`openid_${state}`);
        if (!stateData) {
            history.push("/", { error: "Invalid state data" });
        }
        const { provider, nonce, action, expiration } = JSON.parse(stateData);
        sessionStorage.removeItem(`openid_${state}`);
        try {
            const expirationTime = new Date(expiration);
            if (expirationTime > Date.now()) {
                if (action === "login") {
                    const response = await api.axios.post(
                        `/oauth/${provider}/authorize`,
                        {
                            code,
                            nonce,
                            state,
                        }
                    );
                    auth.updateSession(response.data);
                    history.replace("/");
                } else if (action === "bind_account") {
                    await api.axios.post(`/oauth/${provider}/bind_account`, {
                        code,
                        nonce,
                        state,
                    });
                    history.replace("/profile/oauth", {
                        success: "New external identity successfully added",
                    });
                }
            }
        } catch (e) {
            if (action === "bind_account")
                history.replace("/profile/oauth", {
                    error: getErrorMessage(e),
                });
            else history.replace("/", { error: getErrorMessage(e) });
        }
    }

    useEffect(() => {
        authorize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div>Wait for authorization...</div>;
}
