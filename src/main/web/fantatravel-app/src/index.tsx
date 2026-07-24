import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n'
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from "./app/theme/theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {register} from "./serviceWorkerRegistration";
import {ErrorProvider} from "./app/component/error-context/ErrorContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter basename={"/fantatravel/app"}>
                    <ErrorProvider>
                        <App/>
                    </ErrorProvider>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// 👇 Registrazione del service worker
register();
