import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile/>} />
                </Routes>
            </div>
        </Router>
    )
}

export default App