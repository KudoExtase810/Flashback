import "@/globals.css";
import { HashRouter, Route, Routes } from "react-router";
import Home from "@/pages/Home";
import Overlay from "@/pages/Overlay";
import Settings from "@/pages/Settings";

const App = () => (
    <HashRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/overlay" element={<Overlay />} />
        </Routes>
    </HashRouter>
);

export default App;
