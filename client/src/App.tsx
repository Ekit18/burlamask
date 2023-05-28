import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
// import { Context } from '.';
import AppRouter from './components/AppRouter';
import { UserData } from './store/UserStore';

const App = observer(() => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return setLoading(false)
    }, [])

    if (loading) {
        return <h2>loading</h2>
    }

    return (
        <React.StrictMode>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </React.StrictMode>
    );
})

export default App;
