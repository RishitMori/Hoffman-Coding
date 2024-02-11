import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../utils/authLogin';
import FileCompressor from './home';
import Error from './error';
import loadingGif from '../utils/loading-7528_256.gif'; // Replace with the actual path to your loading GIF
function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (loading) {
        // Render loading indicator centered on the page
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <img src={loadingGif} alt="Loading..." />
            </div>
        );
    }

    return (
        <>
            <Router>
                <Routes>
                    {user === null ? <Route path="*" element={<Login />} />
                        : <>
                            <Route path="/" element={<FileCompressor />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<Error />} />
                        </>}
                </Routes>
            </Router>
        </>
    );
}

export default Home;
