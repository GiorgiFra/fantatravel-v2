import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { registerGlobalErrorHandler } from '../../utils/showGlobalError';
import {Alert, Snackbar} from "@mui/material";

interface ErrorContextType {
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);

    const showError = useCallback((message: string) => {
        setError(message);
        // Potresti aggiungere un timer per auto-chiudere o usare Snackbar
    }, []);

    useEffect(() => {
        registerGlobalErrorHandler(showError); // ✅ collegamento con Axios
    }, [showError]);

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            {/* Snackbar o alert globale */}
                <Snackbar open={!!error} onClose={() => setError(null)}
                          autoHideDuration={10000}
                          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 👈 qui!
                >
                    <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};
