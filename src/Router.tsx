import { BrowserRouter, Routes , Route} from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Notfound from "./pages/Notfound";
import FileUploadSubassembly from "./pages/FileUploadSubassembly";
import FileUploadFab from "./pages/FileUploadFab";
import FileUploadAssembly from "./pages/FileUploadAssembly";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route element={<Notfound/>} /> 
              <Route path="/fabrication" element={<FileUploadFab/>}/>
              <Route path="/subassembly" element={<FileUploadSubassembly/>}/>
              <Route path="/assembly" element={<FileUploadAssembly/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router